import { ExampleUpdatedEvent, Publisher, Subjects } from "@noqclinic/common";

export class ExampleUpdatedPublisher extends Publisher<ExampleUpdatedEvent> {
    subject: Subjects.ExampleUpdated = Subjects.ExampleUpdated;
}