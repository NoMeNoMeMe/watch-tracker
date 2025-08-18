import { Request, Response } from 'express';
import { OmdbExternalMediaService } from '../../infrastructure/adapters/external-apis/OmdbExternalMediaService';
import { GoogleBooksExternalMediaService } from '../../infrastructure/adapters/external-apis/GoogleBooksExternalMediaService';

export class ExternalMediaController {
    private readonly omdbService: OmdbExternalMediaService;
    private readonly googleBooksService: GoogleBooksExternalMediaService;

    constructor() {
        this.omdbService = new OmdbExternalMediaService();
        this.googleBooksService = new GoogleBooksExternalMediaService();
    }

    async searchOmdb(req: Request, res: Response): Promise<void> {
        try {
            const { query, type } = req.query;
            const data = await this.omdbService.search(query as string, type as string);
            res.json(data);
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }

    async getOmdbDetails(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.query;
            const data = await this.omdbService.getDetails(id as string);
            res.json(data);
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }

    async searchGoogleBooks(req: Request, res: Response): Promise<void> {
        try {
            const { query, type } = req.query;
            const data = await this.googleBooksService.search(query as string, type as string || 'book');
            res.json(data);
        } catch (error: any) {
            res.status(500).send(error.message);
        }
    }
}
