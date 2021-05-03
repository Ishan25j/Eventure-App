import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";
import request from 'supertest';
import { app } from "../app";

// * modify the interface to validate signin() function globally
declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]> 
        }
    }
}

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

// * Global function for signup and return cookie
global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(200);

    const cookie = response.get('Set-Cookie');

    return cookie;
}