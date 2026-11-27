import bcrypt from 'bcryptjs';
import Logger from '../../../../config/logger';
import { Inject, Injectable } from '../../../../di';
import {
  AppException,
  ValidationException,
} from '../../../shared/domain/exception';
import { IUserRepository } from '../../domain/user.repository.interface';
import { User } from '../../domain/user.value';
import { RegisterUserInput, RegisterUserSchema } from './register.schema';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(raw: RegisterUserInput): Promise<void> {
    const { data: input, error } = RegisterUserSchema.safeParse(raw);
    if (!input) throw ValidationException.fromZod(error);

    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) throw new AppException('Correo ya registrado');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(input.password, salt);

    const user = new User(input.name, input.email, password_hash);
    await this.userRepository.save(user);

    Logger.info('Usuario registrado');
  }
}
