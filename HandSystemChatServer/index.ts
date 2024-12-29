// import express from "express";
// import http from "http";
// import cors from "cors";
// import chat from "./router/chat";
// import dotenv from 'dotenv';
// import Chat from "./models/chat";

// // Load environment variables from the .env file
// dotenv.config();
// const app = express();

// const port = process.env.PORT || 3001;
// const server = http.createServer(app);
// const io = require("socket.io")(server, {
//     cors: {
//         origin: "*", // Adjust this for production for better security
//     },
// });
// let allowedOrigins = [
//     "http://localhost:5173", //Therapist Dashboard
//     "http://localhost:8080", //Patient Dashboard
//     "http://localhost:8081", //badminton game
//     "http://localhost:3456", //ThirdParty Dashboard
// ];
// const corsOptions = {
//     //这个的作用是允许跨域
//     origin: (origin: any, callback: any) =>
//     {
//         // console.log("origin IP", origin);
//         // if (allowedOrigins.indexOf(origin) !== -1) {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1)
//         {
//             callback(null, true);
//         } else
//         {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true,
// };
// // Middleware
// app.use(express.json());
// app.use(cors(corsOptions)); // Use `cors()` to handle cross-origin requests

// // Define the Chat interface
// interface IChat
// {
//     _id: string;
//     sender: string;
//     receiver: string;
//     content: string;
// }

// // Define clients to store socket connections (not Chat objects)
// let clients: Record<string, any> = {}; // Store sockets
// // {
// //     _id:String,
// //     t1,
// //     t2,
// // }
// // Socket.IO connection
// io.on("connection", (socket: any) =>
// {
//     console.log(socket.id, "has joined");

//     socket.on("signin", async (id: string) =>
//     {
//         //When sigin, retrn the chat id back
//         console.log(`signin:${id}`);
//         //
//         clients[id] = socket; // Store socket for the user

//         //find check if have new chat history
//         var chats;
//         chats = await Chat.find({
//             read: true,
//             $or: [
//                 { talkerOne: id },
//                 { talkerTwo: id }
//             ]
//         })
//         console.log(chats)
//         socket.emit('signin', chats)
//     });

//     // Handle disconnection
//     socket.on("disconnect", () =>
//     {
//         console.log("A user disconnected");
//         // Clean up client socket when disconnecting
//         for (const id in clients)
//         {
//             if (clients[id] === socket)
//             {
//                 delete clients[id]; // Remove the socket from the clients list
//                 break;
//             }
//         }
//     });

//     // Handle message event
//     socket.on("message", (msg: IChat) =>
//     {
//         console.log(msg);
//         const { sender, receiver, content, _id } = msg;
//         const client = clients[receiver];
//         // const targetId=client.t1===msg.sender?client.t2:client.t1;
//         var chats;
//         chats = Chat.findById(msg._id);
//         if (clients[receiver])
//         {
//             clients[receiver].emit("message", msg); // Emit message to the receiver
//             //update database
//             Chat.updateOne({
//                 _id: _id
//             }, {
//                 $push: {
//                     content: {
//                         sender: sender,
//                         receiver: receiver,
//                         content: content
//                     }
//                 },
//                 $inc: { read: 1 },
//             })
//         } else
//         {
//             console.log(`User ${receiver} is offline. Message saved.`);
//             socket.emit("message_status", { status: "offline" });
//         }
//     });
// });

// app.get('/', (req, res) =>
// {

//     res.send('Welcome to the Express Note server!');
// });
// app.use('/chat', chat);

// // Start the server
// server.listen(port, () =>
// {
//     console.log(`Server running on port ${port}`);
// });
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

    socket.on("signin", async (id: string) =>
    {
        // When sign-in, return the chat history
        console.log(`signin:${id}`);
        clients[id] = socket; // Store socket for the user

        // console.log(clients)
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
        console.log("A user disconnected");
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
        // const client = clients[receiver];
        // let chats = Chat.findById(msg._id);
        // const char = Chat.findById(id)
        // console.log(char)
        const rt = await Chat.updateOne({
            _id: new ObjectId(id)
        }, {
            $push: {
                content: {
                    sender: sender,
                    receiver: receiver,
                    content: content
                }
            },
            $inc: { read: 1 },
        });
        console.log("there", rt)
        if (clients[receiver])
        {
            console.log("sent")
            console.log(new Date().toISOString())
            clients[receiver].emit("message", {
                sender: sender,
                receiver: receiver,
                content: content,
                time: new Date().toISOString()
            }); // Emit message to the receiver
            // Update database

        } else
        {
            console.log(`User ${receiver} is offline. Message saved.`);
            socket.emit("message_status", { status: "offline" });
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
