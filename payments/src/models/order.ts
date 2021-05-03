import mongoose from "mongoose";
import { OrderStatus } from "@ijeventure/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

// * verifying attributes before passing to the constructor for adding data to database
interface OrderAtts {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}


// * For adding additional properties in future
// * means a interface that describes the properties that a document has
interface OrderDoc extends mongoose.Document{
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
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
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
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
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
}

// * create a model
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

// * export model
export { Order };