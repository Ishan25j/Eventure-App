import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

// * custom npm module publish publically
import { BadRequestError, validateRequest } from '@ijeventure/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage("Email must be valid"),
        body('password')
            .trim()
            .notEmpty()
            .withMessage("You must supply a password")
    ],
    validateRequest,
    async (req: express.Request, res: express.Response) => {
    

        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(!existingUser){
            throw new BadRequestError("Invalid Credentials");
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);
        
        if (!passwordsMatch) {
           throw new BadRequestError("Invalid Credentials"); 
        }

         // * Generate JWT:
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);

        // * Store JWTin session
        // req.session.jwt = userJwt; // will not work sometimes

        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    }
);

export {router as signInRouter};