
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

// * For connecting to the NATS server
const start = async () => {
  
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
    
    // * added listener for order created 
    new OrderCreatedListener(natsWrapper.client).listen()

  } catch (err) {
    console.log(err);
  }
}

// * running start function for connection to mongoDB instance
start();