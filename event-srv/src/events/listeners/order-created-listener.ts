import { Listener, OrderCreatedEvent, Subjects } from "@ijeventure/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Event } from "../../models/event-srv";
import { EventUpdatedPublisher } from "../publishers/event-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    readonly subject = Subjects.OrderCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // * Find the event ticket that the order is reserving
        const event = await Event.findById(data.event.id);

        // * If no event, throw error
        if (!event) {
            throw new Error('Ticket not found');
        }

        // * Mark the event as being reserved by setting its orderId propert
        event.set({
            ticketsLeft: Number(event.ticketsLeft - 1)
        });

        // * Save the ticket
        await event.save();

        // * getting the events
        const events = await Event.find();

        // * emit events using socketIO
        global.io.emit('events', events);
        global.io.emit('event', event);

        // * updated about event ticket is updated
        await new EventUpdatedPublisher(this.client).publish({
            id: event.id,
            name: event.name,
            version: event.version,
            creatorId: event.creatorId,
            price: event.price,
            date: event.date.toISOString(),
            ticketLeft: event.ticketsLeft,
        });

        // * ack the message
        msg.ack();
    }

}