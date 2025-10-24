"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standings = exports.addTeam = exports.create = exports.list = void 0;
const prisma_1 = require("../lib/prisma");
const list = async (_, res) => {
    const tournaments = await prisma_1.prisma.tournament.findMany({ orderBy: { id: "desc" } });
    res.json(tournaments);
};
exports.list = list;
const create = async (req, res) => {
    const data = req.body;
    const t = await prisma_1.prisma.tournament.create({ data });
    res.json(t);
};
exports.create = create;
const addTeam = async (req, res) => {
    const { tournamentId } = req.params;
    const { teamId } = req.body;
    const tt = await prisma_1.prisma.teamTournament.create({ data: { teamId: Number(teamId), tournamentId: Number(tournamentId) } });
    res.json(tt);
};
exports.addTeam = addTeam;
const standings = async (req, res) => {
    const { tournamentId } = req.params;
    const matches = await prisma_1.prisma.match.findMany({ where: { tournamentId: Number(tournamentId), status: "PLAYED" } });
    const table = new Map();
    const touch = (id) => table.set(id, table.get(id) ?? { teamId: id, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, pts: 0 });
    for (const m of matches) {
        touch(m.homeTeamId);
        touch(m.awayTeamId);
        const h = table.get(m.homeTeamId);
        const a = table.get(m.awayTeamId);
        const hs = m.homeScore ?? 0;
        const as = m.awayScore ?? 0;
        h.pj++;
        a.pj++;
        h.gf += hs;
        h.gc += as;
        a.gf += as;
        a.gc += hs;
        if (hs > as) {
            h.pg++;
            h.pts += 3;
            a.pp++;
        }
        else if (hs < as) {
            a.pg++;
            a.pts += 3;
            h.pp++;
        }
        else {
            h.pe++;
            a.pe++;
            h.pts++;
            a.pts++;
        }
    }
    const rows = Array.from(table.values());
    // Traer nombres
    const teamIds = rows.map(r => r.teamId);
    const teams = await prisma_1.prisma.team.findMany({ where: { id: { in: teamIds } } });
    const byId = new Map(teams.map(t => [t.id, t]));
    const resp = rows.map(r => ({
        ...r, // r ya contiene teamId, pj, pg, pe, pp, gf, gc, pts
        teamName: byId.get(r.teamId)?.name ?? "",
        dg: r.gf - r.gc
    })).sort((x, y) => y.pts - x.pts || (y.gf - y.gc) - (x.gf - x.gc));
    res.json(resp);
};
exports.standings = standings;
