import  jwt  from "jsonwebtoken";
import cookie from "cookie";
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const socketAuthMiddleware = (socket,next) => {
    const cookie = cookie.parse(socket.handshake.headers.cookie || "");

    const token = cookie.token

    if(!token){
        return next(new Error("Authentication error:No token provided"))
    }

    jwt.verify(token,SECRET_KEY,(err,decoded) =>{
        if(err){
            return next(new Error("Authentication error:Invalid token"))
        }
        socket.user = decoded;
        next();
    });
};

export default socketAuthMiddleware