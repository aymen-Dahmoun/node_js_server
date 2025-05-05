
import { register, login } from "../controllers/authController.js";
import express from "express";
import { authMiddleware } from "../middleWare/authMiddleware.js";

export const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/profile", authMiddleware, (req, res)=>{
    return res.json({msg: 'welcome to your profile!'})
})

