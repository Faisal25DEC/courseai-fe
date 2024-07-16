import mongoose, { Document, Model, Schema } from 'mongoose';

interface IVerified {
  org_id: string;
  is_verified: boolean;
}

interface IUser extends Document {
  _id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: string[];
  created_at: number;
  updated_at: number;
  verified?: IVerified; // Make this field optional
}

const VerifiedSchema: Schema<IVerified> = new Schema({
  org_id: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    required: true,
  },
});

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
  verified: {
    type: VerifiedSchema,
    required: false, // Make it optional
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
