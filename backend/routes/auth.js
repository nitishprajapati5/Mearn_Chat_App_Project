import prisma from '../config/dbConnection.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()


router.post("/register", async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const salt = await bcrypt.genSalt(10);

        console.log(password);

        // Find if email already exists
        const emailFound = await prisma.user.findFirst({
            where: { email: email }
        });

        if (emailFound) {
            return res.status(409).json(new ApiResponse(409, null, "Email Already Exists"));
        }

        const hashedPassword = await bcrypt.hash(password, salt);

        const data = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
            }
        });
        
        const generateToken = jwt.sign({ id: data.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie('auth',generateToken,{
            sameSite:'none',
            httpOnly:true,
            secure:false,
            maxAge:900000,
            expires:new Date(Date.now()) + 900000
        })
        return res.status(201).json(new ApiResponse(201, data, "User Created Successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Something Went Wrong"));
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const data = await prisma.user.findFirst({
            where: { email }
        });

        if (!data) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        const isPasswordMatch = await bcrypt.compare(password, data.password);
        if (!isPasswordMatch) {
            return res.status(401).json(new ApiResponse(401, null, "Invalid Password"));
        }

        const generateToken = jwt.sign({ id: data.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("auth", generateToken, {
            sameSite: "none",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 900000, 
            expires: new Date(Date.now() + 900000)
        });

        return res.status(200).json(new ApiResponse(200, data, "Login Successfully"));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Something Went Wrong"));
    }
});


export default router;