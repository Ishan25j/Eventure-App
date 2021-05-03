import { Message } from "node-nats-streaming";
import { Listener, Subjects, EventUpdatedEvent } from "@ijeventure/common";
import { queueGroupName } from "./queue-group-name";
import { Event } from "../../models/events-srv";

export class EventUpdatedListener extends Listener<EventUpdatedEvent> {
    // * subject of the channel of NATS server
    readonly subject = Subjects.EventUpdated;

    // * queue group for multiple instance if any
    queueGroupName = queueGroupName;

    // * on message to the following
    async onMessage(data: EventUpdatedEvent['data'], msg: Message) {
        // * get data from the event created event
        const { id, creatorId, name, date, price, ticketLeft, version} = data;
        
        // * save event data in event database
        const event = await Event.findOne({
            eventId: id,
            version: Number(version - 1)
        })


        await event!.save();
        
        console.log(event);

        // * send success acknowledgement to NATS server
        msg.ack();
    }
}