import {InferSchemaType,model, Schema} from "mongoose";

const userSchema = new Schema ({
    username: {type: String, required: true, unique: true},
},);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
