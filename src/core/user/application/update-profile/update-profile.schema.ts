import { z } from 'zod';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../../domain/user.constants';

/**
 * Actualmente solo se permite actualizar el nombre del perfil.
 * Al incorporar más campos, hacer las propiedades opcionales
 * y validar que al menos un campo sea enviado.
 */
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_NAME_LENGTH,
      `El nombre debe tener al menos ${MIN_NAME_LENGTH} caracteres`,
    )
    .max(
      MAX_NAME_LENGTH,
      `El nombre no puede exceder ${MAX_NAME_LENGTH} caracteres`,
    ),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
