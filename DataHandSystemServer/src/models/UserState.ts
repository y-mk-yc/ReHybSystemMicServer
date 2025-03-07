import mongoose from "mongoose";
import { dbhd } from "../../db_connections";
import { ROMSchema } from "./JointExerciseState";

const UserStateSchema = new mongoose.Schema(
    {
        PatientID: { type: String, required: true },
        AffectedHand: { type: [String], required: true },
        AffectedTime: { type: Date, required: false },
        Milestone: {
            Right: {
                RightFinger1Metacarpal: { type: ROMSchema },
                RightFinger1Proximal: { type: ROMSchema, },
                RightFinger1Distal: { type: ROMSchema, },
                RightFinger2Metacarpal: { type: ROMSchema, },
                RightFinger2Proximal: { type: ROMSchema },
                RightFinger2Medial: { type: ROMSchema },
                RightFinger2Distal: { type: ROMSchema },
                RightFinger3Metacarpal: { type: ROMSchema },
                RightFinger3Proximal: { type: ROMSchema },
                RightFinger3Medial: { type: ROMSchema },
                RightFinger3Distal: { type: ROMSchema },
                RightFinger4Metacarpal: { type: ROMSchema },
                RightFinger4Proximal: { type: ROMSchema },
                RightFinger4Medial: { type: ROMSchema },
                RightFinger4Distal: { type: ROMSchema },
                RightFinger5Metacarpal: { type: ROMSchema },
                RightFinger5Proximal: { type: ROMSchema },
                RightFinger5Medial: { type: ROMSchema },
                RightFinger5Distal: { type: ROMSchema },
            },
            Left: {
                LeftFinger1Metacarpal: { type: ROMSchema },
                LeftFinger1Proximal: { type: ROMSchema, },
                LeftFinger1Distal: { type: ROMSchema, },
                LeftFinger2Metacarpal: { type: ROMSchema, },
                LeftFinger2Proximal: { type: ROMSchema },
                LeftFinger2Medial: { type: ROMSchema },
                LeftFinger2Distal: { type: ROMSchema },
                LeftFinger3Metacarpal: { type: ROMSchema },
                LeftFinger3Proximal: { type: ROMSchema },
                LeftFinger3Medial: { type: ROMSchema },
                LeftFinger3Distal: { type: ROMSchema },
                LeftFinger4Metacarpal: { type: ROMSchema },
                LeftFinger4Proximal: { type: ROMSchema },
                LeftFinger4Medial: { type: ROMSchema },
                LeftFinger4Distal: { type: ROMSchema },
                LeftFinger5Metacarpal: { type: ROMSchema },
                LeftFinger5Proximal: { type: ROMSchema },
                LeftFinger5Medial: { type: ROMSchema },
                LeftFinger5Distal: { type: ROMSchema },
            },
        },
    },
    { timestamps: true }
);
const UserState = dbhd.model("UserState", UserStateSchema);
export default UserState;