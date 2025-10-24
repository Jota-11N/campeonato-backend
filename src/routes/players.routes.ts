import { Router } from "express";
import * as ctrl from "../controllers/players.controller";
import { auth } from "../middleware/auth";

const r = Router();

r.get("/", auth(false), ctrl.list);
r.post("/", auth(), ctrl.create);

export default r;
