import { Schema, model } from 'mongoose';
import { IUser } from '../domain/user.entity';
import { UserRole } from '../domain/role.enum';

const UserSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
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
    createdAt: {
      type: Date,
      required: true,
    },
    projectCount: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);
const UserModel = model('users', UserSchema);
export { UserModel };

