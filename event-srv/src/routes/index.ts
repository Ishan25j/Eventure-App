import express, {Request, Response} from 'express';
import { Event } from '../models/event-srv';

// * Custom NPM module
import { NotFoundError } from "@ijeventure/common";

const router = express.Router();

router.get('/api/events/:eventId',async (req: Request, res: Response) => {

    
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
        throw new NotFoundError();
    }

    res.send(event);
});

export { router as indexEventsRouter };