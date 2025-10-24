import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// 🧾 Listar jugadores con su equipo (si existe)
export const list = async (_: Request, res: Response) => {
  try {
    const players = await prisma.player.findMany({
      orderBy: { id: "desc" },
      include: {
        teams: {
          include: { team: true },
          take: 1, // solo mostramos el equipo actual (último asignado)
        },
      },
    });

    const data = players.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      number: p.number,
      position: p.position,
      createdAt: p.createdAt,
      team: p.teams[0]?.team || null,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error al listar jugadores:", err);
    res.status(500).json({ message: "Error al listar jugadores" });
  }
};

// 🧍 Crear jugador y asociarlo a un equipo
export const create = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, number, position, teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "Debe seleccionar un equipo" });
    }

    const player = await prisma.player.create({
      data: {
        firstName,
        lastName,
        number: Number(number) || null,
        position,
      },
    });

    // asociar jugador con el equipo
    await prisma.playerTeam.create({
      data: {
        playerId: player.id,
        teamId: Number(teamId),
      },
    });

    res.json(player);
  } catch (err) {
    console.error("Error al crear jugador:", err);
    res.status(500).json({ message: "Error al crear jugador" });
  }
};
