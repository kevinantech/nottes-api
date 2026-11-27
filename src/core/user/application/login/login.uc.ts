import bcrypt from 'bcryptjs';
import { JwtUtil } from '../../../../config/jwt.util';
import { Inject, Injectable } from '../../../../di';
import {
  AppException,
  ValidationException,
} from '../../../shared/domain/exception';
import { UserRole } from '../../domain/role.enum';
import { IUserRepository } from '../../domain/user.repository.interface';
import { LoginUserInput, LoginUserSchema } from './login.schema';

const invalidLoginMessage = 'Correo o contraseña incorrectos';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  public async execute(raw: LoginUserInput): Promise<{ token: string }> {
    const { data: input, error } = LoginUserSchema.safeParse({
      email: raw.email,
      password: raw.password,
    });
    if (!input) throw ValidationException.fromZod(error);

    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new AppException(invalidLoginMessage);

    const matches = await bcrypt.compare(input.password, user.password_hash);
    if (!matches) throw new AppException(invalidLoginMessage);

    const token = JwtUtil.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      <string>process.env.JWT_SECRET,
      user.role === UserRole.ADMIN ? '8h' : '60d',
    );

    return { token };
  }
}
