

export async function sendMessage(channel, queue, message)
{
    try
    {
        // const connection = await amqp.connect('amqp://localhost'); // RabbitMQ connection
        // const channel = await connection.createChannel();

        // await channel.assertQueue(queue, { durable: true }); // Declare a queue

        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message sent to queue "${queue}":`, message);

        await channel.close();
        await connection.close();
    } catch (error)
    {
        console.error('Error in sending message:', error);
    }
}
