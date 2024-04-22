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