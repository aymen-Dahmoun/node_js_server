import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../models/User.js";
import bcrypt from "bcryptjs";

const generateToken = (userId)=>{
    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    })
}

export const register = async (req, res)=> {
    const {email, password, name, role} = req.body
    try {
        const exist = await getUserByEmail(email);
        // console.log('exist', exist)
        if (exist.email) {
            // console.log("user exists")
            return res.status(401).json({msg: "user exists", exist: exist})
        }
        const user = await createUser(email, password, name, role)
        // console.log('user', user)
        const token = generateToken(user.id)
        res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token,
            },
            message: "User created successfully!",
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}

export const login = async (req, res)=> {
    const {email, password} = req.body
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({msg: "user not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({msg: "invalid credentials"})
        }
        const token = generateToken(user.id)
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
            message: "User logged in successfully!",
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}
