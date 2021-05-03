import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ijeventure/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Event } from '../models/events-srv';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-listener';

const router = express.Router();

// * order expires after 1 minute if not paid
const EXPIRATION_WINDOW_SECONDS = 1 * 60;   // 15 * 60; // 15 minutes


router.post('/api/orders', requireAuth, [
    body('eventId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response) => {

    const { eventId } = req.body;

    // * Find the ticket the user is trying to order in the database
    
    const eventData = await Event.findOne({ eventId: eventId });


    if (!eventData) {
        throw new NotFoundError();
    }

    // * Check whether ticket is available for the event or not
    const ticketAvailable = eventData.ticketsLeft !== 0;

    if (!ticketAvailable) {
        throw new BadRequestError('Ticket is not Available at present');
    }

    // * Calculate an expiration date for this order

    const expiration = new Date();

    // * setting expiration to current time + 15 minutes
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // * Build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        event: eventData
    });

    await order.save();

    
    // * Publish order created event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        event: {
            id: order.event.eventId,
            price: order.event.price,
        }
    });

    res.status(201).send(order);
});

export {router as newOrderRouter }; 