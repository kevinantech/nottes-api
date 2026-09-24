import { Schema, model } from 'mongoose';
import { IUser } from '../domain/user.entity';

const UserSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    registration_date: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const UserModel = model('users', UserSchema);
export { UserModel };

