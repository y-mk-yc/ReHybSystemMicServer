// /* eslint-disable no-undef */

import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

console.log(process.env.MONGODB)
const connectionString = process.env.MONGODB || '';

mongoose.connect(connectionString)
  .then(() =>
  {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) =>
  {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Access different databases
const dbDT = mongoose.connection.useDb('ReHyb_DigitalTwin');
const dbSys = mongoose.connection.useDb('ReHyb_System');
const dbhd = mongoose.connection.useDb('Hand_System');

export { dbhd, dbDT, dbSys };
