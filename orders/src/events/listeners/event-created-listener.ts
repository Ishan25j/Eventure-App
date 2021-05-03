import { Message } from "node-nats-streaming";
import { Listener, Subjects, EventCreatedEvent } from "@ijeventure/common";
import { queueGroupName } from "./queue-group-name";
import { Event } from "../../models/events-srv";

export class EventCreatedListener extends Listener<EventCreatedEvent> {
    // * subject of the channel of NATS server
    readonly subject = Subjects.EventCreated;

    // * queue group for multiple instance if any
    queueGroupName = queueGroupName;

    // * on message to the following
    async onMessage(data: EventCreatedEvent['data'], msg: Message) {
        // * get data from the event created event
        const { id, creatorId, name, date, price, ticketLeft, version} = data;
        
        // * save event data in event database
        const event = Event.build({
            id,
            name,
            creatorId,
            price,
            date: new Date(date),
            ticketsLeft: ticketLeft,
            version: version
        });

        await event.save();
        
        console.log(event);

        // * send success acknowledgement to NATS server
        msg.ack();
    }
}