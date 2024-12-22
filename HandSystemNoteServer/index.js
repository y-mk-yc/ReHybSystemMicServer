/* eslint-disable no-undef */
import express from 'express';
import 'dotenv/config';
import amqp from 'amqplib';
import { sendMessage } from './rabbitmq/producer.js';
import { consumeMessages } from './rabbitmq/consumer.js';
import noteRouter from './src/routers/noteRouter.js';
import commentRouter from './src/routers/commentRouter.js';
import cors from "cors";
import { addRequest } from './rabbitmq/requestTracker.js';
import { generateRequestId } from './rabbitmq/generateRequestId.js'
const app = express();
const PORT = process.env.PORT || 3003;
const connection = await amqp.connect('amqp://localhost'); // RabbitMQ connection
const channel = await connection.createChannel();
let allowedOrigins = [
    "http://localhost:5173", //Therapist Dashboard
    "http://localhost:8080", //Patient Dashboard
    "http://localhost:8081", //badminton game
    "http://localhost:3456", //ThirdParty Dashboard
];
const corsOptions = {
    //这个的作用是允许跨域
    origin: (origin, callback) =>
    {
        // console.log("origin IP", origin);
        // if (allowedOrigins.indexOf(origin) !== -1) {
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
const queue = process.env.MY_QUEUE;
// Middleware to parse JSON requests
app.use(express.json());

// Define a simple route
app.get('/', (req, res) =>
{

    test()
    res.send('Welcome to the Express Note server!');
});

async function setupRabbitMQ()
{
    try
    {

        await channel.assertQueue(queue, { durable: true }); // Declare a queue

        console.log(`Queue "${queue}" is ready!`);
        consumeMessages(channel, queue); // Pass channel and queue to consumeMessages
    } catch (error)
    {
        console.error('Error setting up RabbitMQ:', error);
    }
}


// Middleware to verify token
const verifyTokenWithAuthServer = async (req, res, next) =>
{
    if (req.body.userType == 'P')
    {
        const token = req.headers['x-access-token'];

        if (!token)
        {
            return res.status(403).send("A token is required for authentication");
        }

        try
        {

            const requestId = generateRequestId()
            addRequest(requestId, req, res, next);
            const event = { data: { msg: { token }, sender: process.env.MY_QUEUE, requestId: requestId }, type: process.env.TOEKN_VERI }; // Attach requestId and context to the message
            await sendMessage(channel, process.env.AUTH_QUEUE, event);

        } catch (error)
        {
            console.error("Error during token verification:", error);
            return res.status(500).send("Authentication failed");
        }
    }
    next()
};



app.use(cors(corsOptions));
app.use('/note', verifyTokenWithAuthServer, noteRouter);
app.use('/comment', verifyTokenWithAuthServer, commentRouter);

async function shutdown()
{
    console.log('Shutting down server...');
    try
    {
        if (channel)
        {
            console.log('Closing RabbitMQ channel...');
            await channel.close();
        }
        if (connection)
        {
            console.log('Closing RabbitMQ connection...');
            await connection.close();
        }
        console.log('RabbitMQ connection and channel closed.');
    } catch (error)
    {
        console.error('Error while closing RabbitMQ:', error);
    }
    process.exit(0);
}
// Handle termination signals
process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signal (e.g., from a container)

// Start the server
app.listen(PORT, async () =>
{
    console.log(`Server is running on http://localhost:${PORT}`);
    await setupRabbitMQ();
});
