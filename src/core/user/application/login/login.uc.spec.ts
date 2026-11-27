import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JwtUtil } from '../../../../config/jwt.util';
import {
  AppException,
  ValidationException,
} from '../../../shared/domain/exception';
import { UserRole } from '../../domain/role.enum';
import { IUser } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
import { LoginUserInput } from './login.schema';
import { LoginUserUseCase } from './login.uc';

const validInput: LoginUserInput = {
  email: 'kevin@example.com',
  password: 'Password123',
};

const validPasswordHash = bcrypt.hashSync(validInput.password, 4);

const makeUser = (overrides: Partial<IUser> = {}): IUser => ({
  id: 'e1007f1a-9745-4db7-aaed-0011be5eafab',
  role: UserRole.USER,
  name: 'Kevin Gomez',
  email: validInput.email,
  password_hash: validPasswordHash,
  membershipCount: 0,
  createdAt: new Date(),
  ...overrides,
});

/**
 * Inicializa `LoginUserUseCase` con dependencias simuladas en un estado válido (happy path).
 *
 * @param options.user Usuario devuelto por `userRepository.findByEmail` (`null` simula correo no registrado)
 * @param options.token Token devuelto por `JwtUtil.sign`
 */
const setup = ({
  user = makeUser(),
  token = 'signed.jwt.token',
}: {
  user?: IUser | null;
  token?: string;
} = {}) => {
  const userRepository = {
    findByEmail: vi.fn().mockResolvedValue(user),
  } as unknown as IUserRepository;

  const compareSpy = vi.spyOn(bcrypt, 'compare');
  const signSpy = vi.spyOn(JwtUtil, 'sign').mockReturnValue(token);

  return {
    useCase: new LoginUserUseCase(userRepository),
    userRepository,
    compareSpy,
    signSpy,
  };
};

describe('LoginUserUseCase.execute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  it('Lanza ValidationException y corta el flujo si el input es inválido', async () => {
    const { useCase, userRepository } = setup();

    await expect(
      useCase.execute({ email: '', password: '' }),
    ).rejects.toBeInstanceOf(ValidationException);

    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('Lanza AppException sin comparar contraseña si el correo no existe', async () => {
    const { useCase, userRepository, compareSpy, signSpy } = setup({
      user: null,
    });

    await expect(useCase.execute(validInput)).rejects.toMatchObject({
      message: 'Correo o contraseña incorrectos',
    } as Pick<AppException, 'message'>);

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
    expect(compareSpy).not.toHaveBeenCalled();
    expect(signSpy).not.toHaveBeenCalled();
  });

  it('Lanza AppException sin firmar JWT si la contraseña no coincide', async () => {
    const { useCase, userRepository, compareSpy, signSpy } = setup();
    const invalidPassword = 'OtraClave123';

    await expect(
      useCase.execute({ email: validInput.email, password: invalidPassword }),
    ).rejects.toMatchObject({
      message: 'Correo o contraseña incorrectos',
    } as Pick<AppException, 'message'>);

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
    expect(compareSpy).toHaveBeenCalledTimes(1);
    expect(compareSpy).toHaveBeenCalledWith(invalidPassword, validPasswordHash);
    expect(signSpy).not.toHaveBeenCalled();
  });

  it.each([
    { role: UserRole.USER, expiresIn: '60d' },
    { role: UserRole.ADMIN, expiresIn: '8h' },
  ])(
    'Firma el token con expiración de $expiresIn para el rol $role',
    async ({ role, expiresIn }) => {
      const user = makeUser({ role });
      const { useCase, userRepository, signSpy } = setup({
        user,
        token: `${role}.token`,
      });

      const result = await useCase.execute(validInput);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(signSpy).toHaveBeenCalledWith(
        { id: user.id, role: user.role, name: user.name, email: user.email },
        'test-jwt-secret',
        expiresIn,
      );
      expect(result).toEqual({ token: `${role}.token` });
    },
  );
});
