import { PaymentCreatedEvent, Publisher, Subjects } from "@ijeventure/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentDone;
}