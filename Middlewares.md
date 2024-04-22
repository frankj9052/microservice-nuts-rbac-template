# 1 - Introduction







# 2 - Middlewares

### 2.1 - required-auth

Not finished yet

to validate user authorization

just use it like this:

~~~typescript
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from "@tickets0808/common";
import {OrderStatus} from "../models/Orders"
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/Tickets";
import { Order } from "../models/Orders";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 60

router.post("/api/orders", 
    requireAuth, [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId must be provided")
    ]
, validateRequest,async (req: Request, res: Response) => {
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(req.body.ticketId);
    if(!ticket) {
        throw new NotFoundError()
    }

    // Make sure that this ticket is not already reserved
    const reserved = await ticket.isReserved()
    if(reserved) {
        throw new BadRequestError("Ticket is already reserved")
    }

    // Calculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    })
    await order.save()

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        // 这里的默认type是string, 因为Date type的默认转换成string不完美
        // 默认转换形式："2342344:MST"，我们需要UTC timestamp来传输时区信息。
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })
    res.status(201).send(order)
});

export {router as newOrderRouter}
~~~



### 2.2 - validate-request

validate the request

take a look at the above example
