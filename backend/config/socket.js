import socketAuthMiddleware from "../middleware/authMiddleware.js"
import jwt from "jsonwebtoken"
import prisma from "./dbConnection.js";
import cookie from "cookie"

export default function setupSocket (io){
    io.use(async(socket,next) => {
        try {
            console.log(socket)
            const token = socket.handshake.auth?.token || socket.handshake.headers['auth'];
            //console.log(socket)
            //const token = cookie.parse(socket.handshake.headers.auth || "");
            //const token = cookies.auth;

            // var cookief = socket.handshake.headers.cookie;
            // var cookies = cookie.parse(socket.handshake.headers.cookie);

            // console.log('Logging Cookies',cookies)
            console.log(token)


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
            socket.emit("error",error)
            // return next(new Error("Authentication error"));
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

                //add the User to Room

                const addingUser = await prisma.roomMember.create({
                    data:{
                        room_id:room.id,
                        user_id:socket.user.id
                    }
                })

                const allRoomData = await prisma.room.findMany({
                    where:{
                        ownerId:socket.user.id
                    }
                })
        
                socket.join(`room_${room.id}`); // Join the created room
                socket.emit("roomCreated", allRoomData); // Notify all clients
                
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
                console.log("Listing All Rooms")
                console.log(socket.user.id)
                // const data = await prisma.room.findMany({
                //     where:{
                //         AND:{
                //             NOT:{
                //                 ownerId:socket.user.id
                //             },
                //         },               
                //         members:{
                //             some:{
                //                 id:{
                //                     notIn:socket.user.id
                //                 }
                //             }
                //         }
                    
                        
                //     },
                // })

                const data = await prisma.room.findMany({
                    where: {
                      ownerId: {
                        not: socket.user.id, // Exclude rooms owned by user 5
                      }
                    }
                  });
                  
                console.log(data)
                socket.emit("receiveAllRooms",data)
                //io.emit("listAllRooms",data)
            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to join room" });
            }
        })

        socket.on("userRooms",async() =>{
            try {
                console.log("Listing User Room")
                const data = await prisma.room.findMany({
                    where:{
                        ownerId:socket.user.id
                    }
                })

                console.log(data)
                socket.emit("sendUserRooms",data)
            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to join room" });
            
            }
        })

        socket.on("userJoinedRoomWhereUserJoined",async() => {
            try {
              
                // const rooms = await prisma.room.findMany({
                //     where:{
                //         ownerId:{
                //             not:socket.user.id
                //         },
                //         members:{
                //             some:{
                //                 id:{
                //                     not:socket.user.id
                //                 }
                //             }
                //         },
                //     },
                // })
                // const rooms = await prisma.room.findMany({
                //     where: {
                //       ownerId: {
                //         not: socket.user.id, // Exclude rooms owned by user 5
                //       },
                //       members: {
                //         some: {
                //           user_id: {
                //             not: socket.user.id, // Ensure at least one member is NOT user 5
                //           },
                //         },
                //       },
                //     },
                //   });

                  const rooms = await prisma.room.findMany({
                    where: {
                      ownerId: {
                        not: socket.user.id, // Exclude rooms owned by user 5
                      }
                    }
                  });
                  

                  //console.log("Excluding and Including",rooms)
                  socket.emit("userRecievedJoinedRoomWhereUserJoined",rooms)

                //console.log(data)
            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to join room" });
            
            }
        })

        socket.on("joinRoom",async({roomId}) => {
            try {
                console.log(roomId)
                 const data = await prisma.roomMember.create({
                    data:{
                        room_id:roomId,
                        user_id:socket.user.id
                    }
                 })
            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to join room" });
            
            }
        })

        socket.on("getRoomName",async({roomId}) =>{
            try {
                console.log("Room Id",roomId)
                const data = await prisma.room.findUnique({
                    where:{
                        id:parseInt(roomId)
                    }
                })
                console.log(data)
                socket.emit("receiveRoomName",data)
            } catch (error) {
                console.error("Error creating room:", error);
                socket.emit("error", { message: "Failed to join room" });
            
            }
        })

        socket.on('getUserfromRooom',async({roomId}) => {
            try {
                console.log("Get User from Room",roomId)

                const data = await prisma.roomMember.findMany({
                    where:{
                        room_id:parseInt(roomId)
                    },
                    include:{
                        user:true
                    }
                })

                console.log("Get User from Room",data)
                socket.emit("receiveUserfromRoom",data)
            } catch (error) {
                console.log(error)
            }
        })

        socket.on("message",async({content,roomId}) => {
            console.log("On Message",content,roomId)
            try {
                const data = await prisma.message.create({
                    data:{
                        content:content,
                        room_id:parseInt(roomId),
                        userId:socket.user.id
                    }
                })

                const allMessages = await prisma.message.findMany({
                    where:{
                        room_id:parseInt(roomId),
                    },
                    orderBy:{
                        createdAt:'desc'
                    },
                    include:{
                        user:true,
                    }
                })

                const finalData = {
                    allMessages,
                    user:socket.user
                }



                console.log(finalData)
                socket.emit("getAllMessages",finalData)

            } catch (error) {
                console.log(error)
            }
        })

        socket.on("onGetAllMessages",async({roomId}) => {

            try {
                const allMessages = await prisma.message.findMany({
                    where:{
                        room_id:parseInt(roomId),
                    },
                    orderBy:{
                        createdAt:'asc'
                    },
                    include:{
                        user:true,
                    }

                })

                socket.emit("receiveAllMessage",{allMessages,user:socket.user})
            } catch (error) {
                
            }
        })
        
    })

}

