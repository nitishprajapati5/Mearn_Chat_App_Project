import express from "express"
import http from 'http'
import  {Server}  from "socket.io"
import cors from "cors"
import cookieParser from "cookie-parser"
import setupSocket from "./config/socket.js"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"

dotenv.config()



const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:
    {
        origin:"http://localhost:3001",
        credentials:true
    }
})
setupSocket(io)


app.use(express.json())
app.use(cookieParser())
app.use(
    cors(
        {
            origin:"http://localhost:3001",
            credentials:true
        }
    )
)


app.use("/api/",authRoutes)

const PORT = process.env.PORT || 5000;
server.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
