import { WatchedItem } from '../entities/WatchedItem';

export interface WatchedItemRepository {
    save(item: WatchedItem): Promise<void>;
    findById(id: number): Promise<WatchedItem | null>;
    findByUserId(userId: number): Promise<WatchedItem[]>;
    findByUserIdAndMediaId(userId: number, mediaId: string): Promise<WatchedItem | null>;
    delete(id: number, userId: number): Promise<void>;
}
