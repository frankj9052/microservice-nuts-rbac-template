import { app } from "./app"
import mongoose from "mongoose"
import { natsWrapper } from "./nats-wrapper"
import { ExampleCreatedListener } from "./events/listeners/example-created-listener"
import { ExampleUpdatedListener } from "./events/listeners/example-updated-listener "
import redisClient from "./redis-client"

const start = async () => {
    console.log("server is starting ... ")

    if(!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }
    if(!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined")
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined")
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined")
    }
    if(!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined")
    }
    if(!process.env.REDIS_HOST) {
        throw new Error("REDIS_HOST must be defined")
    }
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed!")
            process.exit()
        });
        process.on("SIGINT", () => natsWrapper.client.close())
        process.on("SIGTERM", () => natsWrapper.client.close())

        // put NATS Listener here
        new ExampleCreatedListener(natsWrapper.client).listen()
        new ExampleUpdatedListener(natsWrapper.client).listen()
        
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Chat MongoDb")

        await redisClient.connect().catch(console.error)
        console.log("Connected to Chat Redis")
    } catch(err) {
        console.log(err)
    }

    app.listen(3000, () => {
        console.log("Chat Server is listening on port 3000!")
    })
}

start()