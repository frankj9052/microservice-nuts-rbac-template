import express, { Request, Response } from "express";
import { Example } from "../models/Example";

const router = express.Router()

router.get("/api/chat/example-index", async (req: Request, res: Response) => {
    const example = await Example.find()
    return res.send(example)
})

export {router as indexExampleRouter}