import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/User";
import { BadRequestError } from "@noqclinic/common";
import { Password } from "../services/password";
import jwt from 'jsonwebtoken'
import { validateRequest } from "@noqclinic/common";

const router = express.Router()

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
    validateRequest
    , async (req: Request, res: Response) => {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            throw new BadRequestError("Invalid credentials")
        }
        const passwordsMatch = await Password.compare(existingUser.password, password)
        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials")
        }

        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role
        },
            process.env.JWT_KEY!
        )

        req.session = {
            jwt: userJwt
        }


        res.status(200).send(existingUser)
    })

export { router as signinRouter }