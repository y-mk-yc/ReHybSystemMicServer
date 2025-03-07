// requestTracker.js

// Shared object to track in-progress requests
export const requestTracker = {};

// Optionally, add methods to interact with the tracker
export function addRequest(message)
{
    requestTracker[message.requestId] = { message, status: "pending", timestamp: Date.now() };
    console.log(requestTracker)
}

export function removeRequest(requestId)
{
    delete requestTracker[requestId];
}

export function getRequest(requestId)
{
    return requestTracker[requestId];
}
