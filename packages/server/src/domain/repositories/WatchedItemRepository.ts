import { WatchedItem } from '../entities/WatchedItem';

export interface WatchedItemRepository {
    save(item: WatchedItem): Promise<void>;
    findById(id: number): Promise<WatchedItem | null>;
    findByUserId(userId: number): Promise<WatchedItem[]>;
    delete(id: number, userId: number): Promise<void>;
}
