import { WatchedItem } from "../../domain/entities/WatchedItem";
import { WatchedItemRepository } from "../../domain/repositories/WatchedItemRepository";
import { AddWatchedItemCommand } from "../commands/AddWatchedItemCommand";
import { DeleteWatchedItemCommand } from "../commands/DeleteWatchedItemCommand";
import { UpdateWatchedItemCommand } from "../commands/UpdateWatchedItemCommand";
import { GetWatchedItemsQuery } from "../queries/GetWatchedItemsQuery";

export class WatchedItemService {
    constructor(private readonly watchedItemRepository: WatchedItemRepository) {}

    async addWatchedItem(command: AddWatchedItemCommand): Promise<WatchedItem> {
        // Check if an item with the same userId and mediaId already exists
        const existingItem = await this.watchedItemRepository.findByUserIdAndMediaId(command.userId, command.mediaId);
        if (existingItem) {
            throw new Error("This item was already added");
        }

        const newItem = new WatchedItem(
            command.userId,
            command.mediaType,
            command.mediaId,
            command.title,
            command.posterPath,
            command.releaseDate,
            command.status,
            command.currentEpisode
        );
        await this.watchedItemRepository.save(newItem);
        return newItem;
    }

    async updateWatchedItem(command: UpdateWatchedItemCommand): Promise<void> {
        const existingItem = await this.watchedItemRepository.findById(command.id);
        if (!existingItem) {
            throw new Error(`Item with ID ${command.id} not found`);
        }

        // Update the properties of the existing item
        existingItem.userId = command.userId;
        existingItem.mediaType = command.mediaType;
        existingItem.mediaId = command.mediaId;
        existingItem.title = command.title;
        existingItem.posterPath = command.posterPath;
        existingItem.releaseDate = command.releaseDate;
        existingItem.status = command.status;
        existingItem.currentEpisode = command.currentEpisode;

      // Save the updated item back to the repository
        await this.watchedItemRepository.save(existingItem);
    }

    async deleteWatchedItem(command: DeleteWatchedItemCommand): Promise<void> {
        await this.watchedItemRepository.delete(command.id, command.userId);
    }

    async getWatchedItems(query: GetWatchedItemsQuery): Promise<WatchedItem[]> {
        return this.watchedItemRepository.findByUserId(query.userId);
    }

    async getWatchedItemById(id: number): Promise<WatchedItem | null> {
        return this.watchedItemRepository.findById(id);
    }
}
