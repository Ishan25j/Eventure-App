import request from 'supertest';
import { app } from '../../app';
import { Event } from '../../models/events-srv';
import mongoose from 'mongoose';

it('it fetches the order', async () => {
    
    const eventDate = new Date();
    // * Create a event
    const event = Event.build({
        id: mongoose.Types.ObjectId().toHexString(),
        date: eventDate,
        price: 20,
        ticketsLeft: 20,
        name: 'concert',
        creatorId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });

    await event.save();

    const user = global.signin();

    // * make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({eventId: event.eventId})
        .expect(201);

    // * make request to fetch the order
    const { body: fetchOrder } = await request(app)
        .get(`/api/orders`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchOrder[0].userId).toEqual(order.userId);
});

it('returns an error if one user tries to fetch another users order', async () => {
    
    // * Create a Event
    const event = Event.build({
        id: mongoose.Types.ObjectId().toHexString(),
        date: new Date(),
        price: 20,
        name: 'concert',
        ticketsLeft: 20,
        creatorId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });

    await event.save();

    const user = global.signin();
    const user1 = global.signin();

    // * make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({eventId: event.eventId})
        .expect(201);

    // * make request to fetch the order
    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user1)
        .send()
        .expect(401);

});