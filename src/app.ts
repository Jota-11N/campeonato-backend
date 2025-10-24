import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import tournamentsRoutes from "./routes/tournaments.routes";
import teamsRoutes from "./routes/teams.routes";
import playersRoutes from "./routes/players.routes";
import matchesRoutes from "./routes/matches.routes";


dotenv.config();


export const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"] }));
app.use(express.json());
app.use(morgan("dev"));


app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentsRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/players", playersRoutes);
app.use("/api/matches", matchesRoutes); 

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});