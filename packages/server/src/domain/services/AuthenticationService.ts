import { User } from '../entities/User';
import { AuthToken } from '../../shared/types';

export interface AuthenticationService {
  /**
   * Generates a JWT access token for a user
   */
  generateAccessToken(user: User): Promise<string>;

  /**
   * Verifies and decodes a JWT access token
   */
  verifyAccessToken(token: string): Promise<AuthToken>;

  /**
   * Generates a refresh token for a user
   */
  generateRefreshToken(user: User): Promise<string>;

  /**
   * Verifies a refresh token and returns the associated user
   */
  verifyRefreshToken(token: string): Promise<User>;

  /**
   * Revokes a refresh token
   */
  revokeRefreshToken(token: string): Promise<void>;

  /**
   * Checks if a refresh token is revoked
   */
  isRefreshTokenRevoked(token: string): Promise<boolean>;

  /**
   * Validates user credentials and returns the user if valid
   */
  validateCredentials(username: string, password: string): Promise<User | null>;

  /**
   * Generates a password reset token
   */
  generatePasswordResetToken(user: User): Promise<string>;

  /**
   * Verifies a password reset token
   */
  verifyPasswordResetToken(token: string): Promise<User>;

  /**
   * Invalidates all tokens for a user (useful for logout all devices)
   */
  invalidateAllUserTokens(userId: number): Promise<void>;

  /**
   * Gets token expiration time in seconds
   */
  getTokenExpirationTime(): number;

  /**
   * Gets refresh token expiration time in seconds
   */
  getRefreshTokenExpirationTime(): number;

  /**
   * Extracts token from authorization header
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null;

  /**
   * Creates session data for authenticated user
   */
  createUserSession(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: number;
      username: string;
    };
  }>;
}
