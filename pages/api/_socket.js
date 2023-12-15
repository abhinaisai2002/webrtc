import { Server } from "socket.io";


const SocketHandler = (req, res) => {

    if (res.socket.server.io) return;

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
        console.log("connected", socket.id);
        socket.on("disconnect", () => {
            console.log("disconnected");
        });

        socket.on("join-room", (roomId, userId) => {
            console.log(roomId, userId);
            socket.join(roomId);
            socket.to(roomId).emit("user-connected", userId);
        });

        socket.on('user-settings', ({ roomId, settings }) => {
            console.log({ roomId, settings });
            socket.to(roomId).emit('user-settings', settings)
        })

        socket.on("message", ({ roomId, message }) => {
            console.log(roomId, message);
            socket.emit("message", { message, mine: true });
            socket.to(roomId).emit("message", { message, mine: false });
        });
    })

}

export default function handler(req, res) {
    console.log("socket");
    SocketHandler(req, res);
    res.end("hello");
}