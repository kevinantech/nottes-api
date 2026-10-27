import { z } from 'zod';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

export const RegisterUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_NAME_LENGTH,
      `El nombre debe tener debe tener al menos ${MIN_NAME_LENGTH} caracteres`,
    )
    .max(
      MAX_NAME_LENGTH,
      `El nombre no puede exceder ${MAX_NAME_LENGTH} caracteres`,
    ),

  email: z.email({ message: 'El correo electrónico no es válido' }),

  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    )
    .max(
      MAX_PASSWORD_LENGTH,
      `La contraseña no puede exceder ${MAX_PASSWORD_LENGTH} caracteres`,
    )
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
    ),
});

export const LoginUserSchema = z.object({
  email: z.email({ message: 'El correo electrónico no es válido' }),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_NAME_LENGTH,
      `El nombre debe tener debe tener al menos ${MIN_NAME_LENGTH} caracteres`,
    )
    .optional(),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
