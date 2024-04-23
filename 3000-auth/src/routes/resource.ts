import { ACTIONS, RESOURCES, requireAuth } from "@noqclinic/common";
import express, { Request, Response } from "express";

const route = express.Router()

route.post("/api/users/resource", requireAuth(RESOURCES.test, ACTIONS.read),(req: Request, res: Response) => {
    return res.json({success: true, message: "Resource accessed successfully"})
})


export {route as sourceRouter}