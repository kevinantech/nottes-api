import { EmailSchema } from '../../../shared/application/email.schema';
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../domain/user.constants';
import { z } from 'zod';

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/;

export const RegisterUserSchema = z
  .object({
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

    email: EmailSchema,

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
        PASSWORD_REGEX,
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
      ),

    confirmPassword: z
      .string()
      .min(1, 'La confirmación de contraseña es requerida'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Las contraseñas no coinciden',
        path: ['password'],
      });
      ctx.addIssue({
        code: 'custom',
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
