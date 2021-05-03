import mongoose from 'mongoose';

import { app } from "./app";

// * For connecting to mongoDB instance
const start = async () => {

  // * Check for is JWT_KEY environment varable exists or not
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // * Check for is MONGO_URI environment varable exists or not
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Connected to MongoDB instance");
  } catch (err) {
    console.error(err);
  }
}

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

// * running start function for connection to mongoDB instance
start();