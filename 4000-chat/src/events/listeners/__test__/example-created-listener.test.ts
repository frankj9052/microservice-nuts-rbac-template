import { natsWrapper } from "../../../nats-wrapper"
import { Message } from "node-nats-streaming"
import { Example } from "../../../models/Example"
import { ExampleCreatedEvent } from "@noqclinic/common"
import { ExampleCreatedListener } from "../example-created-listener"

const setup = async () => {
    // create an instance of the listener
    const listener = new ExampleCreatedListener(natsWrapper.client)

    // create and save a ticket
    const example = Example.build({
        text: "fake text",
        userId: "fake user"
    })
    await example.save()

    // create a fake data event
    const data:ExampleCreatedEvent["data"] = {
            text: "published from booking server..."        
    }    

    // create a fake message object
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }
    return { listener, example, data, msg }
}

it("acks the message", async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})