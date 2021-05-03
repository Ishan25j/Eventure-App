import express from 'express';

// * Use to handle async like simple ts command instead of express next
import 'express-async-errors';

import { json } from 'body-parser';


// * Used for creating cookie
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@ijeventure/common';

// * create express app
const app = express();

// * Will allow ngnix to run safe
app.set('trust proxy', true);

// * parse the request as a json format
app.use(json());

// * Adding cookie session configuration
/*
* Here in cookieSession, signed: false means we turn off encrypting, 
* and secure: true means we will use https protocol
*/
app.use(
  cookieSession({
    signed: false,
    // * this ensures that if we are in test mode it will allow http request else only https are allowed
    secure: process.env.NODE_ENV !== 'test'
  })
)

// * For handling auth routes
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);


// * It matches all requests which comes and will throw the NotFoundError class
app.all('*', async() => {
  throw new NotFoundError();
});


// * for handling error handling
app.use(errorHandler);

export { app };