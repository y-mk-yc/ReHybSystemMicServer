import { Schema } from 'mongoose';
import { dbhd } from '../../db_connections.mjs';
const commentSchema = Schema({
    sender: {
        type: String,
        require: true
    },
    receiver: {
        type: String,
        require: true
    },
    comment: {
        type: String,
        require: true
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
})

const Comment = dbhd.model("Comment", commentSchema);
export default Comment;