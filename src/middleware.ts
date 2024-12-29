import { NextFunction , Response, Request } from "express";
import jwt , {decode, JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const auth = async( req : Request , res: Response , next : NextFunction)=> {
    try{
        const JWT_SCERET  = process.env.JWT_SECERET;
        if(!JWT_SCERET){
            console.log("Jwt is not present in environment variables");
            return
        }

        const token = req.headers["authorization"];
        if(!token){
            return res.status(403).json({
                success:false,
                message:"Token is not present"
            })
        }
        const decoded = jwt.verify(token , JWT_SCERET)
        console.log(decoded);

        if(typeof decoded !== "object" || !decoded.id){
            res.status(403).json({
                success:false,
                message:"Token is invalid,  You are not logged in"
            })
            return
        }

        req.userId = decoded.id;
        next();
    } catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
            error:error,
        })
    }
}