# 1 - Introduction

These middlewares might be used across various services.





# 2 - Middlewares

### 2.1 - required-auth

to validate user authorization

just use it like this:

~~~typescript
import { ACTIONS, RESOURCES, requireAuth } from "@noqclinic/common";
import express, { Request, Response } from "express";

const route = express.Router()

route.post("/api/users/resource", requireAuth(RESOURCES.test, ACTIONS.read),(req: Request, res: Response) => {
    return res.json({success: true, message: "Resource accessed successfully"})
})


export {route as sourceRouter}
~~~

If there is no resources or action you need, you have to add your resources or actions in `2000-common/src/auth/role`

### 2.2 - validate-request

validate the request

we use `express-validator` library to validate the request

you can check the syntax through the express-validator official web site

for normal use, just look at the example below:

~~~typescript
router.post('/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ]
    ,
    validateRequest, async(req, res) => {...}
~~~

