import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"
import { natsWrapper } from "../../nats-wrapper"

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/pre-diagnosis/example-update/${id}`)
        .set("Cookie", signin())
        .send({text: "fake text"})
        .expect(404)
})

it("returns a 401 if the the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/pre-diagnosis/example-update/${id}`)
        .send({text: "fake text"})
        .expect(401)
})

it("returns a 401 if the user does not own the example", async () => {
    const response = await request(app)
        .post("/api/pre-diagnosis/example-new")
        .set("Cookie", signin())
        .send({text: "fake text"})
        .expect(201)

    await request(app)
        .put(`/api/pre-diagnosis/example-update/${response.body.id}`)
        .set("Cookie", signin())
        .send({text: "second fake text"})
        .expect(401)
})

it("returns a 400 if the user provideds an invalid text", async () => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/pre-diagnosis/example-new")
        .set("Cookie", cookie)
        .send({text: "fake text"})
        .expect(201)

    await request(app)
        .put(`/api/pre-diagnosis/example-update/${response.body.id}`)
        .set("Cookie", cookie)
        .send({})
        .expect(400)
})

it("updates the ticket provided valid inputs", async () => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/pre-diagnosis/example-new")
        .set("Cookie", cookie)
        .send({text: "fake text"})
        .expect(201)
    
    await request(app)
        .put(`/api/pre-diagnosis/example-update/${response.body.id}`)
        .set("Cookie", cookie)
        .send({text: "second fake text"})
        .expect(200)
    
    const updatedResponse = await request(app)
        .get(`/api/pre-diagnosis/example-show/${response.body.id}`)
        .send()
        .expect(200)
    
    expect(updatedResponse.body.text).toEqual("second fake text")
})

it ("publishes an event", async() => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/pre-diagnosis/example-new")
        .set("Cookie", cookie)
        .send({text: "fake text"})
        .expect(201)
    
    await request(app)
        .put(`/api/pre-diagnosis/example-update/${response.body.id}`)
        .set("Cookie", cookie)
        .send({text: "second fake text"})
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})