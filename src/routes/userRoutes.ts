import express from "express"
import { signin, signup } from "../contollers/auth";
const router = express.Router();


router.post("/signup" , signup)
router.post("/signin" , signin)

module.exports = router;
