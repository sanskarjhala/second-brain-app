import { UserModel } from "../models";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import {string, z} from "zod"
import bcrypt from "bcrypt"
import dotenv from "dotenv";
dotenv.config();

export const signup  = async (req: Request, res:Response): Promise<void> => {
    try {
      const requireBody =z.object({
        email: z.string().min(3).max(100).email(),
        userName: z.string().min(6).max(100),
        password:z.string().min(3).max(100)
      })           

      const parseData = requireBody.safeParse(req.body);
      console.log(parseData);
      console.log(req.body);
      if(!parseData.success){
        res.status(411).json({
            success:false,
            message:"invalid format",
            error: parseData.error
        })
        return
      }

      const {email , userName , password} = req.body;

      const existingUser = await UserModel.findOne({email});
      if(existingUser){
        res.status(403).json({
            success:false,
            message:"User already exists"
        })
        return
      }

      let hashedPassword = await bcrypt.hash(password , 10);
      const user = await UserModel.create({
        email:email,
        userName:userName,
        password:hashedPassword,
      })

      res.status(200).json({
        success:true,
        message:"User sign up  successfully",
        user:user
      })
      
    } catch (error) {
        console.error("Error during signup:", error); // Log the error for debugging
        res.status(500).json({
            success:false,
            message:"Something went wrong while signing up",
            error:error
        });
        return
    }
}

export const signin  = async (req: Request, res:Response): Promise<void> =>{
    try {
        const JWT_SCERET: string | undefined = process.env.JWT_SCERET
        if(!JWT_SCERET){
            return
        }
        const {email , password} = req.body;
        
        if(!email || !password){
            res.status(400).json({
                success:false,
                message:"Both email and password is required"
            })
            return 
        }

        const user = await UserModel.findOne({email:email})
        if(!user){
            res.status(404).json({
                success:false,
                message:"User not found",
            })
            return;
        }
        //@ts-ignore
        const passwordMatch = await bcrypt.compare(password , user.password);
        if(passwordMatch){
            const token = jwt.sign({id: user._id}, JWT_SCERET)
            res.status(200).json({
                success:true,
                token:token,
                user:{
                    email:user.email,
                    name:user.userName,
                }
            })
            return
        }
        else{
            res.status(403).json({
                success:false,
                message:"Wrong Credentials"
            })
            return;
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while signing in",
            error:error
        })
    }
}