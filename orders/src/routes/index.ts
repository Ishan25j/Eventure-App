import { DatabaseConnectionError, NotAuthorizedError, NotFoundError, requireAuth} from '@ijeventure/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';


const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

    const order = await Order.findById(req.params.orderId).populate('event');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }
    
    if (!process.env.STRIPE_P_KEY) {
        throw new DatabaseConnectionError();
    }

    const eVar = process.env.STRIPE_P_KEY;

    res.send({ order : order, env: eVar});
});

export {router as indexOrderRouter }; 