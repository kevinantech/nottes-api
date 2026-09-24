import bcrypt from 'bcryptjs';
import { AppException, ValidationException } from '../../../config/exception';
import { signUserToken } from '../../../config/jwt.util';
import { UserRepository } from '../domain/user.repository';
import {
  LoginUserInputSchema,
  RegisterUserInputSchema,
} from '../domain/user.schema';
import { User } from '../domain/user.value';

const invalidLoginMessage = 'Correo o contraseña incorrectos';

export type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserParams = {
  email: string;
  password: string;
};

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(raw: RegisterUserParams): Promise<void> {
    const { data: input, error } = RegisterUserInputSchema.safeParse(raw);
    if (!input) throw ValidationException.fromZod(error);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(input.password, salt);

    // Checks that the user's email does not exist.
    const userFound = await this.userRepository.findUserByEmail(input.email);
    if (userFound) throw new AppException('Correo ya registrado');

    // Saves the user
    const user = new User(input.name, input.email, password_hash);
    await this.userRepository.registerUser(user);

    // TODO: Add logger to log the user registration event.
    // logger.info({ at: `${__dirname}, => register`, user });
  }

  public async login(raw: LoginUserParams): Promise<{ token: string }> {
    const { data: input, error } = LoginUserInputSchema.safeParse({
      email: raw.email,
      password: raw.password,
    });
    if (!input) throw ValidationException.fromZod(error);

    const userFound = await this.userRepository.findUserByEmail(input.email);
    if (!userFound) throw new AppException(invalidLoginMessage);

    // Verifying that the user's password match
    const isCorrectPassword = await bcrypt.compare(
      input.password,
      userFound.password_hash,
    );
    if (!isCorrectPassword) throw new AppException(invalidLoginMessage);

    const token = signUserToken(
      { id: userFound.id, email: userFound.email },
      <string>process.env.JWT_SECRET,
      '15d',
    );

    return { token };
  }
}

