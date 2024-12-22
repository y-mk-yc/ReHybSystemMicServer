

export async function consumeMessages(channel, queue)
{
    try
    {
        // const connection = await amqp.connect('amqp://localhost'); // RabbitMQ connection
        // const channel = await connection.createChannel();

        // await channel.assertQueue(queue, { durable: true }); // Declare a queue

        console.log(`Waiting for messages in queue "${queue}"...`);

        channel.consume(
            queue,
            (message) =>
            {
                if (message)
                {
                    console.log(`Received message:`, message.content.toString());
                    channel.ack(message); // Acknowledge the message
                }
            },
            { noAck: false } // Ensure manual acknowledgment
        );
    } catch (error)
    {
        console.error('Error in consuming message:', error);
    }
}
