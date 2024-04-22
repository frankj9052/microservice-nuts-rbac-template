import express from "express"
import "express-async-errors"
import cookieSession from "cookie-session"
import {NotFoundError, currentUser, errorHandler} from "@noqclinic/common"
import { createExampleRouter } from "./routes/example-new"
import { indexExampleRouter } from "./routes/example-index"
import { showExampleRouter } from "./routes/example-show"
import { updateExampleRouter } from "./routes/example-update"

const app = express()
app.set("trust proxy", true)
app.use(express.json())

app.use(cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== "test"
}))

app.use(currentUser)

// put routes here
app.use(createExampleRouter)
app.use(indexExampleRouter)
app.use(showExampleRouter)
app.use(updateExampleRouter)

app.all("*", () => {
    throw new NotFoundError();
})

app.use(errorHandler)

export { app }

