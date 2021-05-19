import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@ijeventure/common";
import { Message } from "node-nats-streaming";
import { Event } from "../../models/events-srv";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;

    queueGroupName = queueGroupName;

    async onMessage (data: ExpirationCompleteEvent['data'], msg: Message) {

        // * search for order and related ticket to that order
        const order = await Order.findById(data.orderId).populate('event');

        // * if order not found
        if (!order) {
            throw new Error('Order not found');
        }

        // * if order is already completed on time then just return the acknowledge to NATS server
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        // * increment ticketsLeft
        const event = await Event.findById(order.event.id);
        if (!event) {
            throw new Error('Event not found');
        }
        event.ticketsLeft = event.ticketsLeft + 1;
        await event.save();

        // * set order to be cancelled
        order.set({
            status: OrderStatus.Cancelled
        });

        // * save changes
        await order.save();
        
        // * emit order cancelled event
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            event: {
                id: order.event.eventId
            }
        });

        // * acknowledge success process to NATS server
        msg.ack();

    }
}