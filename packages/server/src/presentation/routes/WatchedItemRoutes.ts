import { Router } from 'express';
import { WatchedItemController } from '../controllers/WatchedItemController';
import { WatchedItemService } from '../../application/services/WatchedItemService';
import { SQLiteWatchedItemRepository } from '../../infrastructure/adapters/database/SQLiteWatchedItemRepository';
import { authenticateToken } from '../middleware/authMiddleware';

export const createWatchedItemRoutes = (): Router => {
    const router = Router();
    const watchedItemRepository = new SQLiteWatchedItemRepository();
    const watchedItemService = new WatchedItemService(watchedItemRepository);
    const controller = new WatchedItemController(watchedItemService);

    router.post('/', authenticateToken, controller.addWatchedItem.bind(controller));
    router.put('/:id', authenticateToken, controller.updateWatchedItem.bind(controller));
    router.delete('/:id', authenticateToken, controller.deleteWatchedItem.bind(controller));
    router.get('/:userId', authenticateToken, controller.getWatchedItems.bind(controller));

    return router;
};
