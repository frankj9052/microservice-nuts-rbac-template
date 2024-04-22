import { BadRequestError, requireAuth, validateRequest } from "@noqclinic/common";
import express, { Request, Response } from "express";
import { body } from "express-validator"
import { natsWrapper } from "../nats-wrapper";
import { Example } from "../models/Example";
import { ExampleCreatedPublisher } from "../events/publishers/example-created-publisher";

const router = express.Router();

router.post("/api/ai/example-new",
    requireAuth,
    [
        body("text")
            .not()
            .isEmpty()
            .withMessage("Text is required"),
    ],
    validateRequest
    , async (req: Request, res: Response) => {
        try {
            const example = Example.build({
                text: req.body.text,
                userId: req.currentUser!.id
            })
            await example.save();
            new ExampleCreatedPublisher(natsWrapper.client).publish({
                text: example.text,
            })
            return res.status(201).send(example);
        } catch (err) {
            throw new BadRequestError("Faild to store ticket")
        }
    })

export { router as createExampleRouter };