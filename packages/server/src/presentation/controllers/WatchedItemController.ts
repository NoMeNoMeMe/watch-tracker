import { Request, Response } from 'express';
import { AddWatchedItemCommand } from '../../application/commands/AddWatchedItemCommand';
import { UpdateWatchedItemCommand } from '../../application/commands/UpdateWatchedItemCommand';
import { DeleteWatchedItemCommand } from '../../application/commands/DeleteWatchedItemCommand';
import { GetWatchedItemsQuery } from '../../application/queries/GetWatchedItemsQuery';
import { WatchedItemService } from '../../application/services/WatchedItemService';

export class WatchedItemController {
    constructor(private readonly watchedItemService: WatchedItemService) {}

    async addWatchedItem(req: Request, res: Response): Promise<void> {
        try {
            const command = new AddWatchedItemCommand(
                req.body.userId,
                req.body.mediaType,
                req.body.mediaId,
                req.body.title,
                req.body.posterPath,
                req.body.releaseDate,
                req.body.status,
                req.body.currentEpisode
            );
            const newItem = await this.watchedItemService.addWatchedItem(command);
            res.status(201).json(newItem);
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }

    async updateWatchedItem(req: Request, res: Response): Promise<void> {
        try {
            const command = new UpdateWatchedItemCommand(
                parseInt(req.params.id),
                req.body.userId,
                req.body.mediaType,
                req.body.mediaId,
                req.body.title,
                req.body.posterPath,
                req.body.releaseDate,
                req.body.status,
                req.body.currentEpisode
            );
            await this.watchedItemService.updateWatchedItem(command);
            res.status(200).json({ message: 'Item updated successfully' });
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }

    async deleteWatchedItem(req: Request, res: Response): Promise<void> {
        try {
            const command = new DeleteWatchedItemCommand(parseInt(req.params.id), (req as any).user.userId);
            await this.watchedItemService.deleteWatchedItem(command);
            res.status(200).json({ message: 'Item deleted successfully' });
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }

    async getWatchedItems(req: Request, res: Response): Promise<void> {
        try {
            const query = new GetWatchedItemsQuery(parseInt(req.params.userId));
            const items = await this.watchedItemService.getWatchedItems(query);
            res.status(200).json(items);
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }
}