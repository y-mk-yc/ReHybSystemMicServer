
import { getRequest, removeRequest } from './requestTracker.js'
export async function consumeMessages(channel, queue)
{
    try
    {
        console.info(`Waiting for messages in queue "${queue}"...`);

        channel.consume(
            queue,
            (message) =>
            {
                if (message)
                {
                    const receivedMessage = JSON.parse(message.content.toString());
                    const { data, type } = receivedMessage;
                    switch (type)
                    {
                        case process.env.TOKEN_VERI: {
                            const trackedRequest = getRequest(data.requestId);
                            if (trackedRequest)
                            {
                                if (!data.msg.valid)
                                {
                                    // If the token is not valid, send an error response
                                    trackedRequest.res.status(401).send("Invalid token");
                                } else
                                {
                                    trackedRequest.next();  // Proceed with the next middleware
                                }
                                removeRequest(data.requestId);  // Clean up the request tracker
                            }
                        }

                            break;

                        default:
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
