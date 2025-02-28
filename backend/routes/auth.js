import prisma from '../config/dbConnection'
import { ApiError } from './utils/ApiError'
import { ApiResponse } from './utils/ApiResponse'

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post("/register",async (req,res) =>{
    try {
        const {email,name,password} = req.body
        const salt = bcrypt.genSalt(10);

        //Find the Unique Email
        const emailFound = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if(emailFound){
            return new ApiResponse(409,emailFound,"Email Already Exists")
        }

        const hashedPassword = bcrypt.hash(password,salt)

        const data = await prisma.user.create({
            data:{
                email:email,
                password:hashedPassword,
                name:name,
            }
        })

        return new ApiResponse(200,data,"User Created Successfully")


    } catch (error) {
        console.log(error)
        return new ApiError(500,
            "Something Went Wrong"
        )   
    }
})

router.post("/login",async (req,res) => {
    try {
        const {email,password} = req.body
        
        const data = await prisma.user.findFirst({
            where:{
                email
            }
        })

        const isPasswordMatch = bcrypt.compare(password,data.password)

        if(isPasswordMatch){
            return new ApiResponse(200,data,"Login Successfully")
        }
        
        return new ApiResponse(400,data,"Invalid Password")

    } catch (error) {
        console.log(error)
        return new ApiError(500,
            "Something Went Wrong"
        )   
    }
})

export default router;