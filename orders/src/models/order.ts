import mongoose, { mongo } from "mongoose";
import { OrderStatus } from "@ijeventure/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { EventDoc } from "./events-srv";

export { OrderStatus };

// * verifying attributes before passing to the constructor for adding data to database
interface OrderAtts {
    userId: string;
    expiresAt: Date;
    status: OrderStatus;
    event: EventDoc;
}


// * For adding additional properties in future
// * means a interface that describes the properties that a document has
interface OrderDoc extends mongoose.Document{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    event: EventDoc;
    version: number;
}

// * A interface that describes the properties tha a model has
interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAtts): OrderDoc;
}

// * create schema for ticket
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
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
orderSchema.set('versionKey', 'version');

// * added the plugin to update the version of the document
orderSchema.plugin(updateIfCurrentPlugin);


// * create a static method to create a document that satisfy the given types
orderSchema.statics.build = (attrs: OrderAtts) => {
    return new Order(attrs);
}

// * create a model
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

// * export model
export { Order };