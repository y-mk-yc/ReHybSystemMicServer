import express from "express";
import http from "http";
import cors from "cors";
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config();
const app = express();

const port = process.env.PORT || 3004;
const server = http.createServer(app);  // Pass `app` into `http.createServer()`

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


app.use(cors(corsOptions));  // Use custom CORS options here

// Define root route
app.get('/', (req, res) =>
{
    res.send('Welcome to the Express Data server!');
});

// Define route

// Start the server
server.listen(port, () =>
{
    console.log(`Server running on port ${port}`);
});
