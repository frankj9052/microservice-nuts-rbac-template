import request from "supertest"
import { app } from "../../app"
import { natsWrapper } from "../../nats-wrapper"
import { Example } from "../../models/Example"

it("has a route handler listening to /api/example-new for post request", async () => {
    const response = await request(app)
        .post("/api/ai/example-new")
        .send({})

    expect(response.status).not.toEqual(404)
})

it("can only be accessed if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/ai/example-new")
        .send({})
        .expect(401);
})

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/ai/example-new")
        .set("Cookie", signin())
        .send({})
    expect(response.status).not.toEqual(401);
})

it("returns an error if an invalid text is provided", async () => {
    await request(app)
        .post("/api/ai/example-new")
        .set("Cookie", signin())
        .send({
            title: "",
        }).expect(400)

    await request(app)
        .post("/api/ai/example-new")
        .set("Cookie", signin())
        .send({
        }).expect(400)
})

it("creates a example with valid inputs", async () => {
    let example = await Example.find({})
    expect(example.length).toEqual(0);

    await request(app)
        .post("/api/ai/example-new")
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
        .post("/api/ai/example-new")
        .set("Cookie", signin())
        .send({
            text: "fake text",
        }).expect(201)
    // console.log(natsWrapper)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})