"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function auth(required = true) {
    return (req, res, next) => {
        const header = req.headers.authorization;
        if (!header) {
            if (!required)
                return next();
            return res.status(401).json({ message: "Token requerido" });
        }
        const token = header.replace("Bearer ", "");
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = { id: payload.id, role: payload.role };
            next();
        }
        catch (e) {
            return res.status(401).json({ message: "Token inválido" });
        }
    };
}
