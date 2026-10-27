import { UserRole } from './role.enum';

export interface IUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password_hash: string;
  projectCount: number;
  createdAt: Date;
}

export interface IUserResponse {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  projectCount: number;
  createdAt: string;
}

