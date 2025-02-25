import mongoose from "mongoose";
import { Password } from "../services/password";
import { ROLE } from "@noqclinic/common";

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
    email: string,
    password: string,
    role?: string,
}

// An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties that a User Documents has
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
    role: string
    // createdAt: Date,
    // updatedAt: Date
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true,
        enum: ROLE,
        default: ROLE.client
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
})

userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password') as string)
        this.set('password', hashed)
    }
    done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }