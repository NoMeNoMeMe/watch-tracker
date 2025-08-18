import type { StringValue } from "ms";
import jwt from 'jsonwebtoken';
import { User } from '../../../domain/entities/User';
import { AuthenticationService } from '../../../domain/services/AuthenticationService';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { AuthToken } from '../../../shared/types';
import {
  AuthenticationError,
  InvalidTokenError,
} from '../../../shared/errors';
import { Logger, SecurityUtils } from '../../../shared/utils';
import { config } from '../../config';

export class JwtAuthenticationService implements AuthenticationService {
  private readonly jwtSecret: string;
  private readonly jwtExpirationTime: StringValue | number;
  private readonly refreshTokenExpirationTime: StringValue | number;
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';
    this.jwtExpirationTime = config.getJwtExpirationTime();
    this.refreshTokenExpirationTime = config.getRefreshTokenExpirationTime();
  }

  public async generateAccessToken(user: User): Promise<string> {
      try {
        const payload = {
          userId: user.id,
          username: user.username,
          type: 'access'
        };

        const signOptions: jwt.SignOptions = {
          expiresIn: this.jwtExpirationTime,
          issuer: 'watch-tracker-api',
          audience: 'watch-tracker-client',
          algorithm: 'HS256'
        };

        const token = jwt.sign(payload, this.jwtSecret, signOptions);

        Logger.debug('Access token generated', {
          userId: user.id,
          username: user.username,
          expiresIn: this.jwtExpirationTime
        });

        return token;
      } catch (error) {
        Logger.error('Failed to generate access token', {
          userId: user.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw new AuthenticationError('Failed to generate access token');
      }
    }

  public async verifyAccessToken(token: string): Promise<AuthToken> {
    try {
      if (!token || typeof token !== 'string') {
        throw new InvalidTokenError();
      }

      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'watch-tracker-api',
        audience: 'watch-tracker-client'
      }) as any;

      if (!decoded || typeof decoded !== 'object' || !decoded.userId || !decoded.username) {
        throw new InvalidTokenError();
      }

      if (decoded.type !== 'access') {
        throw new InvalidTokenError();
      }

      // Verify user still exists
      const userExists = await this.userRepository.findById(decoded.userId);
      if (!userExists) {
        Logger.warn('Token verification failed: user no longer exists', {
          userId: decoded.userId
        });
        throw new InvalidTokenError();
      }

      Logger.debug('Access token verified successfully', {
        userId: decoded.userId,
        username: decoded.username
      });

      return {
        userId: decoded.userId,
        username: decoded.username,
        exp: decoded.exp,
        iat: decoded.iat
      };

    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw error;
      }

      if (error instanceof jwt.TokenExpiredError) {
        Logger.debug('Token expired', { token: token.substring(0, 20) + '...' });
        throw new InvalidTokenError();
      }

      if (error instanceof jwt.JsonWebTokenError) {
        Logger.warn('Invalid JWT token', {
          error: error.message,
          token: token.substring(0, 20) + '...'
        });
        throw new InvalidTokenError();
      }

      Logger.error('Token verification failed', { error });
      throw new AuthenticationError('Token verification failed');
    }
  }

  public async generateRefreshToken(user: User): Promise<string> {
      try {
        const payload = {
          userId: user.id,
          username: user.username,
          type: 'refresh',
          tokenId: SecurityUtils.generateRandomString(32)
        };

        const token = jwt.sign(payload, this.jwtSecret, {
          expiresIn: this.refreshTokenExpirationTime,
          issuer: 'watch-tracker-api',
          audience: 'watch-tracker-client',
          algorithm: 'HS256'
        } as jwt.SignOptions);

        Logger.debug('Refresh token generated', {
          userId: user.id,
          username: user.username,
          expiresIn: this.refreshTokenExpirationTime
        });

        return token;

      } catch (error) {
        Logger.error('Failed to generate refresh token', {
          userId: user.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw new AuthenticationError('Failed to generate refresh token');
      }
    }

  public async verifyRefreshToken(token: string): Promise<User> {
    try {
      if (!token || typeof token !== 'string') {
        throw new InvalidTokenError();
      }

      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'watch-tracker-api',
        audience: 'watch-tracker-client'
      }) as any;

      if (!decoded || typeof decoded !== 'object' || !decoded.userId || !decoded.username) {
        throw new InvalidTokenError();
      }

      if (decoded.type !== 'refresh') {
        throw new InvalidTokenError();
      }

      // Check if refresh token is revoked
      const isRevoked = await this.isRefreshTokenRevoked(token);
      if (isRevoked) {
        Logger.warn('Refresh token is revoked', { userId: decoded.userId });
        throw new InvalidTokenError();
      }

      // Get the user to ensure they still exist
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        Logger.warn('Refresh token verification failed: user no longer exists', {
          userId: decoded.userId
        });
        throw new InvalidTokenError();
      }

      Logger.debug('Refresh token verified successfully', {
        userId: decoded.userId,
        username: decoded.username
      });

      return user;

    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw error;
      }

      if (error instanceof jwt.TokenExpiredError) {
        Logger.debug('Refresh token expired', { token: token.substring(0, 20) + '...' });
        throw new InvalidTokenError();
      }

      if (error instanceof jwt.JsonWebTokenError) {
        Logger.warn('Invalid refresh token', {
          error: error.message,
          token: token.substring(0, 20) + '...'
        });
        throw new InvalidTokenError();
      }

      Logger.error('Refresh token verification failed', { error });
      throw new AuthenticationError('Refresh token verification failed');
    }
  }

  public async revokeRefreshToken(token: string): Promise<void> {
    try {
      // In a production system, you would store revoked tokens in a database
      // For simplicity, we'll implement a basic in-memory revocation list
      // In a real implementation, you should use Redis or database storage

      Logger.info('Refresh token revoked', {
        token: token.substring(0, 20) + '...'
      });

      // TODO: Implement proper token revocation storage
      // This could be done by storing revoked tokens in the database
      // or using a Redis blacklist with TTL

    } catch (error) {
      Logger.error('Failed to revoke refresh token', { error });
      throw new AuthenticationError('Failed to revoke refresh token');
    }
  }

  public async isRefreshTokenRevoked(token: string): Promise<boolean> {
    try {
      // TODO: Implement proper token revocation check
      // This should check against a database table or Redis set
      // For now, we'll return false (not revoked)
      return false;

    } catch (error) {
      Logger.error('Failed to check token revocation status', { error });
      // In case of error, assume token is not revoked but log the issue
      return false;
    }
  }

  public async validateCredentials(username: string, password: string): Promise<User | null> {
    try {
      if (!username || !password) {
        Logger.debug('Invalid credentials: username or password missing');
        return null;
      }

      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        Logger.debug('User not found during credential validation', { username });
        return null;
      }

      const passwordObj = user.password;
      const isValidPassword = await passwordObj.verify(password);

      if (!isValidPassword) {
        Logger.debug('Invalid password during credential validation', {
          username,
          userId: user.id
        });
        return null;
      }

      Logger.info('Credentials validated successfully', {
        username,
        userId: user.id
      });

      return user;

    } catch (error) {
      Logger.error('Failed to validate credentials', { username, error });
      throw new AuthenticationError('Failed to validate credentials');
    }
  }

  public async generatePasswordResetToken(user: User): Promise<string> {
    try {
      const payload = {
        userId: user.id,
        username: user.username,
        type: 'password_reset',
        tokenId: SecurityUtils.generateRandomString(32)
      };

      const token = jwt.sign(payload, this.jwtSecret, {
        expiresIn: '1h', // Password reset tokens expire quickly
        issuer: 'watch-tracker-api',
        audience: 'watch-tracker-client'
      });

      Logger.info('Password reset token generated', {
        userId: user.id,
        username: user.username
      });

      return token;

    } catch (error) {
      Logger.error('Failed to generate password reset token', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new AuthenticationError('Failed to generate password reset token');
    }
  }

  public async verifyPasswordResetToken(token: string): Promise<User> {
    try {
      if (!token || typeof token !== 'string') {
        throw new InvalidTokenError();
      }

      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'watch-tracker-api',
        audience: 'watch-tracker-client'
      }) as any;

      if (!decoded || typeof decoded !== 'object' || !decoded.userId || !decoded.username) {
        throw new InvalidTokenError();
      }

      if (decoded.type !== 'password_reset') {
        throw new InvalidTokenError();
      }

      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        Logger.warn('Password reset token verification failed: user no longer exists', {
          userId: decoded.userId
        });
        throw new InvalidTokenError();
      }

      Logger.info('Password reset token verified successfully', {
        userId: decoded.userId,
        username: decoded.username
      });

      return user;

    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw error;
      }

      if (error instanceof jwt.TokenExpiredError) {
        Logger.debug('Password reset token expired');
        throw new InvalidTokenError();
      }

      if (error instanceof jwt.JsonWebTokenError) {
        Logger.warn('Invalid password reset token', { error: error.message });
        throw new InvalidTokenError();
      }

      Logger.error('Password reset token verification failed', { error });
      throw new AuthenticationError('Password reset token verification failed');
    }
  }

  public async invalidateAllUserTokens(userId: number): Promise<void> {
    try {
      // TODO: Implement proper token invalidation
      // This should mark all tokens for a user as revoked in the database

      Logger.info('All user tokens invalidated', { userId });

    } catch (error) {
      Logger.error('Failed to invalidate all user tokens', { userId, error });
      throw new AuthenticationError('Failed to invalidate user tokens');
    }
  }

  public getTokenExpirationTime(): number {
      if (typeof this.jwtExpirationTime === 'number') {
        return this.jwtExpirationTime;
      }
      // Convert JWT expiration time to seconds
      const match = this.jwtExpirationTime.match(/^(\d+)([smhd])$/);
      if (!match) return 3600; // Default to 1 hour

      const value = parseInt(match[1], 10);
      const unit = match[2];

      switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 3600;
        case 'd': return value * 86400;
        default: return 3600;
      }
  }

  public getRefreshTokenExpirationTime(): number {
    if (typeof this.refreshTokenExpirationTime === 'number') {
      return this.refreshTokenExpirationTime;
    }
    // Convert refresh token expiration time to seconds
    const match = this.refreshTokenExpirationTime.match(/^(\d+)([smhd])$/);
    if (!match) return 604800; // Default to 7 days

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 604800;
    }
  }

  public extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  public async createUserSession(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: number;
      username: string;
    };
  }> {
    try {
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);
      const expiresIn = this.getTokenExpirationTime();

      Logger.info('User session created', {
        userId: user.id,
        username: user.username
      });

      return {
        accessToken,
        refreshToken,
        expiresIn,
        user: {
          id: user.id,
          username: user.username
        }
      };

    } catch (error) {
      Logger.error('Failed to create user session', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new AuthenticationError('Failed to create user session');
    }
  }
}
