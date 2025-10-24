"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrl = __importStar(require("../controllers/teams.controller"));
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../lib/prisma");
const r = (0, express_1.Router)();
/**
 * 📋 Listar equipos
 */
r.get("/", (0, auth_1.auth)(false), ctrl.list);
/**
 * ➕ Crear equipo
 */
r.post("/", (0, auth_1.auth)(), ctrl.create);
/**
 * ✏️ Editar equipo
 */
r.put("/:id", (0, auth_1.auth)(), async (req, res) => {
    const id = Number(req.params.id);
    const { name, shortName, logo, tournamentId } = req.body;
    try {
        const existing = await prisma_1.prisma.team.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ error: "Equipo no encontrado" });
        const team = await prisma_1.prisma.team.update({
            where: { id },
            data: { name, shortName, logo },
        });
        await prisma_1.prisma.teamTournament.deleteMany({ where: { teamId: id } });
        if (tournamentId && !isNaN(Number(tournamentId))) {
            const tId = Number(tournamentId);
            const tournament = await prisma_1.prisma.tournament.findUnique({ where: { id: tId } });
            if (tournament) {
                await prisma_1.prisma.teamTournament.create({
                    data: { teamId: id, tournamentId: tId },
                });
            }
        }
        res.json(team);
    }
    catch (error) {
        console.error("❌ Error al editar equipo:", error);
        res.status(500).json({ error: "Error al editar equipo" });
    }
});
/**
 * 🗑️ Eliminar equipo
 */
r.delete("/:id", (0, auth_1.auth)(), async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma_1.prisma.playerTeam.deleteMany({ where: { teamId: id } });
        await prisma_1.prisma.match.deleteMany({
            where: { OR: [{ homeTeamId: id }, { awayTeamId: id }] },
        });
        await prisma_1.prisma.teamTournament.deleteMany({ where: { teamId: id } });
        await prisma_1.prisma.team.delete({ where: { id } });
        res.json({ ok: true });
    }
    catch (error) {
        console.error("❌ Error al eliminar equipo:", error);
        res.status(500).json({ error: "Error al eliminar equipo" });
    }
});
/**
 * 👥 Jugadores de un equipo
 */
r.get("/:id/players", (0, auth_1.auth)(false), ctrl.getTeamPlayers);
exports.default = r;
