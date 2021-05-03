import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";
import request from 'supertest';
import { app } from "../app";

import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[]; 
        }
    }
}

// * tell jest to use this fake mock file for a test
jest.mock('../nats-wrapper');

let mongo: any;
// * It is a hook function: It is like before all test
beforeAll(async() => {
    process.env.JWT_KEY = 'asdfasdf';
    
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    
    
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
});

// * It is also a hook which is like before each test
beforeEach(async() => {

    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// * It is a hook that run after our all test are completed
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// * Global function for fake authentication and return cookie
global.signin = () => {
    
    // * Build a JWT payload. {id, email}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };

    // * Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // * Build a session Object. {jwt: MY_JWT}
    const session = { jwt: token };

    // * Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // * Take JSON and encode it as base64
    const base64 =  Buffer.from(sessionJSON).toString('base64');

    // * return a string that's the cookie with ths encoded data
    return [`express:sess=${base64}`];
}