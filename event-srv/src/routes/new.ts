
import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { requireAuth, validateRequest } from "@ijeventure/common";
import { Event } from "../models/event-srv";
import { natsWrapper } from "../nats-wrapper";
import { EventCreatedPublisher } from "../events/publishers/event-created-publisher";

const router = express.Router();


router.post('/api/events/new', requireAuth, [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    body('description')
        .not()
        .isEmpty()
        .custom((input: string) => input.trim().length < 2000)
        .withMessage('Description is required and length should be less than 2000 characters'),
    body('date')
        .not()
        .isEmpty()
        .withMessage('Date is required'),
    body('ticketLeft')
        .not()
        .isEmpty()
        .withMessage('TicketLeft is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be provided or greater than 0')
], validateRequest, async (req: Request, res: Response) => {

    const { name, price, description, date, ticketLeft } = req.body;

    const event = Event.build({
        name,
        description,
        date: new Date(date),
        price,
        ticketsLeft: ticketLeft,
        creatorId: req.currentUser!.id
    })

    await event.save();

    // * will not execute if in test environment
    if (process.env.NODE_ENV !== 'test') {
        
        // * emit event into socketIO
        const events = await Event.find();
        global.io.emit('events', events);
    }
    
    // * emit event created event

    await new EventCreatedPublisher(natsWrapper.client).publish({
        id: event.id,
        name: event.name,
        version: event.version,
        creatorId: event.creatorId,
        price: event.price,
        date: event.date.toISOString(),
        ticketLeft: event.ticketsLeft,
    });


    res.status(201).send(event);
});

export { router as createEventRouter };