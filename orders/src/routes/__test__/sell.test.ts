import request from "supertest";
import { app } from "../../app";
import { Event } from "../../models/events-srv";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from 'mongoose';
import { Order, OrderStatus } from "../../models/order";

it('returns error if order is not found', async () => {
    await request(app)
        .post('/api/orders/sell')
        .set('Cookie', global.signin())
        .send({
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);

});

it('returns error if ticket is expired', async () => {
    const eventId = mongoose.Types.ObjectId().toHexString();
    const event = Event.build({
        id: eventId,
        date: new Date('2001-05-01'),
        price: 20,
        name: 'concert',
        ticketsLeft: 20,
        creatorId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });
    
    await event.save();

    const user = global.signin();

    const responseOrder = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            eventId: eventId
        })
        .expect(201);

    const order = await Order.findById(responseOrder.body.id);

    order?.set({
        status: OrderStatus.Complete
    });

    await order?.save();

    await request(app)
        .post('/api/orders/sell/')
        .set('Cookie', user)
        .send({
            orderId: order!._id
        })
        .expect(400);
});


it('sell the ticket of given order', async () => {
    const eventId = mongoose.Types.ObjectId().toHexString();
    
    const eventDate = new Date();
    eventDate.setSeconds(eventDate.getSeconds() + 12*60);

    const event = Event.build({
        id: eventId,
        date: eventDate,
        price: 20,
        name: 'concert',
        ticketsLeft: 20,
        creatorId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });
    
    await event.save();

    const user = global.signin();

    const responseOrder = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            eventId: eventId
        })
        .expect(201);

    const order = await Order.findById(responseOrder.body.id);

    order?.set({
        status: OrderStatus.Complete
    });

    await order?.save();

    await request(app)
        .post('/api/orders/sell/')
        .set('Cookie', user)
        .send({
            orderId: order!._id
        })
        .expect(200);
});

// * put below code in sell.ts for manual log testing to see whether ticket is valid
// console.log(order.event.date, order.event.date.getTime() , new Date().getTime(), (order.event.date.getTime() - new Date().getTime())/1000 - (10*60), (order.event.date.getTime() - new Date().getTime())/1000 - (10*60)< 0);