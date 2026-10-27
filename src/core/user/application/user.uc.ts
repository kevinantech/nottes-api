import bcrypt from 'bcryptjs';
import {
  AppException,
  ValidationException,
} from '../../shared/domain/exception';
import { JwtUtil } from '../../../config/jwt.util';
import { UserRole } from '../domain/role.enum';
import { IUserRepository } from '../domain/user.repository.interface';
import {
  LoginUserInput,
  LoginUserSchema,
  RegisterUserInput,
  RegisterUserSchema,
  UpdateUserInput,
  UpdateUserSchema,
} from '../domain/user.schema';
import { User } from '../domain/user.value';
import { IUserResponse } from '../domain/user.entity';
import Logger from '../../../config/logger';
import { Inject, Injectable } from '../../../di';

const invalidLoginMessage = 'Correo o contraseña incorrectos';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  public async register(raw: RegisterUserInput): Promise<void> {
    const { data: input, error } = RegisterUserSchema.safeParse(raw);
    if (!input) throw ValidationException.fromZod(error);

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(input.password, salt);

    const exists = await this.userRepository.findByEmail(input.email);
    if (exists) throw new AppException('Correo ya registrado');

    const user = new User(input.name, input.email, password_hash);
    await this.userRepository.save(user);

    Logger.info('Usuario registrado');
  }

  public async login(raw: LoginUserInput): Promise<{ token: string }> {
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

  public async getProfile(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppException('Usuario no encontrado');
    return {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      projectCount: user.projectCount,
      createdAt: user.createdAt.toISOString(),
    };
  }

  public async updateProfile(
    id: string,
    raw: UpdateUserInput,
  ): Promise<Partial<IUserResponse>> {
    const { data: input, error } = UpdateUserSchema.safeParse(raw);
    if (!input) throw ValidationException.fromZod(error);

    const changes = {};
    for (const [key, value] of Object.entries(input)) {
      if (value) changes[key] = value;
    }

    if (Object.keys(changes).length === 0) {
      throw new AppException('No se proporcionaron campos para actualizar');
    }

    const result = await this.userRepository.updateById(id, changes);

    return {
      id: result.id,
      name: result.name,
      role: result.role,
      email: result.email,
      projectCount: result.projectCount,
      createdAt: result.createdAt.toISOString(),
    } as IUserResponse;
  }
}

