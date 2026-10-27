import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { connectDatabase } from '../src/config/database';
import { UserRole } from '../src/core/user/domain/role.enum';
import { RegisterUserSchema } from '../src/core/user/domain/user.schema';
import { UserModel } from '../src/core/user/infrastructure/user.model';
import { UserRepository } from '../src/core/user/infrastructure/user.repository';
dotenv.config({ path: 'auser.env' });

if (!process.env.AUSER_NAME) {
  throw new Error('AUSER_NAME is not defined in the environment variables');
}

if (!process.env.AUSER_EMAIL) {
  throw new Error('AUSER_EMAIL is not defined in the environment variables');
}

if (!process.env.AUSER_PASSWORD) {
  throw new Error('AUSER_PASSWORD is not defined in the environment variables');
}

const AUSER = {
  name: process.env.AUSER_NAME,
  email: process.env.AUSER_EMAIL,
  password: process.env.AUSER_PASSWORD,
};

const userRepository = new UserRepository();

const createMUser = async () => {
  try {
    await connectDatabase();
    const { data: input, error } = RegisterUserSchema.safeParse(AUSER);
    if (error) throw error;

    const password_hash = await bcrypt.hash(input.password, 10);

    const user = await userRepository.findByEmail(input.email);
    if (user) throw new Error('The email is already registered');

    await new UserModel({
      id: uuid(),
      role: UserRole.ADMIN,
      name: input.name,
      email: input.email,
      password_hash,
      createdAt: new Date(),
    }).save();

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createMUser();
