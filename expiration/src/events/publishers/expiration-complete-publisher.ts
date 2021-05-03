import { Publisher, ExpirationCompleteEvent, Subjects } from "@ijeventure/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}