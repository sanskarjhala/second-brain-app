import express from "express"
import dotenv from "dotenv"
dotenv.config();
import { dbConnection } from "./db";
const userRoutes = require("./routes/userRoutes")

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;

//dataBase connection 
dbConnection();

app.use("/api/v1" ,userRoutes )

app.listen(PORT , () => {
    console.log(`app is running on port ${PORT}`)
})