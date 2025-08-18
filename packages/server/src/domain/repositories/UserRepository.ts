import { User } from '../entities/User';

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  toUserDto?(user: User): Omit<User, 'password'>;
}
