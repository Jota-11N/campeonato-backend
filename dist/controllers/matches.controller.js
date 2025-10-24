"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportScore = exports.create = exports.list = void 0;
const prisma_1 = require("../lib/prisma");
const list = async (req, res) => {
    const { tournamentId } = req.query;
    const where = tournamentId ? { tournamentId: Number(tournamentId) } : {};
    const matches = await prisma_1.prisma.match.findMany({ where, orderBy: { date: "asc" }, include: { homeTeam: true, awayTeam: true, tournament: true } });
    res.json(matches);
};
exports.list = list;
const create = async (req, res) => {
    const { tournamentId, date, venue, homeTeamId, awayTeamId } = req.body;
    const m = await prisma_1.prisma.match.create({ data: { tournamentId, date: new Date(date), venue, homeTeamId, awayTeamId } });
    res.json(m);
};
exports.create = create;
const reportScore = async (req, res) => {
    const { id } = req.params;
    const { homeScore, awayScore } = req.body;
    const m = await prisma_1.prisma.match.update({ where: { id: Number(id) }, data: { homeScore, awayScore, status: "PLAYED" } });
    res.json(m);
};
exports.reportScore = reportScore;
