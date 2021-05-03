import { OrderCancelledEvent, Publisher, Subjects } from "@ijeventure/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}