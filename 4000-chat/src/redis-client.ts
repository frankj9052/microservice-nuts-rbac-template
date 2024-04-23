import {createClient} from "redis"
const redisClient = createClient({
    url: process.env.REDIS_HOST
});

redisClient.on("error", (err) => console.log("Redis Client Error", err))

export default redisClient