import { z } from 'zod';

const MAX_TITLE_LENGTH = 128;

export const CreateProjectInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El titulo es requerido')
    .max(
      MAX_TITLE_LENGTH,
      `El titulo debe puede exceder ${MAX_TITLE_LENGTH} caracteres`,
    ),
});

export const UpdateProjectInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El titulo es requerido')
    .max(
      MAX_TITLE_LENGTH,
      `El titulo debe puede exceder ${MAX_TITLE_LENGTH} caracteres`,
    ),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
