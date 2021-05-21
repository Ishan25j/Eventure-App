import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@ijeventure/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Event } from '../models/events-srv';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post('/api/orders/sell/', requireAuth, [
    body('orderId')
        .isString()
        .notEmpty()
        .withMessage("id should be provided")
], validateRequest, async (req: Request, res: Response) => {

    // * get orderId from response body object
    const { orderId } = req.body;

    // * find the valid order
    const order = await Order.findOne({
        _id: orderId,
        userId: req.currentUser?.id,
        status: OrderStatus.Complete
    }).populate('event');
    

    // * throw error if order not found
    if (!order) {
        throw new NotFoundError();
    }    

    // * throw error if ticket is expired / event starts under 10 minutes
    if ((order.event.date.getTime() - new Date().getTime())/1000 - (10*60) < 0) {
        throw new BadRequestError('Ticket is expired');
    }

    // * increment ticketsLeft
    const event = await Event.findById(order.event.id);
    if (!event) {
        throw new Error('Event not found');
    }
    event.ticketsLeft = event.ticketsLeft + 1;
    await event.save();

    // * sell ticket if valid
    order.set({
        status: OrderStatus.Cancelled
    });

    await order.save();

    

    // * publish the order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
        source: 'sell',
        id: order.id,
        version: order.version - 1,
        event: {
            id: order.event.eventId
        }
    });

    res.status(200).send(order);
});

export {router as sellOrderRouter }; 