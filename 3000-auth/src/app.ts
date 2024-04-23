import express from "express";
import 'express-async-errors'
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import cookieSession from "cookie-session";
import { NotFoundError, currentUser, errorHandler } from "@noqclinic/common";
import { sourceRouter } from "./routes/resource";

const app = express()
app.set('trust proxy', true)
app.use(express.json())

app.use(cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== 'test',
}))
app.use(currentUser)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
app.use(sourceRouter)

app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app};