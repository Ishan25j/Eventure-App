import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';


// * For connecting to mongoDB instance and NATS server
const start = async () => {

  // * Check for is JWT_KEY environment varable exists or not
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  
  // * Check for is MONGO_URI environment varable exists or not
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  
  // * Check for is NATS_URL environment varable exists or not
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  
  // * Check for is NATS_CLIENT_ID environment varable exists or not
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  
  // * Check for is NATS_CLUSTER_ID environment varable exists or not
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    // * connecting to NATS
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    // * disconnects and remove client from active list
    natsWrapper.client.on('close', () => {
      console.log('NAT connection closed');
      process.exit();
    })
    
    // * delete client from active lists from NAT when closed
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    
    // * added order created and order cancelled listeners
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    // * connecting to Mongoose
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