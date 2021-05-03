import request from "supertest";
import { app } from "../../app";



it('returns 404 if event is not found', async () => {
    await request(app)
        .get('/api/events/ljhlxuvhdigv')
        .send()
        .expect(404);
});

it('returns the events if event is created succesfully', async () => {
    
    const name = 'concert';
    const description = 'this is a test';
    const date = '2022-06-12';
    const ticketLeft = 10;
    const price = 20;

    const response = await request(app)
        .post('/api/events/new')
        .set('Cookie', global.signin())
        .send({
            name,
            description,
            date,
            ticketLeft,
            price
        })
        .expect(201);

    const eventResponse = await request(app)
        .get(`/api/events/${response.body.id}`)
        .send()
        .expect(200);

    expect(eventResponse.body.name).toEqual(name);
    expect(eventResponse.body.name).toEqual(name);
    expect(eventResponse.body.name).toEqual(name);
    expect(eventResponse.body.name).toEqual(name);
    expect(eventResponse.body.price).toEqual(price);
});