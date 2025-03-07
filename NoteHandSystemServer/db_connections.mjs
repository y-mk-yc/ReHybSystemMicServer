/* eslint-disable no-undef */


import mongoose from 'mongoose';

const connectionString = process.env.MONGODB || '';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(connectionString, options)
  .then(() =>
  {
    console.info('Successfully connected to MongoDB');
  })
  .catch((error) =>
  {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// const dbDT = mongoose.connection.useDb('ReHyb_DigitalTwin');
// const dbSys = mongoose.connection.useDb('ReHyb_System');

const dbDT = mongoose.connection.useDb('ReHyb_DigitalTwin');
const dbSys = mongoose.connection.useDb('ReHyb_System');
const dbhd = mongoose.connection.useDb('Hand_System');

export { dbhd, dbDT, dbSys };
// export { dbDT, dbSys };