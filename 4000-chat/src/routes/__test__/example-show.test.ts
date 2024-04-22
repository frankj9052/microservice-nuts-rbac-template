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
