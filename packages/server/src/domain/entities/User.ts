import { Password } from "../value-objects/Password";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public username: string;

    @Column({
      type: 'text',
      transformer: {
          to: (password: Password) => password.getHash(),
          from: (value: string) => Password.fromHash(value),
      },
    })
    public password: Password;

    @CreateDateColumn()
    public createdAt: Date = new Date();

    @UpdateDateColumn()
    public updatedAt: Date = new Date();

    constructor(
        username: string,
        password: Password,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
      this.username = username;
      this.password = password;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }

    public static createNew(username: string, password: Password): Omit<User, 'id'> {
        return {
            username: username,
            password: password,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
}
