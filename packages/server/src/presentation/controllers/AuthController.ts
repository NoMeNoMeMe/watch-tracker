import { Request, Response } from 'express';
import { RegisterUserCommand } from '../../application/commands/RegisterUserCommand';
import { LoginUserCommand } from '../../application/commands/LoginUserCommand';
import { RefreshTokenCommand } from '../../application/commands/RefreshTokenCommand';
import { LogoutUserCommand } from '../../application/commands/LogoutUserCommand';
import { UserService } from '../../application/services/UserService';

export class AuthController {
    constructor(private readonly userService: UserService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const command = new RegisterUserCommand(username, password);
            const user = await this.userService.registerUser(command);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(409).send(error.message);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const command = new LoginUserCommand(username, password);
            const result = await this.userService.loginUser(command);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).send(error.message);
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body;
            const command = new RefreshTokenCommand(token);
            const result = await this.userService.refreshToken(command);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).send(error.message);
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body;
            const command = new LogoutUserCommand(token);
            await this.userService.logoutUser(command);
            res.status(200).json({ message: 'Logout successful' });
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }
}