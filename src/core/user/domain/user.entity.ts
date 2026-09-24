export interface IUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  registration_date: Date;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  registration_date: Date;
}
