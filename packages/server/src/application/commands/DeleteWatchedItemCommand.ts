export class DeleteWatchedItemCommand {
    constructor(
        public readonly id: number,
        public readonly userId: number
    ) {}
}
