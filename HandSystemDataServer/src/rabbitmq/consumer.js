

import { RabbitMQVerifyPatientToken } from '../middlewares/authPatient.js'


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
                    const receivedMessage = JSON.parse(message.content.toString());
                    console.log({ receivedMessage })
                    const { data, type } = receivedMessage;
                    console.log(`Received message of type :`, data, type);
                    // console.log(type, process.env.TOEKN_VERI)
                    switch (type)
                    {
                        case process.env.TOEKN_VERI:
                            RabbitMQVerifyPatientToken(data, channel);
                            break;
                        case 'note_processing':
                            handleNoteProcessing(data);
                            break;
                        default:
                            console.warn(`Unhandled message type: "${type}"`);
                            break;
                    }


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
