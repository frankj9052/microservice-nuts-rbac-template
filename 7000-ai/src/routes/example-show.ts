import express, {Request, Response} from "express";
import { NotFoundError } from "@noqclinic/common";
import { Example } from "../models/Example";

const router = express.Router()

router.get("/api/ai/example-show/:id", async(req: Request, res: Response) => {
    const example = await Example.findById(req.params.id)

    if(!example) {
        throw new NotFoundError()
    }

    return res.send(example)
})

export {router as showExampleRouter}