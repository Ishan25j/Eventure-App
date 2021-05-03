import express from 'express';

// * Use to handle async like simple ts command instead of express next
import 'express-async-errors';

import { json } from 'body-parser';


// * Used for creating cookie
import cookieSession from 'cookie-session';


// * Custom uploaded shared npm module
import { errorHandler, NotFoundError, currentUser } from '@ijeventure/common';
import { createEventRouter } from './routes/new';
import { showEventsRouter } from './routes/show';
import { indexEventsRouter } from './routes';


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

// * verify user authentication
app.use(currentUser);

// * For handling event-srv routes
app.use(createEventRouter);
app.use(showEventsRouter);
app.use(indexEventsRouter);

// * It matches all requests which comes and will throw the NotFoundError class
/* 
* Here if we use async in the function then we have to use next() express
* function as next(new NotFoundError()); else we have to add a new module in import section which is import 'express-async-eerrors'
* to fix this break code

? app.all('*', async(req, res, next) => {
?   next(new NotFoundError());
? });
*/

app.all('*', async() => {
  throw new NotFoundError();
});


// * for handling error handling
app.use(errorHandler);

export { app };