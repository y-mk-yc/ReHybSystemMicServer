import mongoose from "mongoose";
import { dbhd } from "../../db_connections";

const StateSchema = new mongoose.Schema({
    PatienID: { type: String, required: true },
    time: { type: String, required: true },

})
const State = dbhd.model('State', StateSchema)
export default State