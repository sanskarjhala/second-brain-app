import { Schema , model } from "mongoose";

const userSchema = new Schema({
    email: {type: String , unique:true},
    userName : {type : String , unique: true},
    password: String
})

export const UserModel = model("User" , userSchema)

