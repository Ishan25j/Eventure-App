import request from "supertest";
import { app } from "../../app";
import { Event } from "../../models/events-srv";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from 'mongoose';
import { Order, OrderStatus } from "../../models/order";

it('returns error if event does not exists', async () => {
    const eventId = mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            eventId
        })
        .expect(404);
});

it('returns an error if ticket is not available for a event', async () => {
    const eventId = mongoose.Types.ObjectId().toHexString();
    const event = Event.build({
        id: eventId,
        date: new Date(),
        price: 20,
        name: 'concert',
        ticketsLeft: 0,
        creatorId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });

    await event.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            eventId
        })
        .expect(400); 
});

it('returns an order, if ticket is available for a event', async () => {
    const eventId = mongoose.Types.ObjectId().toHexString();
    const event = Event.build({
        id: eventId,
        date: new Date(),
        price: 20,
        name: 'concert',
        ticketsLeft: 20,
        creatorId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });

    
    await event.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            eventId: eventId
        })
        .expect(201);
});
