import express from "express";
import http from "http";
import cors from "cors";
import chat from "./router/chat";
import dotenv from 'dotenv';
import Chat from "./models/chat";
import { ObjectId } from "mongodb";
// Load environment variables from the .env file
dotenv.config();
const app = express();

const port = process.env.PORT || 3002;
const server = http.createServer(app);  // Pass `app` into `http.createServer()`
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Adjust this for production for better security
    },
});

let allowedOrigins = [
    "http://localhost:5173", // Therapist Dashboard
    "http://localhost:8080", // Patient Dashboard
    "http://localhost:8081", // badminton game
    "http://localhost:3456", // ThirdParty Dashboard
];

const corsOptions = {
    origin: (origin: any, callback: any) =>
    {
        if (!origin || allowedOrigins.indexOf(origin) !== -1)
        {
            callback(null, true);
        } else
        {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

// Middleware
app.use(express.json());
// Define the Chat interface
interface IChat
{
    id: string;
    sender: string;
    receiver: string;
    content: string;
}

// Define clients to store socket connections (not Chat objects)
let clients: Record<string, any> = {}; // Store sockets

// Socket.IO connection
io.on("connection", (socket: any) =>
{
    console.log(socket.id, "has joined");

    socket.emit('connected');

    socket.on("signin", async (id: string) =>
    {
        // When sign-in, return the chat history
        console.log(`signin:${id}`);
        clients[id] = socket; // Store socket for the user
        // console.info()
        // Check if there are new chat histories
        let chats = await Chat.find({
            read: true,
            $or: [
                { t1: id },
                { t2: id },
            ]
        });

        socket.emit('signin', chats);
    });

    // Handle disconnection
    socket.on("disconnect", () =>
    {
        console.log("A user disconnected:");
        // Clean up client socket when disconnecting
        for (const id in clients)
        {
            if (clients[id] === socket)
            {
                delete clients[id]; // Remove the socket from the clients list
                break;
            }
        }
    });

    // Handle message event
    socket.on("message", async (msg: IChat) =>
    {
        console.log("Here", { msg });
        const { sender, receiver, content, id } = msg;
        console.log({ sender, receiver, content, id })
        try
        {
            const rt = await Chat.updateOne({
                _id: new ObjectId(id)
            }, {
                $push: {
                    contents: {
                        sender: sender,
                        receiver: receiver,
                        content: content
                    }
                },
                $inc: { read: 1 },
            });
            console.log({ clients })
            if (clients[receiver])
            {
                console.info("sent")
                clients[receiver].emit("message", {
                    sender: sender,
                    receiver: receiver,
                    content: content,
                    time: new Date().toISOString()
                });

            } else
            {
                console.log(`User ${receiver} is offline. Message saved.`);
                socket.emit("message_status", { status: "offline" });
            }
        } catch (error)
        {
            console.error('Send message error:', error)
        }

    });
});


app.use(cors(corsOptions));  // Use custom CORS options here

// Define root route
app.get('/', (req, res) =>
{
    res.send('Welcome to the Express Chat server!');
});

// Define /chat route
app.use('/chat', chat);

// Start the server
server.listen(port, () =>
{
    console.log(`Server running on port ${port}`);
});
