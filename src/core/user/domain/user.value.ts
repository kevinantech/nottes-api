import { v4 as uuid } from 'uuid';
import { IUser } from './user.entity';

export class User implements IUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  registration_date: Date;

  constructor(name: string, email: string, password_hash: string) {
    this.id = uuid();
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.registration_date = new Date();
  }
}

