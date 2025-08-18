import { DataSource } from 'typeorm';
import { User } from './domain/entities/User';
import { WatchedItem } from './domain/entities/WatchedItem';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './watch-tracker.db',
  enableWAL: true,
  entities: [User, WatchedItem],
  synchronize: true, // Automatically creates tables based on entities
  logging: true,
});

export async function initDb() {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}
