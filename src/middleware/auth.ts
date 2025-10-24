import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
user?: { id: number; role: string };
}


export function auth(required = true) {
return (req: AuthRequest, res: Response, next: NextFunction) => {
const header = req.headers.authorization;
if (!header) {
if (!required) return next();
return res.status(401).json({ message: "Token requerido" });
}
const token = header.replace("Bearer ", "");
try {
const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
req.user = { id: payload.id, role: payload.role };
next();
} catch (e) {
return res.status(401).json({ message: "Token inválido" });
}
};
}