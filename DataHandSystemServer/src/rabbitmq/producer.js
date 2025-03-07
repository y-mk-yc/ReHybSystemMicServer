import { Buffer } from 'buffer';
import { v4 as uuidv4 } from "uuid";
import { addRequest } from './requestTracker.js';

export async function sendMessage(channel, queue, event)
{
    try
    {
        const requestId = generateRequestId()
        const { data, type, req, res, next } = event
        addRequest(requestId, req, res, next);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify({ data, type, requestId })));
        // console.log(`Message sent to queue "${queue}":`, event);

    } catch (error)
    {
        console.error('Error in sending event:', error);
    }
}

function generateRequestId()
{
    return uuidv4();
}