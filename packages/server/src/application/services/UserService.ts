import { RegisterUserCommand } from "../commands/RegisterUserCommand";
import { LoginUserCommand } from "../commands/LoginUserCommand";
import { RefreshTokenCommand } from "../commands/RefreshTokenCommand";
import { LogoutUserCommand } from "../commands/LogoutUserCommand";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { AuthenticationService } from "../../domain/services/AuthenticationService";
import { Password } from "../../domain/value-objects/Password";

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthenticationService
    ) {}

    async registerUser(command: RegisterUserCommand): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findByUsername(command.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await Password.fromPlainText(command.password);
        const newUser = new User(command.username, hashedPassword);

        await this.userRepository.save(newUser);

        return this.toUserDto(newUser);
    }

    async loginUser(command: LoginUserCommand): Promise<{ user: Omit<User, 'password'>, token: string }> {
        const user = await this.userRepository.findByUsername(command.username);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await Password.compare(command.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = await this.authService.generateAccessToken(user);
        return { user: this.toUserDto(user), token };
    }

    async refreshToken(command: RefreshTokenCommand): Promise<{ token: string }> {
      const payload = await this.authService.verifyRefreshToken(command.token);
      if (!payload) {
          throw new Error("Invalid refresh token");
      }
      // Generate a new access token using the payload data
      const newToken = await this.authService.generateRefreshToken(payload);
      return { token: newToken };
    }

    async logoutUser(command: LogoutUserCommand): Promise<void> {
        // In a real-world scenario, you might want to blacklist the token
    }

    toUserDto(user: User): Omit<User, 'password'> {
        return {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

}
