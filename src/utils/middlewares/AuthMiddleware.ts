import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const secretKey = req.headers['authorization']?.split(' ')[1];
        const expectedKey = process.env.JWT_SECRET;

        if ( !secretKey || secretKey !== expectedKey) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        next();
    }
}