import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// * verifying attributes before passing to the constructor for adding data to database
interface EventAtts {
    name: string;
    description: string;
    date: Date;
    price: number;
    ticketsLeft: number;
    creatorId: string;
}


// * For adding additional properties in future
// * means a interface that describes the properties that a document has
interface EventDoc extends mongoose.Document{
    name: string;
    description: string;
    date: Date;
    price: number;
    ticketsLeft: number;

    creatorId: string;

    // * added for managing version of the document
    version: number;
}

// * A interface that describes the properties tha a model has
interface EventModel extends mongoose.Model<EventDoc>{
    build(attrs: EventAtts) : EventDoc;
}

// * create schema for Event
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
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
    creatorId: {
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


// * create a static method to create a document that satisfy the given types
eventSchema.statics.build = (attrs: EventAtts) => {
    return new Event(attrs);
}

// * create a model
const Event = mongoose.model<EventDoc, EventModel>('Event', eventSchema);

// * export model
export { Event };