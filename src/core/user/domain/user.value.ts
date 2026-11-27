import { v4 as uuid } from 'uuid';
import { IUser } from './user.entity';
import { UserRole } from './role.enum';

export class User implements IUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password_hash: string;
  membershipCount: number;
  createdAt: Date;

  constructor(name: string, email: string, password_hash: string) {
    this.id = uuid();
    this.role = UserRole.USER;
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.membershipCount = 0;
    this.createdAt = new Date();
  }
}

