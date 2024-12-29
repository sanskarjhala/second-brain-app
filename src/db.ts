import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


export const dbConnection =(): void => {
    const url: string | undefined = process.env.MONGO_URL;

    if(!url){
        console.log("Connection string is not in the environment variables");
        process.exit(1);
    }
    
    mongoose.connect(url)
    .then(() => {
        console.log("Db connected successfully")
    })
    .catch((error) => {
        console.log("Error while connecting to the databse: " , error);
        process.exit(1);
    })
}


