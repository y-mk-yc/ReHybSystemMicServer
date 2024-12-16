const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Adjust this for production for better security
    },
});

// Middleware
app.use(express.json());
app.use(cors()); // Fixed: Use `cors()`

var clients = {};


// Socket.IO connection
io.on("connection", (socket) =>
{
    console.log(socket.id, "has joined");
    socket.on("signin", (id) =>
    {
        console.log(`signin:${id}`);
        clients[id] = socket;
        // console.log(clients)
    })
    // Handle disconnection
    socket.on("disconnect", () =>
    {
        console.log("A user disconnected");
    });

    // Example of a custom event
    // socket.on("message", (data) =>
    // {
    //     console.log("Message received:", data);

    //     io.emit("message", data);
    // });
    socket.on("message", (msg) =>
    {
        console.log(msg);
        let targetId = msg.targetId;
        if (clients[targetId]) clients[targetId].emit("message", msg);
    });
});

// Start the server
server.listen(port, () =>
{
    console.log(`Server running on port ${port}`);
});
