import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@ijeventure/common";
import { Message } from "node-nats-streaming";
import { Order, OrderDoc } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        const ord = await Order.find();
        console.log(ord);

        var order: OrderDoc | null;
        
        // * is source is sell or else
        if (data.source && data.source === 'sell') {   
            // * find order having appropriate version
            order = await Order.findOne({
                _id: data.id,
                version: (data.version - 2)
            });
        } else {
            // * find order having appropriate version
            order = await Order.findOne({
                _id: data.id,
                version: (data.version - 1)
            });
        }
        
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