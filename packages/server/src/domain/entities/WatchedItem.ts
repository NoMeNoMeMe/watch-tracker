import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class WatchedItem {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public userId: number;

    @Column()
    public mediaType: string;

    @Column()
    public mediaId: string;

    @Column()
    public title: string;

    @Column()
    public posterPath: string;

    @Column()
    public releaseDate: string;

    @Column()
    public status: string;

    @Column()
    public currentEpisode: number;

    constructor(
        userId: number,
        mediaType: string,
        mediaId: string,
        title: string,
        posterPath: string,
        releaseDate: string,
        status: string,
        currentEpisode: number
    ) {
        this.userId = userId;
        this.mediaType = mediaType;
        this.mediaId = mediaId;
        this.title = title;
        this.posterPath = posterPath;
        this.releaseDate = releaseDate;
        this.status = status;
        this.currentEpisode = currentEpisode;
    }
}
