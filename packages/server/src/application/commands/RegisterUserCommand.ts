import { Command, CommandHandler } from '../../shared/types';
import { User } from '../../domain/entities/User';
import { Password } from '../../domain/value-objects/Password';
import { UserRepository } from '../../domain/repositories/UserRepository';
import {
  ValidationError,
  UserAlreadyExistsError,
  DatabaseError
} from '../../shared/errors';
import { Logger, Validator } from '../../shared/utils';

export interface RegisterUserCommandData {
  username: string;
  password: string;
}

export class RegisterUserCommand implements Command {
  public readonly type = 'REGISTER_USER';

  constructor(
    public readonly username: string,
    public readonly password: string
  ) {}

  public static create(data: RegisterUserCommandData): RegisterUserCommand {
    if (!data.username || !data.password) {
      throw new ValidationError('Username and password are required');
    }

    return new RegisterUserCommand(
      data.username.trim(),
      data.password
    );
  }
}

export interface RegisterUserCommandResult {
  user: {
    id: number;
    username: string;
    createdAt?: Date;
  };
}

export class RegisterUserCommandHandler implements CommandHandler<RegisterUserCommand, RegisterUserCommandResult> {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  public async handle(command: RegisterUserCommand): Promise<RegisterUserCommandResult> {
    Logger.info('Processing user registration', {
      username: command.username,
      commandType: command.type
    });

    try {
      // Validate input data
      await this.validateCommand(command);

      // Check if user already exists
      await this.ensureUserDoesNotExist(command.username);

      // Create password hash
      const passwordObj = await Password.fromPlainText(command.password);

      // Create user entity
      const userData = User.createNew(command.username, passwordObj);

      // Save user to repository
      const createdUser = await this.userRepository.create(userData);

      Logger.info('User registered successfully', {
        userId: createdUser.id,
        username: createdUser.username
      });

      return {
        user: {
          id: createdUser.id,
          username: createdUser.username,
          createdAt: createdUser.createdAt
        }
      };

    } catch (error) {
      Logger.error('User registration failed', {
        username: command.username,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Re-throw known errors
      if (error instanceof ValidationError ||
          error instanceof UserAlreadyExistsError ||
          error instanceof DatabaseError) {
        throw error;
      }

      // Wrap unknown errors
      throw new DatabaseError('User registration failed due to unexpected error');
    }
  }

  private async validateCommand(command: RegisterUserCommand): Promise<void> {
    const errors: string[] = [];

    // Validate username
    if (!command.username) {
      errors.push('Username is required');
    } else if (!Validator.isValidUsername(command.username)) {
      errors.push('Username must be 3-30 characters long and contain only letters, numbers, and underscores');
    }

    // Validate password
    if (!command.password) {
      errors.push('Password is required');
    } else {
      const passwordValidation = Validator.isStrongPassword(command.password);
      if (!passwordValidation) {
        errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(`Registration validation failed: ${errors.join(', ')}`);
    }
  }

  private async ensureUserDoesNotExist(username: string): Promise<void> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new UserAlreadyExistsError(username);
    }
  }
}
