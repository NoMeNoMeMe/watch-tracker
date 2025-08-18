export class UpdateWatchedItemCommand {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly mediaType: string,
        public readonly mediaId: string,
        public readonly title: string,
        public readonly posterPath: string,
        public readonly releaseDate: string,
        public readonly status: string,
        public readonly currentEpisode: number
    ) {}
}
