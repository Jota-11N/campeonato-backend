import { Request, Response } from "express";
import { prisma } from "../lib/prisma";


export const list = async (req: Request, res: Response) => {
const { tournamentId } = req.query;
const where = tournamentId ? { tournamentId: Number(tournamentId) } : {};
const matches = await prisma.match.findMany({ where, orderBy: { date: "asc" }, include: { homeTeam: true, awayTeam: true, tournament: true } });
res.json(matches);
};


export const create = async (req: Request, res: Response) => {
const { tournamentId, date, venue, homeTeamId, awayTeamId } = req.body;
const m = await prisma.match.create({ data: { tournamentId, date: new Date(date), venue, homeTeamId, awayTeamId } });
res.json(m);
};


export const reportScore = async (req: Request, res: Response) => {
const { id } = req.params as any;
const { homeScore, awayScore } = req.body;
const m = await prisma.match.update({ where: { id: Number(id) }, data: { homeScore, awayScore, status: "PLAYED" } });
res.json(m);
};