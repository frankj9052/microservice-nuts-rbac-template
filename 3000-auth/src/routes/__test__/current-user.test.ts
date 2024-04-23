import request from "supertest"
import { app } from "../../app";

it('return responds with details about the current user', async () => {
    const cookie = await signin()
    const response = await request(app)
        .get("/api/users/currentuser")
        // 通过 set 可以配置 header
        .set('Cookie', cookie)
        .send()
        .expect(200)
    
    expect(response.body.currentUser.email).toEqual('test@test.com')
})


it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200)
    
    expect(response.body.currentUser).toEqual(null)
})