
// // Event Model Class
// class Event
// {
//     constructor(requestId, eventType, data, sender, receiver, status = 'pending')
//     {
//         this.requestId = requestId;
//         this.eventType = eventType;
//         this.data = data;
//         this.sender = sender,
//             this.receiver = receiver,
//             this.timestamp = new Date().toISOString(); // Record the event creation time
//         this.status = status; // Initial status is 'pending'
//     }

//     // Serialize the event to a string (e.g., for transport over a message queue)
//     serialize()
//     {
//         return JSON.stringify({
//             requestId: this.requestId,
//             eventType: this.eventType,
//             data: this.data,
//             timestamp: this.timestamp,
//             sender: this.sender,
//             receiver: this.receiver,
//             status: this.status,

//         });
//     }

//     // Deserialize the event from a string (e.g., from a message queue)
//     static deserialize(serializedEvent)
//     {
//         const parsedData = JSON.parse(serializedEvent);
//         return new Event(
//             parsedData.requestId,
//             parsedData.eventType,
//             parsedData.data,
//             parsedData.sender,
//             parsedData.receiver,
//             parsedData.status
//         );
//     }
// }

// export default { Event };
