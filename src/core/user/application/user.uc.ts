import bcrypt from 'bcryptjs';
import { AppException, ValidationException } from '../../../config/exception';
import { signUserToken } from '../../../config/jwt.util';
import { IUserRepository } from '../domain/user.repository';
import {
  LoginUserInput,
  LoginUserInputSchema,
  RegisterUserInput,
  RegisterUserInputSchema,
} from '../domain/user.schema';
import { User } from '../domain/user.value';

const invalidLoginMessage = 'Correo o contraseña incorrectos';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async register(raw: RegisterUserInput): Promise<void> {
    const { data: input, error } = RegisterUserInputSchema.safeParse(raw);
    if (!input) throw ValidationException.fromZod(error);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(input.password, salt);

    // Checks that the user's email does not exist
    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) throw new AppException('Correo ya registrado');

    // Saves the user
    const user = new User(input.name, input.email, password_hash);
    await this.userRepository.save(user);

    // TODO: Add logger to log the user registration event
    // logger.info({ at: `${__dirname}, => register`, user });
  }

  public async login(raw: LoginUserInput): Promise<{ token: string }> {
    const { data: input, error } = LoginUserInputSchema.safeParse({
      email: raw.email,
      password: raw.password,
    });
    if (!input) throw ValidationException.fromZod(error);

    const userFound = await this.userRepository.findByEmail(input.email);
    if (!userFound) throw new AppException(invalidLoginMessage);

    // Verifying that the user's password match
    const matches = await bcrypt.compare(
      input.password,
      userFound.password_hash,
    );
    if (!matches) throw new AppException(invalidLoginMessage);

    const token = signUserToken(
      { id: userFound.id, email: userFound.email },
      <string>process.env.JWT_SECRET,
      '60d',
    );

    return { token };
  }
}

