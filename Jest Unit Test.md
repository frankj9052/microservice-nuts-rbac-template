# 1 - Introduction

To ensure thorough testing during continuous integration (CI) on GitHub, we strongly recommend including tests when writing route handlers. There are plenty of test examples available for everyone to use.



# 2 - Unit Test

In the desired test file's parent directory, create a folder named `__test__`, and then write the tests inside it. Below is an example including some tests for reference.

The file name should be the name of the file being tested plus "**.test.ts**".

### 2.1 - example-index.test.ts

list all the example test

`4000-chat/src/routes/example-index.test.ts`

~~~typescript
import request from "supertest"
import { app } from "../../app"

const createExample = () => {
    return request(app)
    .post("/api/chat/example-new")
    .set("Cookie", signin())
    .send({
        text: "fake text",
        userId: "fake user"
    })
}

it("can fetch a list of example", async () => {
    await createExample()
    await createExample()
    await createExample()

    const response = await request(app)
        .get("/api/chat/example-index")
        .send()
        .expect(200)
    expect(response.body.length).toEqual(3)
})
~~~



### 2.2 - example-new.test.ts

create a new record test

`4000-chat/src/routes/example-new.test.ts`

~~~typescript
import request from "supertest"
import { app } from "../../app"
import { natsWrapper } from "../../nats-wrapper"
import { Example } from "../../models/Example"

it("has a route handler listening to /api/example-new for post request", async () => {
    const response = await request(app)
        .post("/api/chat/example-new")
        .send({})

    expect(response.status).not.toEqual(404)
})

it("can only be accessed if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/chat/example-new")
        .send({})
        .expect(401);
})

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", signin())
        .send({})
    expect(response.status).not.toEqual(401);
})

it("returns an error if an invalid text is provided", async () => {
    await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", signin())
        .send({
            title: "",
        }).expect(400)

    await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", signin())
        .send({
        }).expect(400)
})

it("creates a example with valid inputs", async () => {
    let example = await Example.find({})
    expect(example.length).toEqual(0);

    await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", signin())
        .send({
            text: "fake text",
        }).expect(201)
    example = await Example.find({})
    expect(example.length).toEqual(1)
    expect(example[0].text).toEqual("fake text")
})

it("publishes an event", async () => {
    await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", signin())
        .send({
            text: "fake text",
        }).expect(201)
    // console.log(natsWrapper)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
~~~

### 2.3 - example-show.test.ts

show a specific record test

`4000-chat/src/routes/example-show.test.ts`

~~~typescript
import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose";

it("returns a 404 if the example is not found", async() => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/chat/example-show/${id}`)
        .send()
        .expect(404)
});

it("returns the example if the example is found", async() => {
    const text = "fake text";

    const response = await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", signin())
        .send({ text })
        .expect(201)
    const exampleResponse = await request(app)
        .get(`/api/chat/example-show/${response.body.id}`)
        .send()
        .expect(200)
    expect(exampleResponse.body.text).toEqual(text)
})

~~~



### 2.4 - example-update.test.ts

update an example test

`4000-chat/src/routes/example-update.test.ts`

~~~typescript
import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"
import { natsWrapper } from "../../nats-wrapper"

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/chat/example-update/${id}`)
        .set("Cookie", signin())
        .send({text: "fake text"})
        .expect(404)
})

it("returns a 401 if the the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/chat/example-update/${id}`)
        .send({text: "fake text"})
        .expect(401)
})

it("returns a 401 if the user does not own the example", async () => {
    const response = await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", signin())
        .send({text: "fake text"})
        .expect(201)

    await request(app)
        .put(`/api/chat/example-update/${response.body.id}`)
        .set("Cookie", signin())
        .send({text: "second fake text"})
        .expect(401)
})

it("returns a 400 if the user provideds an invalid text", async () => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", cookie)
        .send({text: "fake text"})
        .expect(201)

    await request(app)
        .put(`/api/chat/example-update/${response.body.id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(400)
})

it("updates the ticket provided valid inputs", async () => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", cookie)
        .send({text: "fake text"})
        .expect(201)
    
    await request(app)
        .put(`/api/chat/example-update/${response.body.id}`)
        .set("Cookie", cookie)
        .send({text: "second fake text"})
        .expect(200)
    
    const updatedResponse = await request(app)
        .get(`/api/chat/example-show/${response.body.id}`)
        .send()
        .expect(200)
    
    expect(updatedResponse.body.text).toEqual("second fake text")
})

it ("publishes an event", async() => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/chat/example-new")
        .set("Cookie", cookie)
        .send({text: "fake text"})
        .expect(201)
    
    await request(app)
        .put(`/api/chat/example-update/${response.body.id}`)
        .set("Cookie", cookie)
        .send({text: "second fake text"})
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
~~~



### 2.5 - Example-test.ts

This test is for mongoose Model test

`4000-chat/src/models/__test__/Example.test.ts`

~~~typescript
import { Example } from "../Example"

it("implements optimistic concurrency control", async () => {
    // Create an instance of a ticket
    const example = Example.build({
        text: "fack text",
        userId: "test user"
    })
    // Save the ticket to the database
    await example.save()

    // Fetch the ticket twice
    const firstInstance = await Example.findById(example.id)
    const secondInstance = await Example.findById(example.id)

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({text: "10"})
    secondInstance!.set({text: "20"})

    // save the first fetched ticket expect an success
    await firstInstance!.save()

    // save the second ticket and expect an error(version outage)
    try {
        await secondInstance!.save()
    } catch (err) {
        return;
    }
    throw new Error("Should not reach this point")
})

it("increments the version number on multiple saves", async() => {
    // Create an instance of a ticket
    const example = Example.build({
        text: "fack text",
        userId: "test user"
    })
    // Save the ticket to the database
    await example.save()
    
    expect(example.version).toEqual(0)

    // pertend we update the ticket
    await example.save()

    // check the version
    expect(example.version).toEqual(1)
})
~~~



### 2.6 - booking-example-listener.test.ts

This test is for the definition of the listeners in each service

`4000-chat/src/events/listeners/__test__/example-created-listener.test.ts`

~~~typescript
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
~~~

`4000-chat/src/events/listeners/__test__/example-updated-listener.test.ts`

~~~typescript
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
~~~





There will be more logic test in here, for example update database.