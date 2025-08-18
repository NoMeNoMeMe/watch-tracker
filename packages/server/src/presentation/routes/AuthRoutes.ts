import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../../application/services/UserService';
import { SqliteUserRepository } from '../../infrastructure/adapters/database/SqliteUserRepository';
import { JwtAuthenticationService } from '../../infrastructure/adapters/auth/JwtAuthenticationService';

export const createAuthRoutes = (): Router => {
    const router = Router();
    const userRepository = new SqliteUserRepository();
    const authService = new JwtAuthenticationService(userRepository);
    const userService = new UserService(userRepository, authService);
    const controller = new AuthController(userService);

    router.post('/register', controller.register.bind(controller));
    router.post('/login', controller.login.bind(controller));
    router.post('/refresh-token', controller.refreshToken.bind(controller));
    router.post('/logout', controller.logout.bind(controller));

    return router;
};
