import { Buffer } from 'buffer';

export async function sendMessage(channel, queue, event)
{
    try
    {
        const { data, type } = event
        channel.sendToQueue(queue, Buffer.from(JSON.stringify({ data, type })));
    } catch (error)
    {
        console.error('Error in sending event:', error);
    }
}
