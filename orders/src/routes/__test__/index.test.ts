import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Event } from '../../models/events-srv';
import mongoose from 'mongoose';

const buildEvent = async () => {
    const event = Event.build({
        id: mongoose.Types.ObjectId().toHexString(),
        date: new Date(),
        name: 'concert',
        price: 20,
        ticketsLeft: 20,
        creatorId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });

    await event.save();

    return event;
}

it('fetches orders for a particular user', async () => {
    // * create 3 events
    const eventOne = await buildEvent();
    const eventTwo = await buildEvent();
    const eventThree = await buildEvent();
    
    const user1 = global.signin();
    const user2 = global.signin();
    
    // * create one order as User #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({eventId: eventOne.eventId})
        .expect(201);

    // * create two order as User #2
    // * destructure response and take body and rename it orderOne
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({eventId: eventTwo.eventId})
        .expect(201);

    // * destructure response and take body and rename it orderTwo
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({eventId: eventThree.eventId})
        .expect(201);
    // * make request to get for User #2

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .send()
        .expect(200);
    // * make sure we only got orders fro User #2

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[0].event.id).toEqual(eventTwo.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[1].event.id).toEqual(eventThree.id);

});