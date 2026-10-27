import { z } from 'zod';

export interface ErrorResponse {
  message: string;
  code: string;
  errors?: FieldError[];
}

export class AppException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
    public readonly code: string = 'APP_ERROR',
  ) {
    super(message);
  }

  toResponse(): ErrorResponse {
    return { message: this.message, code: this.code };
  }
}

export interface FieldError {
  field: string;
  message: string;
}

type ValidationExceptionOptions = {
  message?: string;
};

export class ValidationException extends AppException {
  constructor(
    public readonly errors: FieldError[],
    options?: ValidationExceptionOptions,
  ) {
    super('Datos inválidos', 400, 'VALIDATION_ERROR');
  }

  static fromZod(
    error: z.ZodError,
    options?: ValidationExceptionOptions,
  ): ValidationException {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return new ValidationException(errors, options);
  }

  toResponse(): ErrorResponse {
    return { ...super.toResponse(), errors: this.errors };
  }
}
