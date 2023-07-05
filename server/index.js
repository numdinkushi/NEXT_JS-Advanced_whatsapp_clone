import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import {Server} from "socket.io";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads/images", express.static("uploads/images"));

app.use("/api/auth", AuthRoutes)
app.use("/api/messages", MessageRoutes)

const appPort = process.env.PORT;

const server = app.listen(appPort, ()=>{
    console.log(`App started on ${appPort}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000" || "https://localhost:3000"
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data)=>{
      const sendUserSocket = onlineUsers.get(data.to);
      if(sendUserSocket){
        socket.to(sendUserSocket).emit("msg-receive", {
            from: data.from,
            message: data.message
        })
      }
    })
})