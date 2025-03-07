import { Schema } from 'mongoose';
import { dbhd } from '../../db_connections.mjs';
// import 
/**
 * Note the the note usr leave to themselves
 */
const noteSchema = new Schema({
    userId: {
        type: String,
        require: true,
    },
    note: {
        type: String,
        require: true,
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
})

const Note = dbhd.model("Note", noteSchema);
export default Note;