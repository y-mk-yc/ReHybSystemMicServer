import mongoose from 'mongoose';
import { dbhd } from '../../db_connections';

const jointsSchema = new mongoose.Schema({

    Yrotation: { type: Number, required: false },
    Xrotation: { type: Number, required: false },
    Zrotation: { type: Number, required: false },
    ROM: {
        Yrotation: {
            max: { type: Number }, min: { type: Number }
        },
        Xrotation: { max: { type: Number }, min: { type: Number } },
        Zrotation: { max: { type: Number }, min: { type: Number } },
    }

    // child: { type: String, required: false },
    // parent: { type: String, required: false }
},
    { _id: false }
);

const JointExerciseStateSchema = new mongoose.Schema({
    PatientID: { type: String, required: true },
    // side: { type: String, required: true }, // left, right
    duration: { type: String, required: true },
    right: {
        RightFinger1Metacarpal: {
            type: jointsSchema,
        },
        RightFinger2Proximal: {

            type: jointsSchema,
        },
        RightFinger2Intermediate: {

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
        RightFinger3Intermediate: {

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
        RightFinger4Intermediate: {

            type: jointsSchema,
        },
        RightFinger4Distal: {

            type: jointsSchema,
        },
        RightThumbMetacarpal: {

            type: jointsSchema,
        },
        RightThumbProximal: {

            type: jointsSchema,
        },
        RightThumbDistal: {

            type: jointsSchema,
        },
        RightWrist: {

            type: jointsSchema,
        }
    },
    left: {
        LeftFinger1Metacarpal: {

            type: jointsSchema,
        },
        LeftFinger2Proximal: {

            type: jointsSchema,
        },
        LeftFinger2Intermediate: {

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
        LeftFinger3Intermediate: {

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
        LeftFinger4Intermediate: {

            type: jointsSchema,
        },
        LeftFinger4Distal: {

            type: jointsSchema,
        },
        LeftThumbMetacarpal: {

            type: jointsSchema,
        },
        LeftThumbProximal: {

            type: jointsSchema,
        },
        LeftThumbDistal: {

            type: jointsSchema,
        },
        LeftWrist: {

            type: jointsSchema,
        }
    }
});

// Create the model based on the schema
const JointExerciseState = dbhd.model('JointExerciseState', JointExerciseStateSchema);

export default JointExerciseState;
