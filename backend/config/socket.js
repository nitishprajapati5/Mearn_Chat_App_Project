import socketAuthMiddleware from "../middleware/authMiddleware.js"

export default (io) => {
    io.use(socketAuthMiddleware)
}

