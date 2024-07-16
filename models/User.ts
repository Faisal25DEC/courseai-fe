// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  _id: string; 
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: string[];
  created_at: number;
  updated_at: number;
  is_verified: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  _id: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  email_addresses: [{
    type: String,
    required: true,
  }],
  created_at: {
    type: Number,
    required: true,
  },
  updated_at: {
    type: Number,
    required: true,
  },
  is_verified: {
    type: Boolean,
    required: true,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;