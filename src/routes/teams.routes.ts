import { Router } from "express";
import * as ctrl from "../controllers/teams.controller";
import { auth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const r = Router();

/**
 * 📋 Listar equipos
 */
r.get("/", auth(false), ctrl.list);

/**
 * ➕ Crear equipo
 */
r.post("/", auth(), ctrl.create);

/**
 * ✏️ Editar equipo
 */
r.put("/:id", auth(), async (req, res) => {
  const id = Number(req.params.id);
  const { name, shortName, logo, tournamentId } = req.body;

  try {
    const existing = await prisma.team.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Equipo no encontrado" });

    const team = await prisma.team.update({
      where: { id },
      data: { name, shortName, logo },
    });

    await prisma.teamTournament.deleteMany({ where: { teamId: id } });

    if (tournamentId && !isNaN(Number(tournamentId))) {
      const tId = Number(tournamentId);
      const tournament = await prisma.tournament.findUnique({ where: { id: tId } });
      if (tournament) {
        await prisma.teamTournament.create({
          data: { teamId: id, tournamentId: tId },
        });
      }
    }

    res.json(team);
  } catch (error) {
    console.error("❌ Error al editar equipo:", error);
    res.status(500).json({ error: "Error al editar equipo" });
  }
});

/**
 * 🗑️ Eliminar equipo
 */
r.delete("/:id", auth(), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.playerTeam.deleteMany({ where: { teamId: id } });
    await prisma.match.deleteMany({
      where: { OR: [{ homeTeamId: id }, { awayTeamId: id }] },
    });
    await prisma.teamTournament.deleteMany({ where: { teamId: id } });
    await prisma.team.delete({ where: { id } });
    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error al eliminar equipo:", error);
    res.status(500).json({ error: "Error al eliminar equipo" });
  }
});

/**
 * 👥 Jugadores de un equipo
 */
r.get("/:id/players", auth(false), ctrl.getTeamPlayers);

export default r;
