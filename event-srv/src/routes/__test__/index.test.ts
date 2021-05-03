import request from "supertest";
import { app } from "../../app";


const createEvent = () => {
    return request(app)
    .post('/api/events/new')
    .set('Cookie', global.signin())
    .send({
        name: 'concert',
        description: 'this is test',
        date: '2022-06-12',
        ticketLeft: 20,
        price: 20
    });
}

it('can fetch a list of events', async () => {
    await createEvent();
    await createEvent();
    await createEvent();

    const response = await request(app)
        .get('/api/events')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);

});