import { Router } from "express";
import * as ctrl from "../controllers/matches.controller";
import { auth } from "../middleware/auth";
const r = Router();
r.get("/", auth(false), ctrl.list);
r.post("/", auth(), ctrl.create);
r.post("/:id/score", auth(), ctrl.reportScore);
export default r;