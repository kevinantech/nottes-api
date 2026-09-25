import { z } from 'zod';

export interface FieldError {
  field: string;
  message: string;
}

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

export class ValidationException extends AppException {
  constructor(public readonly errors: FieldError[]) {
    super('Datos inválidos', 400, 'VALIDATION_ERROR');
  }

  static fromZod(error: z.ZodError): ValidationException {
    return new ValidationException(
      error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }

  toResponse(): ErrorResponse {
    return { ...super.toResponse(), errors: this.errors };
  }
}
