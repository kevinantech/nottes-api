import { z } from 'zod';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

export const RegisterUserInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_NAME_LENGTH,
      `El nombre debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`,
    )
    .max(
      MAX_NAME_LENGTH,
      `El nombre debe tener entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} caracteres`,
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
    ),
});

export const LoginUserInputSchema = z.object({
  email: z.email({ message: 'El correo electrónico no es válido' }),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type RegisterInput = z.infer<typeof RegisterUserInputSchema>;
export type LoginInput = z.infer<typeof LoginUserInputSchema>;
