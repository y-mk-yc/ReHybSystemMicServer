import mongoose from "mongoose";
/**
 * Assessment store the scale data, like from 1-5, not the detailed data
 *
 */
const RomDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    rom: { type: Number, required: true }
}, { _id: false });

const GripStrengthDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    strength: { type: Number, required: true }
}, { _id: false });

const MovementPrecisionDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    spatialDeviation: { type: Number, required: true },
    completionAccuracy: { type: Number, required: true },
    trajectoryComparison: { type: Number, required: true }
}, { _id: false });


const MovementSpeedDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    speed: { type: Number, required: true }
}, { _id: false });

const FingerCoordinationDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    coordination: { type: Number, required: true }
}, { _id: false });

const FingerIndependenceDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    independence: { type: Number, required: true }
}, { _id: false });

const DexterityDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    dexterity: { type: Number, required: true }
}, { _id: false });

const PainDataSchema = new mongoose.Schema({
    time: { type: Date, required: true },
    severity: { type: Number, required: true },
    location: { type: Number, required: true }
}, { _id: false });

// Schema for HandMetricsData
const HandMetricsDataSchema = new mongoose.Schema({
    Rom: [RomDataSchema],
    GripStrength: [GripStrengthDataSchema],
    MovementPrecision: [MovementPrecisionDataSchema],
    MovementSpeed: [MovementSpeedDataSchema],
    FingerCoordination: [FingerCoordinationDataSchema],
    FingerIndependence: [FingerIndependenceDataSchema],
    Dexterity: [DexterityDataSchema],
    Pain: [PainDataSchema],
}, { _id: false });

// Main Assessment schema
export const AssessmentSchema = new mongoose.Schema({
    PatientID: { type: String, required: true },
    assessments: { type: Map, of: HandMetricsDataSchema, required: true }
}, { timestamps: true });

export const Assessment = mongoose.model("Assessment", AssessmentSchema);
