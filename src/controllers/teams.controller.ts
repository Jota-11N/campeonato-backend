import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * 📋 Listar equipos
 */
export const list = async (_: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        tournaments: {
          include: { tournament: true },
        },
      },
      orderBy: { id: "desc" },
    });
    res.json(teams);
  } catch (error) {
    console.error("❌ Error al listar equipos:", error);
    res.status(500).json({ error: "Error al listar equipos" });
  }
};

/**
 * ➕ Crear nuevo equipo
 */
export const create = async (req: Request, res: Response) => {
  try {
    const { name, shortName, logo, tournamentId } = req.body;

    const team = await prisma.team.create({
      data: { name, shortName, logo },
    });

    if (tournamentId && !isNaN(Number(tournamentId))) {
      await prisma.teamTournament.create({
        data: {
          teamId: team.id,
          tournamentId: Number(tournamentId),
        },
      });
    }

    res.json(team);
  } catch (error) {
    console.error("❌ Error al crear equipo:", error);
    res.status(500).json({ error: "Error al crear equipo" });
  }
};

/**
 * 👥 Obtener jugadores de un equipo
 */
export const getTeamPlayers = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        players: {
          include: { player: true },
        },
      },
    });

    if (!team) return res.status(404).json({ error: "Equipo no encontrado" });

    res.json({
      id: team.id,
      name: team.name,
      players: team.players.map((p) => p.player),
    });
  } catch (error) {
    console.error("❌ Error al obtener jugadores:", error);
    res.status(500).json({ error: "Error al obtener jugadores del equipo" });
  }
};
