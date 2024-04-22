# 1 - Introduction

This method is relatively cumbersome but very efficient, making full use of TypeScript's features and greatly enhancing code prompting.

This is totally **optional** as long as your server is running successfully.

# 2 - Define Model

`4000-chat/src/models/ChatHistoryExample.ts`

~~~typescript
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// This interface definition will help prompt which properties need to be entered when creating a record.
interface ExampleAttrs {
    text: string,
    userId: string
}

// This interface definition will help prompt which properties a record will possess after creation. These properties may be more than those specified during creation.
interface ExampleDoc extends mongoose.Document {
    text: string,
    userId: string,
    version: number
}

// In the model, we will have an additional 'build' method to create a record. When using this method, it will prompt which properties need to be entered.
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
    // Here, for the sake of uniformity in naming the ID property, as other services might use different databases where the ID is named '_id' in Mongoose, we standardize it as 'id'."
    toJSON: {
        transform(doc, ret) {
            ret._id = ret._id,
            delete ret._id
        }
    }
})

// Here, for the sake of uniformity with 'version', in Mongoose, the property named 'version' is '__v', which is used to record the sequence of duplicate data when crossing servers.
exampleSchema.set("versionKey", "version");
// Each time 'save' is triggered here, the version is incremented by 1.
exampleSchema.plugin(updateIfCurrentPlugin)

// In the model, there will be a 'findByEvent' method, solely used for determining the update order via the version when dealing with duplicate data across servers.
exampleSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Example.findOne({
        _id: event.id,
        version: event.version - 1
    })
}

// In the model, we will have an additional 'build' method to create a record. When using this method, it will prompt which properties need to be entered.
exampleSchema.statics.build = (attrs: ExampleAttrs) => {
    return new Example(attrs)
}

const Example = mongoose.model<ExampleDoc, ExampleModel>("Example", exampleSchema);

export {Example}
~~~



# 3 - Create Record

Please check the routes example

`4000-chat/src/routes`

- example-index
- example-new
- example-show
- example-update

