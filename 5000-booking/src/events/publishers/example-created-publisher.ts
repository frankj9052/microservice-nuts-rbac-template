import { ExampleCreatedEvent, Publisher, Subjects } from "@noqclinic/common";

export class ExampleCreatedPublisher extends Publisher<ExampleCreatedEvent> {
    subject: Subjects.ExampleCreated = Subjects.ExampleCreated;
}