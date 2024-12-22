import express, { json } from 'express';
import 'dotenv/config';
import amqp from 'amqplib';
import { consumeMessages } from './consumer.js';
const connection = await amqp.connect('amqp://localhost'); // RabbitMQ connection
const channel = await connection.createChannel();

const queue = process.env.MY_QUEUE;
const app = express();
const PORT = process.env.PORT || 3004;

// Middleware to parse JSON requests
app.use(json());

// Define a simple route
app.get('/', (req, res) =>
{
    res.send('Welcome to the Express server!');
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

// Define a route to handle POST requests
app.post('/data', (req, res) =>
{
    const { name, age } = req.body;
    res.json({ message: `Hello, ${name}. You are ${age} years old.` });
});

// Start the server
app.listen(PORT, async () =>
{
    console.log(`Server is running on http://localhost:${PORT}`);
    await setupRabbitMQ(); // Initialize RabbitMQ when the server starts
});
