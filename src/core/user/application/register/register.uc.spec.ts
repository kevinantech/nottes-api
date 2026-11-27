import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Logger from '../../../../config/logger';
import {
  AppException,
  ValidationException,
} from '../../../shared/domain/exception';
import { UserRole } from '../../domain/role.enum';
import { IUser } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
import { RegisterUserInput } from './register.schema';
import { RegisterUserUseCase } from './register.uc';

const validInput: RegisterUserInput = {
  name: 'Kevin Gomez',
  email: 'kevin@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
};

/**
 * Inicializa `RegisterUserUseCase` con el repositorio simulados.
 *
 * @param options Respuestas simuladas para controlar el flujo de registro
 * @param options.existingUser Usuario existente devuelto por `findByEmail` (`null` simula correo disponible)
 */
const setup = ({
  existingUser = null,
}: {
  existingUser?: Partial<IUser> | null;
} = {}) => {
  const userRepository = {
    findByEmail: vi.fn().mockResolvedValue(existingUser),
    save: vi.fn().mockResolvedValue(undefined),
  } as unknown as IUserRepository;

  const genSaltSpy = vi.spyOn(bcrypt, 'genSalt');

  vi.spyOn(Logger, 'info').mockImplementation(() => Logger);

  return {
    useCase: new RegisterUserUseCase(userRepository),
    userRepository,
    genSaltSpy,
  };
};

describe('RegisterUserUseCase.execute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Lanza ValidationException y corta el flujo si el input es inválido', async () => {
    const { useCase, userRepository } = setup();

    await expect(
      useCase.execute({ ...validInput, email: '' }),
    ).rejects.toBeInstanceOf(ValidationException);

    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it('Lanza AppException antes de hashear la contraseña si el correo ya existe', async () => {
    const { useCase, genSaltSpy, userRepository } = setup({
      existingUser: { id: 'existing-id', email: validInput.email },
    });

    const error = await useCase.execute(validInput).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AppException);
    expect((error as AppException).message).toBe('Correo ya registrado');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
    expect(userRepository.save).not.toHaveBeenCalled();
    expect(genSaltSpy).not.toHaveBeenCalled();
  });
});

it('Hashea la contraseña y guarda el nuevo usuario con valores iniciales por defecto', async () => {
  const { useCase, userRepository } = setup();

  await useCase.execute(validInput);

  expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
  expect(userRepository.save).toHaveBeenCalledTimes(1);
  const savedUser = vi.mocked(userRepository.save).mock.calls[0][0];

  expect(savedUser).toMatchObject({
    id: expect.any(String),
    name: validInput.name,
    email: validInput.email,
    role: UserRole.USER,
    membershipCount: 0,
    createdAt: expect.any(Date),
  });

  expect(bcrypt.compareSync(validInput.password, savedUser.password_hash)).toBe(
    true,
  );
});
