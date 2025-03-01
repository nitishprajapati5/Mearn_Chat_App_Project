import socketAuthMiddleware from "../middleware/authMiddleware.js"
import jwt from "jsonwebtoken"
import prisma from "./dbConnection.js";
import cookie from "cookie"

export default function setupSocket (io){
    io.use(async(socket,next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers['auth'];
            //console.log(socket)
            //const token = cookie.parse(socket.handshake.headers.auth || "");
            //const token = cookies.auth;
            if(!token){
                return next(new Error("Authentication error:Token Required"))
            }

            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            const user = await prisma.user.findUnique({
                where:{
                    id:decoded.id
                }
            });

            if(!user){
                return next(new Error("Authentication error:Token Required"))
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket authentication failed:", error);
            return next(new Error("Authentication error"));
        }
    })

    io.on("connection",(socket) =>{
        //console.log(socket)
        socket.on("addRoom", async ({ name }) => { // Accept an object with { name }
            console.log("Received request to create room:", name);
        
            try {
                if (!name) {
                    return socket.emit("error", { message: "Room name is required" });
                }
        
                const room = await prisma.room.create({
                    data: {
                        name,
                        ownerId: socket.user.id // Use authenticated user's ID
                    }
                });
        
                socket.join(`room_${room.id}`); // Join the created room
                socket.emit("roomCreated", room); // Notify all clients
                
            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to create room" });
            }
        });

        socket.on("getAddRoomBasedofOwner",async () => {
            try {
                
                    const roomdetails = await prisma.room.findMany({
                        where:{
                            ownerId:socket.user.id
                        }
                    })

                    io.emit("getAddRoomBasedofOwner",roomdetails)
               
            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to getAddRoomBasedonOwner" });
            
            }
        })

        socket.on("joinroom",async ({roomId}) => {
            try {
                //userId
                //roomId
                const data = await prisma.roomMember.create({
                    data:{
                        room_id:roomId,
                        user_id:socket.user.id

                    }
                })

                if(data){
                    socket.emit("joinroom",data)
                }
                else{
                    socket.emit("error",{message:"Failed to join room"})
                }

            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to join room" });
            
            }
        })

        socket.on("listAllRooms",async() => {
            try {
                
                const data = await prisma.room.findMany({

                })

                console.log(data)
                socket.emit("listAllRooms",data)

            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to join room" });
            }
        })
        
    })

}

