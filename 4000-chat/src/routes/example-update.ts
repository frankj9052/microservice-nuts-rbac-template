import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@noqclinic/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { Example } from "../models/Example";
import { ExampleUpdatedPublisher } from "../events/publishers/example-updated-publisher";

const router = express.Router()

router.put("/api/chat/example-update/:id", 
    requireAuth
, [
    body('text')
        .not()
        .isEmpty()
        .withMessage("Title is required")
], 
    validateRequest
, async (req: Request, res: Response) => {
    const example = await Example.findById(req.params.id)

    if(!example) {
        throw new NotFoundError();
    }

    if(example.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError()
    }

    example.set({
        text: req.body.text,
    })

    await example.save()

    new ExampleUpdatedPublisher(natsWrapper.client).publish({
        text: example.text
    })

    return res.send(example)
})

export { router as updateExampleRouter }