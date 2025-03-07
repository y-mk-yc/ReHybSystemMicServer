import mongoose, { Schema } from "mongoose";
import { dbhd } from "../../db_connections";
import { Contrast } from "../config/constant";

const ModelSettingSchema = new mongoose.Schema({
    UserID: { type: String, required: true },
    Contrast: {
        type: String,
        enum: Object.values(Contrast), // Restrict to enum values
        required: true,
        default: Contrast.NOCONTENT,
    }, // 
},
    { timestamps: true });

const ModelSetting = dbhd.model('ModelSetting', ModelSettingSchema)
export default ModelSetting