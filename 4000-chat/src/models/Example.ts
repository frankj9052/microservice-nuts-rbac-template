import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ExampleAttrs {
    text: string,
    userId: string
}

interface ExampleDoc extends mongoose.Document {
    text: string,
    userId: string,
    version: number
}

interface ExampleModel extends mongoose.Model<ExampleDoc> {
    build(attrs: ExampleAttrs): ExampleDoc
}

const exampleSchema = new mongoose.Schema({
    text: {
        type: String,
        requrie: true
    },
    userId: {
        type: String,
        require: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id,
            delete ret._id
        }
    }
})

exampleSchema.set("versionKey", "version");
exampleSchema.plugin(updateIfCurrentPlugin)

exampleSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Example.findOne({
        _id: event.id,
        version: event.version - 1
    })
}

exampleSchema.statics.build = (attrs: ExampleAttrs) => {
    return new Example(attrs)
}

const Example = mongoose.model<ExampleDoc, ExampleModel>("Example", exampleSchema);

export {Example}