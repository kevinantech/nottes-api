import { z } from 'zod';
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../const';

export const UpdateProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El titulo es requerido')
    .max(
      MAX_TITLE_LENGTH,
      `El titulo debe puede exceder ${MAX_TITLE_LENGTH} caracteres`,
    )
    .optional(),
  description: z
    .string()
    .trim()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `La descripción no puede exceder ${MAX_DESCRIPTION_LENGTH} caracteres`,
    )
    .optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
