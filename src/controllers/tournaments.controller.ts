import { Request, Response } from "express";
import { prisma } from "../lib/prisma";


export const list = async (_: Request, res: Response) => {
const tournaments = await prisma.tournament.findMany({ orderBy: { id: "desc" } });
res.json(tournaments);
};


export const create = async (req: Request, res: Response) => {
const data = req.body;
const t = await prisma.tournament.create({ data });
res.json(t);
};


export const addTeam = async (req: Request, res: Response) => {
const { tournamentId } = req.params as any;
const { teamId } = req.body;
const tt = await prisma.teamTournament.create({ data: { teamId: Number(teamId), tournamentId: Number(tournamentId) } });
res.json(tt);
};


export const standings = async (req: Request, res: Response) => {
const { tournamentId } = req.params as any;
const matches = await prisma.match.findMany({ where: { tournamentId: Number(tournamentId), status: "PLAYED" } });
// Calcular tabla: 3 pts victoria, 1 empate, 0 derrota
type Row = { teamId: number; pj: number; pg: number; pe: number; pp: number; gf: number; gc: number; pts: number };
const table = new Map<number, Row>();
const touch = (id: number) => table.set(id, table.get(id) ?? { teamId: id, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, pts:0 });


for (const m of matches) {
touch(m.homeTeamId); touch(m.awayTeamId);
const h = table.get(m.homeTeamId)!; const a = table.get(m.awayTeamId)!;
const hs = m.homeScore ?? 0; const as = m.awayScore ?? 0;
h.pj++; a.pj++; h.gf += hs; h.gc += as; a.gf += as; a.gc += hs;
if (hs > as) { h.pg++; h.pts += 3; a.pp++; }
else if (hs < as) { a.pg++; a.pts += 3; h.pp++; }
else { h.pe++; a.pe++; h.pts++; a.pts++; }
}


const rows = Array.from(table.values());
// Traer nombres
const teamIds = rows.map(r => r.teamId);
const teams = await prisma.team.findMany({ where: { id: { in: teamIds } } });
const byId = new Map(teams.map(t => [t.id, t]));
const resp = rows.map(r => ({
teamId: r.teamId,
teamName: byId.get(r.teamId)?.name ?? "",
...r,
dg: r.gf - r.gc
})).sort((x,y) => y.pts - x.pts || (y.gf - y.gc) - (x.gf - x.gc));


res.json(resp);
};