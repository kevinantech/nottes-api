import { z } from 'zod';
import { EmailSchema } from '../../../shared/application/email.schema';

export const LoginUserSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
