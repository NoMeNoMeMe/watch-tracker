// Base error class
export abstract class AppError extends Error {
  public readonly isOperational: boolean = true;
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Domain errors (400-499)
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization failed') {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = 'Unprocessable entity') {
    super(message, 422);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

// Infrastructure errors (500-599)
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database error') {
    super(message, 500);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service error', statusCode: number = 502) {
    super(message, statusCode);
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string = 'Configuration error') {
    super(message, 500);
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

// Domain-specific errors
export class UserAlreadyExistsError extends ConflictError {
  constructor(username: string) {
    super(`User with username '${username}' already exists`);
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('Invalid username or password');
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(identifier: string | number) {
    super(`User with identifier '${identifier}' not found`);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class WatchedItemNotFoundError extends NotFoundError {
  constructor(id: number) {
    super(`Watched item with id '${id}' not found`);
    Object.setPrototypeOf(this, WatchedItemNotFoundError.prototype);
  }
}

export class UnauthorizedWatchedItemAccessError extends AuthorizationError {
  constructor() {
    super('You are not authorized to access this watched item');
    Object.setPrototypeOf(this, UnauthorizedWatchedItemAccessError.prototype);
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor() {
    super('Invalid or expired token');
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export class MissingTokenError extends AuthenticationError {
  constructor() {
    super('Authentication token is required');
    Object.setPrototypeOf(this, MissingTokenError.prototype);
  }
}

// Error handler utilities
export class ErrorHandler {
  public static handle(error: Error): { statusCode: number; message: string; stack?: string } {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }

    // Handle SQLite constraint errors
    if (error.message.includes('UNIQUE constraint failed')) {
      if (error.message.includes('username')) {
        return {
          statusCode: 409,
          message: 'Username already exists'
        };
      }
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return {
        statusCode: 401,
        message: 'Invalid token'
      };
    }

    if (error.name === 'TokenExpiredError') {
      return {
        statusCode: 401,
        message: 'Token has expired'
      };
    }

    // Default to internal server error
    return {
      statusCode: 500,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  public static isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}
