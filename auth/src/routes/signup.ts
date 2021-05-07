import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@ijeventure/common';
import { User } from '../models/user';

const router: Router = express.Router();

// router.use(express.json());

router.post('/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    
    const {email, password} = req.body;
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('Email is already!!');
    }

    const user = User.build({email, password});
    await user.save();

    // * Generate JWT:
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);

    // * Store JWTin session
    // req.session.jwt = userJwt; // will not work sometimes

    req.session = {
        jwt: userJwt
    };

    res.status(200).send(user);

});

export {router as signUpRouter};