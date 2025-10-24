"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tournaments_routes_1 = __importDefault(require("./routes/tournaments.routes"));
const teams_routes_1 = __importDefault(require("./routes/teams.routes"));
const players_routes_1 = __importDefault(require("./routes/players.routes"));
const matches_routes_1 = __importDefault(require("./routes/matches.routes"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"] }));
exports.app.use(express_1.default.json());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.get("/api/health", (_, res) => res.json({ ok: true }));
exports.app.use("/api/auth", auth_routes_1.default);
exports.app.use("/api/tournaments", tournaments_routes_1.default);
exports.app.use("/api/teams", teams_routes_1.default);
exports.app.use("/api/players", players_routes_1.default);
exports.app.use("/api/matches", matches_routes_1.default);
exports.app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
});
