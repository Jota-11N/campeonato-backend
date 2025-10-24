"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const r = (0, express_1.Router)();
r.get("/", async (_, res) => {
    const data = await prisma_1.prisma.tournament.findMany({ orderBy: { id: "desc" } });
    res.json(data);
});
r.post("/", async (req, res) => {
    const data = await prisma_1.prisma.tournament.create({ data: req.body });
    res.json(data);
});
r.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const data = await prisma_1.prisma.tournament.update({ where: { id }, data: req.body });
    res.json(data);
});
r.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.prisma.tournament.delete({ where: { id } });
    res.json({ ok: true });
});
exports.default = r;
