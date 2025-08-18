
import { DataSource } from 'typeorm';
import { DatabaseError, ConfigurationError } from '../../../shared/errors';

import { Logger } from '../../../shared/utils';

import { config } from '../../config';
import { User } from '../../../domain/entities/User';
import { WatchedItem } from '../../../domain/entities/WatchedItem';


export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private dataSource: DataSource | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }


  public async initialize(): Promise<void> {

    if (this.isInitialized && this.dataSource) {
      Logger.debug('Database already initialized');

      return;

    }


    try {
      Logger.info('Initializing database connection...', {
        path: config.getDatabasePath()
      });


      const dataSource = new DataSource({
        type: 'sqlite',
        database: config.getDatabasePath(),
        entities: [User, WatchedItem],
        synchronize: true,
        logging: false,
        migrations: [],
      });

      await dataSource.initialize();
      this.dataSource = dataSource;


      this.isInitialized = true;
      Logger.info('Database initialized successfully');

    } catch (error) {
      Logger.error('Failed to initialize database', { error });
      throw new DatabaseError(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  // Removed createTables method as TypeORM handles table creation automatically


  private async createIndexes(): Promise<void> {
    Logger.debug('Creating database indexes...');
    Logger.debug('Database indexes creation is now handled by TypeORM migrations or schema synchronization.');
  }

  private async createTriggers(): Promise<void> {
    Logger.debug('Creating database triggers...');
    Logger.debug('Database triggers creation is now handled by TypeORM migrations or schema synchronization.');
  }


  public async getDataSource(): Promise<DataSource> {
    if (!this.isInitialized || !this.dataSource) {
      await this.initialize();

    }



    if (!this.dataSource) {
      throw new DatabaseError('Database connection not available');

    }



    return this.dataSource;
  }



  public async close(): Promise<void> {

    if (this.dataSource) {
      Logger.info('Closing database connection...');

      await this.dataSource.destroy();
      this.dataSource = null;
      this.isInitialized = false;

      Logger.info('Database connection closed');

    }

  }


  public async healthCheck(): Promise<{ connected: boolean; latency?: number }> {
    try {
      if (!this.dataSource) {
        return { connected: false };
      }

      const startTime = Date.now();
      const entityManager = this.dataSource.manager;
      await entityManager.query('SELECT 1');
      const latency = Date.now() - startTime;

      return { connected: true, latency };

    } catch (error) {
      Logger.error('Database health check failed', { error });
      return { connected: false };
    }
  }

  public async runMigrations(): Promise<void> {
    Logger.info('Running database migrations...');

    try {
      const entityManager = this.dataSource?.manager;
      await entityManager?.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          migration_name TEXT UNIQUE NOT NULL,
          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      Logger.info('Database migrations completed');

    } catch (error) {
      Logger.error('Database migrations failed', { error });
      throw new DatabaseError(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async runMigration(name: string, migrationFn: () => Promise<void>): Promise<void> {
    Logger.info(`Running migration: ${name}`);
    try {
      await migrationFn();
      Logger.info(`Migration ${name} completed successfully`);
    } catch (error) {
      Logger.error(`Migration ${name} failed`, { error });
      throw error;
    }
  }

  public async clearAllData(): Promise<void> {
    if (!config.isTest()) {
      throw new ConfigurationError('clearAllData can only be called in test environment');
    }

    if (!this.dataSource) {
      throw new DatabaseError('Database connection not available');
    }

    Logger.warn('Clearing all database data (TEST MODE)');

    try {
      const entities = this.dataSource.entityMetadatas;
      for (const entity of entities) {
        const entityManager = this.dataSource.manager;
        await entityManager.clear(entity.name);
      }

      Logger.info('All database data cleared');
    } catch (error) {
      Logger.error('Failed to clear database data', { error });
      throw new DatabaseError(`Data clearing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const databaseConnection = DatabaseConnection.getInstance();
