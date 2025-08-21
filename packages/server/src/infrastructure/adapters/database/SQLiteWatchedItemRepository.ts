import { DataSource } from "typeorm";
import { WatchedItem } from "../../../domain/entities/WatchedItem";
import { WatchedItemRepository } from "../../../domain/repositories/WatchedItemRepository";
import { databaseConnection } from "./DatabaseConnection";

export class SQLiteWatchedItemRepository implements WatchedItemRepository {
    private dataSource!: DataSource;

    constructor() {
        databaseConnection.getDataSource().then((dataSource) => {
            this.dataSource = dataSource;
        }).catch((error) => {
            throw new Error(`Failed to initialize data source: ${error.message}`);
        });
    }

    async save(item: WatchedItem): Promise<void> {
        await this.dataSource.getRepository(WatchedItem).save(item);
    }

    async findById(id: number): Promise<WatchedItem | null> {
        const item = await this.dataSource.getRepository(WatchedItem).findOne({ where: { id } });
        return item;
    }

    async findByUserIdAndMediaId(userId: number, mediaId: string): Promise<WatchedItem | null> {
        const item = await this.dataSource.getRepository(WatchedItem).findOne({ where: { userId, mediaId } });
        return item;
    }

    async findByUserId(userId: number): Promise<WatchedItem[]> {
        const items = await this.dataSource.getRepository(WatchedItem).find({ where: { userId } });
        return items;
    }

    async delete(id: number, userId: number): Promise<void> {
        await this.dataSource.getRepository(WatchedItem).delete({ id, userId });
    }
}
