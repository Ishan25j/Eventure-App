import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ijeventure/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { stripe } from '../stripe';


const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmail()
], validateRequest, async (req: Request, res: Response) => {

    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    
    // * check order exists or not
    if (!order) {
        throw new NotFoundError();
    }

    // * check that user is authenticated
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    // * check if order is cancelled or not
    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for cancelled order');
    }

    // * as order.price is dollar so convert it into cents
    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
        description: 'making payment just for testing',
        shipping: {
            name: order.userId,
            address: {
              line1: '510 Townsend St',
              postal_code: '98140',
              city: 'San Francisco',
              state: 'CA',
              country: 'US',
            },
        }
    });

    // * add the payment record to mongoDB
    const payment = Payment.build({
        orderId: orderId,
        stripeId: charge.id
    });

    // * will save payment if not in test environment
    if (process.env.NODE_ENV !== 'test') {
        
        // * save payment
        await payment.save();
    }

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId 
    });

    res.status(201).send({id: payment.id});
})

export { router as createChargeRouter };