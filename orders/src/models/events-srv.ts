import { OrderStatus } from "@ijeventure/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order } from "./order";

// * verifying attributes before passing to the constructor for adding data to database
interface EventAtts {
    name: string;
    id: string;
    date: Date;
    price: number;
    ticketsLeft: number;
    creatorId: string;
    version: number;
}


// * For adding additional properties in future
// * means a interface that describes the properties that a document has
interface EventDoc extends mongoose.Document{
    name: string;
    date: Date;
    price: number;
    ticketsLeft: number;
    creatorId: string;
    eventId: string;

    // * added for managing version of the document
    version: number;

    isReserved(): Promise<boolean>;
}

// * A interface that describes the properties tha a model has
interface EventModel extends mongoose.Model<EventDoc>{
    build(attrs: EventAtts) : EventDoc;
}

// * create schema for Event
const eventSchema = new mongoose.Schema({
    date: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ticketsLeft: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },  
    eventId: {
        type: String,
        required: true
    }  
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// * this set the versionKey to `version` instead of `__v`
eventSchema.set('versionKey', 'version');

// * added the plugin to update the version of the document
eventSchema.plugin(updateIfCurrentPlugin);

// * This is Mongoose pre-save hook (i.e. Mongoose Middleware)
eventSchema.pre('save', async function(done) {
    if(this.isModified('ticketsLeft')){
        this.set('version', this.get('version') - 1);
    }
    // * will tell mongoose that we are done
    done();
});

// * create a static method to create a document that satisfy the given types
eventSchema.statics.build = (attrs: EventAtts) => {
    return new Event({
        eventId: attrs.id,
        creatorId: attrs.creatorId,
        name: attrs.name,
        price: attrs.price,
        date: attrs.date,
        ticketsLeft: attrs.ticketsLeft
    });
}

eventSchema.methods.isReserved = async function() {
    // * this === the ticket document that we just called 'isReserved' on

    const existingOrder = await Order.findOne({
        // ticket: this.id,
        // @ts-ignore
        event: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
};

// * create a model
const Event = mongoose.model<EventDoc, EventModel>('Event', eventSchema);

// * export model
export { Event, EventDoc };