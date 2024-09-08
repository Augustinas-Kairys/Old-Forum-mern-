import { Document, Schema, Model, model } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string; 
}

const userSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String } 
});

const User: Model<UserDocument> = model<UserDocument>('User', userSchema);

export default User;
