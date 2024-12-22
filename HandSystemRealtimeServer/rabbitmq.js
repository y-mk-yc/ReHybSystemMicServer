// Replace the import with require
const { connect } = require('amqplib/callback_api');
const RABBITMQ_URL = 'amqp://rabbitmq';
let channel;
let connection;

// Connect to RabbitMQ
function connectRabbitMQ()
{
    connect(RABBITMQ_URL, (error, conn) =>
    {
        if (error)
        {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
        connection = conn;
        conn.createChannel((error1, ch) =>
        {
            if (error1)
            {
                console.error('Error creating RabbitMQ channel:', error1);
                throw error1;
            }
            channel = ch;
            console.log('RabbitMQ connected and channel created');
        });
    });
}

// Send a message to a queue
function sendToQueue(queue, message)
{
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent message: ${message}`);
}

// Receive messages from a queue
function receiveFromQueue(queue)
{
    channel.assertQueue(queue, { durable: false });
    console.log(`Waiting for messages in queue: ${queue}`);

    channel.consume(queue, (msg) =>
    {
        if (msg)
        {
            console.log(`Received message: ${msg.content.toString()}`);
        }
    }, { noAck: true });
}

// Export functions
module.exports = { connectRabbitMQ, sendToQueue, receiveFromQueue };
