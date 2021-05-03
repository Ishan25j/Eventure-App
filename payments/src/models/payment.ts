import mongoose from "mongoose";

// * this model is just for future bases to add some total payment done by the user

// * verifying attributes before passing to the constructor for adding data to database
interface PaymentAtts {
    orderId: string;
    stripeId: string;
}


// * For adding additional properties in future
// * means a interface that describes the properties that a document has
interface PaymentDoc extends mongoose.Document{
    orderId: string;
    stripeId: string;
}

// * A interface that describes the properties tha a model has
interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build(attrs: PaymentAtts): PaymentDoc;
}

// * create schema for ticket
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
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


// * create a static method to create a document that satisfy the given types
paymentSchema.statics.build = (attrs: PaymentAtts) => {
    return new Payment(attrs);
}

// * create a model
const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

// * export model
export { Payment };