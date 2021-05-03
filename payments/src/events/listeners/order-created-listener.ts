import { Listener, OrderCreatedEvent, Subjects } from "@ijeventure/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;

    queueGroupName = queueGroupName;

    async onMessage (data: OrderCreatedEvent['data'], msg: Message) {

        // * add order to the mongoDB
        const order = Order.build({
            id: data.id,
            price: data.event.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })

        await order.save();

        // * send success acknowledgement to NATS server
        msg.ack();
    }
}