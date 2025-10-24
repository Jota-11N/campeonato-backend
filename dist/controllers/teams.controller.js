"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamPlayers = exports.create = exports.list = void 0;
const prisma_1 = require("../lib/prisma");
/**
 * 📋 Listar equipos
 */
const list = async (_, res) => {
    try {
        const teams = await prisma_1.prisma.team.findMany({
            include: {
                tournaments: {
                    include: { tournament: true },
                },
            },
            orderBy: { id: "desc" },
        });
        res.json(teams);
    }
    catch (error) {
        console.error("❌ Error al listar equipos:", error);
        res.status(500).json({ error: "Error al listar equipos" });
    }
};
exports.list = list;
/**
 * ➕ Crear nuevo equipo
 */
const create = async (req, res) => {
    try {
        const { name, shortName, logo, tournamentId } = req.body;
        const team = await prisma_1.prisma.team.create({
            data: { name, shortName, logo },
        });
        if (tournamentId && !isNaN(Number(tournamentId))) {
            await prisma_1.prisma.teamTournament.create({
                data: {
                    teamId: team.id,
                    tournamentId: Number(tournamentId),
                },
            });
        }
        res.json(team);
    }
    catch (error) {
        console.error("❌ Error al crear equipo:", error);
        res.status(500).json({ error: "Error al crear equipo" });
    }
};
exports.create = create;
/**
 * 👥 Obtener jugadores de un equipo
 */
const getTeamPlayers = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const team = await prisma_1.prisma.team.findUnique({
            where: { id },
            include: {
                players: {
                    include: { player: true },
                },
            },
        });
        if (!team)
            return res.status(404).json({ error: "Equipo no encontrado" });
        res.json({
            id: team.id,
            name: team.name,
            players: team.players.map((p) => p.player),
        });
    }
    catch (error) {
        console.error("❌ Error al obtener jugadores:", error);
        res.status(500).json({ error: "Error al obtener jugadores del equipo" });
    }
};
exports.getTeamPlayers = getTeamPlayers;
