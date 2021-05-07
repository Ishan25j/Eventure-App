import mongoose from 'mongoose';
import { Password } from '../services/password';

/*
* An interface that describes the
* propertiess that are required to create a new User 
*/ 
interface UserAttrs {
    email: string;
    password: string;
}

/*
* An interface that describes the properties that
* user model has
*/
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

/*
* An interface that describes the properties
* that a User Document has.
*/
interface UserDoc  extends mongoose.Document {
    email: string;
    password: string;

    // todo: Credits is for future update where sell tocket money will be stored
    credits: number;
}


// * Create User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    credits: {
        type: String,
        default: 0
    }
},
{   // * convert the json format in required form 
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            // * delete keyword is the plain JS, used to remove property from object
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// * This is Mongoose pre-save hook (i.e. Mongoose Middleware)
userSchema.pre('save', async function(done) {
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    // * will tell mongoose that we are done
    done();
});


// * build new user
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

// * Creating user model having userSchema
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


// * So we can add user like as below

/*
* User.build({
*     email: '..',
*     password: '..'
* });
*/

// * Export user model
export { User } ;