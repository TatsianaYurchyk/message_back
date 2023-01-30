import { InferSchemaType, model, Schema } from "mongoose";

const mailSchema = new Schema({
    // userId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    receiver:{type: String, required: true},
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true });

type Mail = InferSchemaType<typeof mailSchema>;

export default model<Mail>("Mail", mailSchema);