import { z } from 'zod';

const MAX_TITLE_LENGTH = 256;

export const CreateTaskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El titulo es requerido')
    .max(
      MAX_TITLE_LENGTH,
      `El titulo debe puede exceder ${MAX_TITLE_LENGTH} caracteres`,
    ),
  projectId: z.string().min(1, 'El proyecto es requerido'),
});

export const UpdateTaskInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El titulo es requerido')
    .max(
      MAX_TITLE_LENGTH,
      `El titulo debe puede exceder ${MAX_TITLE_LENGTH} caracteres`,
    )
    .optional(),
  status: z.boolean().optional(),
  projectId: z.string().min(1, 'El proyecto es requerido').optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;
