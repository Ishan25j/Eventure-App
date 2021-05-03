import request from "supertest";
import { app } from "../../app";
import { Event } from "../../models/event-srv";
import { natsWrapper } from "../../nats-wrapper";



it('has a route handler listening to /api/events/new for posts requests', async () => {
    const response = await request(app)
        .post('/api/events/new')
        .send({});

        expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/events/new')
        .send({})
        .expect(401);
});

it('return other than 401 as user is signed in', async () => {
    const response = await request(app)
        .post('/api/events/new')
        .set('Cookie', global.signin())
        .send({});

        expect(response.status).not.toEqual(401);
});


it('creates a event with valid parameters', async () => {

    // * add in a check to make sure that ticket was saved
    
    let events = await Event.find({});
    
    expect(events.length).toEqual(0);

    await request(app)
        .post('/api/events/new')
        .set('Cookie', global.signin())
        .send({
            name: 'concert',
            description: 'this is test',
            date: '2022-06-12',
            ticketLeft: 20,
            price: 20
        })
        .expect(201);

    events = await Event.find({});

    expect(events.length).toEqual(1);
    expect(events[0].price).toEqual(20);
    expect(events[0].name).toEqual('concert');
});


it('publishes an event', async () => {
    let events = await Event.find({});
    
    await request(app)
        .post('/api/events/new')
        .set('Cookie', global.signin())
        .send({
            name: 'concert',
            description: 'this is test',
            date: '2022-06-12',
            ticketLeft: 20,
            price: 20
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
});