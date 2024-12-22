
const express = require('express');
const app = express();
const { connectRabbitMQ, sendToQueue, receiveFromQueue } = require('./rabbitmq');

const PORT = process.env.PORT || 3002;

connectRabbitMQ();

// Middleware to parse JSON requests
app.use(express.json());

// Define a simple route
app.get('/', (req, res) =>
{
    res.send('Welcome to the Express server!');
});

sendToQueue(process.env.AUTH_QUEUE, "Hello, auth!");

// Define a route to handle POST requests
app.post('/data', (req, res) =>
{
    const { name, age } = req.body;
    res.json({ message: `Hello, ${name}. You are ${age} years old.` });
});

// Start the server
app.listen(PORT, () =>
{
    console.log(`Server is running on http://localhost:${PORT}`);
});
