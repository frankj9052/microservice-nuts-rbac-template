import { natsWrapper } from "../../../nats-wrapper"
import { Message } from "node-nats-streaming"
import { Example } from "../../../models/Example"
import { ExampleUpdatedEvent } from "@noqclinic/common"
import { ExampleUpdatedListener } from "../example-updated-listener "

const setup = async () => {
    // create an instance of the listener
    const listener = new ExampleUpdatedListener(natsWrapper.client)

    // create and save a ticket
    const example = Example.build({
        text: "fake text",
        userId: "fake user"
    })
    await example.save()

    // create a fake data event
    const data:ExampleUpdatedEvent["data"] = {
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