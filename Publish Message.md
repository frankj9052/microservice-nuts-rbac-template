# 1 - Introduction

The role of a publisher in a microservices architecture is to send message events to other services.



# 2 - Create your own publisher

### 2.1 - add event name in subject

`2000-common/src/events/subjects.ts`

~~~typescript
/**
 * Define all the event name here, event like a message that publish to other services.
 */

export enum Subjects {
    TicketCreated = "ticket:created",
    TicketUpdated = "ticket:update",

    OrderCreated = "order:created",
    OrderCancelled = "order:cancelled",

    ExpirationCompelete = "expiration:complate",

    PaymentCreated = "payment:created",

    ExampleCreated = "example:created",
    ExampleUpdated = "example:updated"
}
~~~



### 2.2 - define your event in common lib

`2000-common/src/events/example-created-event.ts`

~~~typescript
/**
 * This is an example created event definition
 */

import { Subjects } from "./subjects";

export interface ExampleCreatedEvent {
    subject: Subjects.ExampleCreated;
    data: {
        text: string
    }
}
~~~

`2000-common/src/events/example-updated-event.ts`

~~~typescript
/**
 * This is an example updated event definition
 */

import { Subjects } from "./subjects";

export interface ExampleUpdatesEvent {
    subject: Subjects.ExampleUpdated;
    data: {
        text: string
    }
}
~~~

import the events in `index.ts`

Then, publish this common library

update the common library for your server



### 2.3 - define the publisher in your service

here is the example

`4000-chat/src/events/publishers/example-created-publisher.ts`

~~~typescript
import { ExampleCreatedEvent, Publisher, Subjects } from "@noqclinic/common";

// implement the Publisher in @noqclinic/common
// quick fix and add the subject value from Subjects in @noqclinic/common
export class ExampleCreatedPublisher extends Publisher<ExampleCreatedEvent> {
    subject: Subjects.ExampleCreated = Subjects.ExampleCreated;
}
~~~

`4000-chat/src/events/publishers/example-updated-publisher.ts`

~~~typescript
import { ExampleUpdatedEvent, Publisher, Subjects } from "@noqclinic/common";

// implement the Publisher in @noqclinic/common
// quick fix and add the subject value from Subjects in @noqclinic/common
export class ExampleUpdatedPublisher extends Publisher<ExampleUpdatedEvent> {
    subject: Subjects.ExampleUpdated = Subjects.ExampleUpdated;
}
~~~



# 2 - Use the publisher

Usually publisher is used in create new record or update a record

example are in the `example-new.test.ts` or `example-update.test.ts` in the `routes` folder

