import { ExampleCreatedEvent, Listener, Subjects } from "@noqclinic/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class ExampleCreatedListener extends Listener<ExampleCreatedEvent> {
    subject: Subjects.ExampleCreated = Subjects.ExampleCreated;
    queueGroupName: string = queueGroupName;
    onMessage(data: ExampleCreatedEvent["data"], msg: Message): void {
        
        // after receive this message, run your logic here
        console.log("example created listener received the data ===> ", data.text)
        
        msg.ack()
    }    
}