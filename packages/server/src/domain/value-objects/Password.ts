import bcrypt from 'bcrypt';
import { ValidationError } from '../../shared/errors';
import { SecurityUtils } from '../../shared/utils';

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedPassword: string) {
    this.hashedValue = hashedPassword;
  }

  /**
   * Creates a Password instance from a plain text password
   */
  public static async fromPlainText(plainPassword: string): Promise<Password> {
    this.validatePlainPassword(plainPassword);

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    return new Password(hashedPassword);
  }

  /**
   * Creates a Password instance from an already hashed password
   */
  public static fromHash(hashedPassword: string): Password {
    if (!hashedPassword || typeof hashedPassword !== 'string') {
      throw new ValidationError('Hashed password must be a non-empty string');
    }

    return new Password(hashedPassword);
  }

  /**
   * Validates a plain text password against security requirements
   */
  private static validatePlainPassword(password: string): void {
    if (!password || typeof password !== 'string') {
      throw new ValidationError('Password is required');
    }

    if (password.trim().length === 0) {
      throw new ValidationError('Password cannot be empty');
    }

    const validation = SecurityUtils.isSecurePassword(password);
    if (!validation.valid) {
      throw new ValidationError(`Password validation failed: ${validation.errors.join(', ')}`);
    }
  }

  /**
   * Verifies if a plain text password matches this hashed password
   */
  public async verify(plainPassword: string): Promise<boolean> {
    if (!plainPassword || typeof plainPassword !== 'string') {
      return false;
    }

    try {
      return await bcrypt.compare(plainPassword, this.hashedValue);
    } catch (error) {
      return false;
    }
  }

  /**
   * Compares a plain text password to a Password instance
   */
  public static async compare(plainPassword: string, hashedPassword: Password): Promise<boolean> {
    return hashedPassword.verify(plainPassword);
  }

  /**
   * Returns the hashed password value
   */
  public getHash(): string {
    return this.hashedValue;
  }

  /**
   * Checks if this password needs to be rehashed (e.g., if salt rounds have changed)
   */
  public async needsRehash(): Promise<boolean> {
    const currentSaltRounds = 12;
    try {
      // Extract the salt rounds from the hash
      const rounds = parseInt(this.hashedValue.split('$')[2]);
      return rounds < currentSaltRounds;
    } catch (error) {
      // If we can't parse the hash, assume it needs rehashing
      return true;
    }
  }

  /**
   * Creates a new Password instance with updated hashing
   */
  public static async rehash(password: Password, plainPassword: string): Promise<Password> {
    const isValid = await password.verify(plainPassword);
    if (!isValid) {
      throw new ValidationError('Cannot rehash: plain password does not match current hash');
    }

    return Password.fromPlainText(plainPassword);
  }

  public equals(other: Password): boolean {
    return this.hashedValue === other.hashedValue;
  }

  public toString(): string {
    // Never expose the actual hash in string representation
    return '[Password Hash]';
  }
}
