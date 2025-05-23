import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction } from "express";

@Injectable()
export class LoggerMidddleware implements NestMiddleware {
    use(req:Request , res:Response , next : NextFunction){
        console.log(`[logger] ${req.method} ${req.originalUrl}`);
        next();
    }
}