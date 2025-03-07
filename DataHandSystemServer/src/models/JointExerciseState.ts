import mongoose from 'mongoose';
import { dbhd } from '../../db_connections';

export const ROMSchema = new mongoose.Schema({
    Yrotation: {
        Max: { type: Number }, Min: { type: Number }
    },
    Xrotation: { Max: { type: Number }, Min: { type: Number } },
    Zrotation: { Max: { type: Number }, Min: { type: Number } },

}, { _id: false });

const jointsSchema = new mongoose.Schema({

    Yrotation: { type: Number, required: false },
    Xrotation: { type: Number, required: false },
    Zrotation: { type: Number, required: false },
    ROM: { type: ROMSchema, required: true },
    state: { type: String, require: false } //l,s,m
},
    { _id: false }
);

const JointExerciseStateSchema = new mongoose.Schema({
    PatientID: { type: String, required: true },
    Duration: { type: String, required: true },
    Pain: { type: String }, // 1-5
    Right: {
        RightFinger1Metacarpal: {
            type: jointsSchema,
        },
        RightFinger1Proximal: {
            type: jointsSchema,
        },
        RightFinger1Distal: {
            type: jointsSchema,
        },
        RightFinger2Metacarpal: {
            type: jointsSchema,
        },
        RightFinger2Proximal: {
            type: jointsSchema,
        },
        RightFinger2Medial: {

            type: jointsSchema,
        },
        RightFinger2Distal: {

            type: jointsSchema,
        },
        RightFinger3Metacarpal: {

            type: jointsSchema,
        },
        RightFinger3Proximal: {

            type: jointsSchema,
        },
        RightFinger3Medial: {

            type: jointsSchema,
        },
        RightFinger3Distal: {

            type: jointsSchema,
        },
        RightFinger4Metacarpal: {

            type: jointsSchema,
        },
        RightFinger4Proximal: {

            type: jointsSchema,
        },
        RightFinger4Medial: {

            type: jointsSchema,
        },
        RightFinger4Distal: {

            type: jointsSchema,
        },
        RightFinger5Metacarpal: {

            type: jointsSchema,
        },
        RightFinger5Proximal: {

            type: jointsSchema,
        },
        RightFinger5Medial: {

            type: jointsSchema,
        },
        RightFinger5Distal: {

            type: jointsSchema,
        },

    },
    Left: {
        LeftFinger1Metacarpal: {
            type: jointsSchema,
        },
        LeftFinger1Proximal: {
            type: jointsSchema,
        },
        LeftFinger1Distal: {
            type: jointsSchema,
        },
        LeftFinger2Metacarpal: {
            type: jointsSchema,
        },
        LeftFinger2Proximal: {
            type: jointsSchema,
        },
        LeftFinger2Medial: {

            type: jointsSchema,
        },
        LeftFinger2Distal: {

            type: jointsSchema,
        },
        LeftFinger3Metacarpal: {

            type: jointsSchema,
        },
        LeftFinger3Proximal: {

            type: jointsSchema,
        },
        LeftFinger3Medial: {

            type: jointsSchema,
        },
        LeftFinger3Distal: {

            type: jointsSchema,
        },
        LeftFinger4Metacarpal: {

            type: jointsSchema,
        },
        LeftFinger4Proximal: {

            type: jointsSchema,
        },
        LeftFinger4Medial: {

            type: jointsSchema,
        },
        LeftFinger4Distal: {

            type: jointsSchema,
        },
        LeftFinger5Metacarpal: {

            type: jointsSchema,
        },
        LeftFinger5Proximal: {

            type: jointsSchema,
        },
        LeftFinger5Medial: {

            type: jointsSchema,
        },
        LeftFinger5Distal: {

            type: jointsSchema,
        },
    }
}, {
    timestamps: true
});

// Create the model based on the schema
const JointExerciseState = dbhd.model('JointExerciseState', JointExerciseStateSchema);

export default JointExerciseState;
