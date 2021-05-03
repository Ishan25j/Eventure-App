import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@ijeventure/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        // * find order having appropriate version
        const order = await Order.findOne({
            _id: data.id,
            version: (data.version - 1)
        });

        // * If order is not found
        if (!order) {
            throw new Error('Order not found');
        }

        // * set order status to order cancelled
        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        // * send success acknowledgement to NATS server
        msg.ack();
    }
}