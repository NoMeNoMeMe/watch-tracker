
import { User } from "../../../domain/entities/User";

import { UserRepository } from "../../../domain/repositories/UserRepository";

import { Repository } from "typeorm";
import { AppDataSource } from "../../../database";

import { Password } from "../../../domain/value-objects/Password";



export class SqliteUserRepository implements UserRepository {

    private readonly repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async save(user: User): Promise<void> {
        await this.repository.save(user);
        return;
    }

    async findByUsername(username: string): Promise<User | null> {
      const user = await this.repository.findOne({ where: { username } });
        if (!user) return null;
      return user;
    }

    async findById(id: number): Promise<User | null> {
      const user = await this.repository.findOne({ where: { id } });
        if (!user) return null;
      return user;
    }

    async create(user: User): Promise<User> {
      const newUser = new User(user.username, user.password);
      await this.repository.save(newUser);
      return newUser;
    }
}
