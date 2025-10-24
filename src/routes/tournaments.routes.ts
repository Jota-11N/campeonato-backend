import { Router } from "express";
import { prisma } from "../lib/prisma";
const r = Router();

r.get("/", async (_, res) => {
  const data = await prisma.tournament.findMany({ orderBy: { id: "desc" } });
  res.json(data);
});

r.post("/", async (req, res) => {
  const data = await prisma.tournament.create({ data: req.body });
  res.json(data);
});

r.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.tournament.update({ where: { id }, data: req.body });
  res.json(data);
});

r.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.tournament.delete({ where: { id } });
  res.json({ ok: true });
});

export default r;
