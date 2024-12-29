import { Schema, model } from "mongoose";
import { dbhd } from "../db_connections";

// Define the schema for each message
const messageSchema = new Schema({
    sender: {
        type: String,
        required: true, // Ensures sender is provided
    },
    receiver: {
        type: String,
        required: true, // Ensures receiver is provided
    },
    content: {
        type: String,
        required: true, // Ensures message content is provided
    },

},
    {
        timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
    });

// Define the main chat schema
const chatSchema = new Schema(
    {
        t1: {
            type: String,
            required: true, // t1 must be specified
        },
        t2: {
            type: String,
            required: true, // t2 must be specified
        },
        content: {
            type: [messageSchema], // Content is an array of message schemas
            required: true, // Ensure that at least one message exists
        },
        read: {
            type: Number,
            require: true
        }
    },
    {
        timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
    }
);

// Create the Chat model from the schema
const Chat = dbhd.model("Chat", chatSchema);

export default Chat;
