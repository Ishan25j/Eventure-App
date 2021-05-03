import express, {Request, Response} from 'express';
import { Event } from '../models/event-srv';

// * Custom NPM module
import { NotFoundError } from "@ijeventure/common";

const router = express.Router();

router.get('/api/events',async (req: Request, res: Response) => {

    // * get current time
    const currentDate = new Date();
    
    const event = await Event.find({});
    
    if (!event) {
        throw new NotFoundError();
    }

    // * filter out the events which are past
    const events = event.filter(eventData => {
        return (currentDate.getTime() < new Date(eventData.date).getTime());
    })

    res.send(events);
});

export { router as showEventsRouter };