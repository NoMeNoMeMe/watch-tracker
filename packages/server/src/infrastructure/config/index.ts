import dotenv from 'dotenv';
import type { StringValue } from "ms";
import { AppConfig, ServerConfig, DatabaseConfig, ExternalApiConfig } from '../../shared/types';
import { EnvUtils } from '../../shared/utils';
import { ConfigurationError } from '../../shared/errors';

// Load environment variables
dotenv.config();

class Configuration {
  private static instance: Configuration;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }

  private loadConfiguration(): AppConfig {
    return {
      server: this.loadServerConfig(),
      database: this.loadDatabaseConfig(),
      externalApis: this.loadExternalApiConfig()
    };
  }

  private loadServerConfig(): ServerConfig {
    const port = EnvUtils.getIntEnv('PORT', 3001);
    const jwtSecret = EnvUtils.getOptionalEnv('JWT_SECRET', 'supersecretjwtkey');
    const nodeEnv = EnvUtils.getOptionalEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test';

    if (nodeEnv === 'production' && jwtSecret === 'supersecretjwtkey') {
      throw new ConfigurationError('JWT_SECRET must be set in production environment');
    }

    return {
      port,
      jwtSecret,
      nodeEnv
    };
  }

  private loadDatabaseConfig(): DatabaseConfig {
    const filename = EnvUtils.getOptionalEnv('DATABASE_PATH', './watch-tracker.db');

    return {
      filename
    };
  }

  private loadExternalApiConfig(): ExternalApiConfig {
    return {
      omdbApiKey: EnvUtils.getOptionalEnv('OMDB_API_KEY')
    };
  }

  private validateConfiguration(): void {
    const errors: string[] = [];

    // Validate server configuration
    if (this.config.server.port < 1 || this.config.server.port > 65535) {
      errors.push('PORT must be between 1 and 65535');
    }

    if (!this.config.server.jwtSecret || this.config.server.jwtSecret.length < 16) {
      errors.push('JWT_SECRET must be at least 16 characters long');
    }

    if (!['development', 'production', 'test'].includes(this.config.server.nodeEnv)) {
      errors.push('NODE_ENV must be one of: development, production, test');
    }

    // Validate database configuration
    if (!this.config.database.filename) {
      errors.push('Database filename cannot be empty');
    }

    // Production-specific validations
    if (this.config.server.nodeEnv === 'production') {
      if (!this.config.externalApis.omdbApiKey) {
        errors.push('OMDB_API_KEY is required in production environment');
      }

      // Ensure secure defaults in production
      if (this.config.server.jwtSecret.includes('secret') ||
          this.config.server.jwtSecret.includes('default') ||
          this.config.server.jwtSecret.length < 32) {
        errors.push('JWT_SECRET must be a strong, unique secret in production (at least 32 characters)');
      }
    }

    if (errors.length > 0) {
      throw new ConfigurationError(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }

  public get(): AppConfig {
    return { ...this.config };
  }

  public getServer(): ServerConfig {
    return { ...this.config.server };
  }

  public getDatabase(): DatabaseConfig {
    return { ...this.config.database };
  }

  public getExternalApis(): ExternalApiConfig {
    return { ...this.config.externalApis };
  }

  public isDevelopment(): boolean {
    return this.config.server.nodeEnv === 'development';
  }

  public isProduction(): boolean {
    return this.config.server.nodeEnv === 'production';
  }

  public isTest(): boolean {
    return this.config.server.nodeEnv === 'test';
  }

  public reload(): void {
    // Reload environment variables
    dotenv.config();
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  // Helper methods for common configuration access
  public getPort(): number {
    return this.config.server.port;
  }

  public getJwtSecret(): string {
    return this.config.server.jwtSecret;
  }

  public getDatabasePath(): string {
    return this.config.database.filename;
  }

  public getOmdbApiKey(): string | undefined {
    return this.config.externalApis.omdbApiKey;
  }

  // Logging configuration
  public getLogLevel(): 'debug' | 'info' | 'warn' | 'error' {
    const level = EnvUtils.getOptionalEnv('LOG_LEVEL', 'info').toLowerCase();

    if (['debug', 'info', 'warn', 'error'].includes(level)) {
      return level as 'debug' | 'info' | 'warn' | 'error';
    }

    return 'info';
  }

  // CORS configuration
  public getCorsOrigins(): string[] {
    const origins = EnvUtils.getOptionalEnv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000');
    return origins.split(',').map(origin => origin.trim());
  }

  // Security configuration
  public getBcryptSaltRounds(): number {
    return EnvUtils.getIntEnv('BCRYPT_SALT_ROUNDS', 12);
  }

  public getJwtExpirationTime(): StringValue | number {
    return EnvUtils.getOptionalEnv('JWT_EXPIRATION', '1H') as StringValue;
  }

  public getRefreshTokenExpirationTime(): StringValue | number {
    return EnvUtils.getOptionalEnv('REFRESH_TOKEN_EXPIRATION', '7D') as StringValue;
  }

  // Rate limiting configuration
  public getRateLimitWindowMs(): number {
    return EnvUtils.getIntEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000); // 15 minutes
  }

  public getRateLimitMaxRequests(): number {
    return EnvUtils.getIntEnv('RATE_LIMIT_MAX_REQUESTS', 100);
  }

  // Pagination configuration
  public getDefaultPageLimit(): number {
    return EnvUtils.getIntEnv('DEFAULT_PAGE_LIMIT', 10);
  }

  public getMaxPageLimit(): number {
    return EnvUtils.getIntEnv('MAX_PAGE_LIMIT', 100);
  }

  // External API configuration
  public getExternalApiTimeout(): number {
    return EnvUtils.getIntEnv('EXTERNAL_API_TIMEOUT', 10000); // 10 seconds
  }

  public getExternalApiRetries(): number {
    return EnvUtils.getIntEnv('EXTERNAL_API_RETRIES', 3);
  }

  // Database configuration
  public getDatabaseConnectionPoolSize(): number {
    return EnvUtils.getIntEnv('DB_POOL_SIZE', 10);
  }

  public getDatabaseQueryTimeout(): number {
    return EnvUtils.getIntEnv('DB_QUERY_TIMEOUT', 30000); // 30 seconds
  }
}

// Export singleton instance
export const config = Configuration.getInstance();

// Export the class for testing purposes
export { Configuration };

// Export type for dependency injection
export type IConfiguration = Configuration;
