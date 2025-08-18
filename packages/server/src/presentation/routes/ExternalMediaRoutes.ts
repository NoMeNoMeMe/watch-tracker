import { Router } from 'express';
import { ExternalMediaController } from '../controllers/ExternalMediaController';

export const createExternalMediaRoutes = (): Router => {
    const router = Router();
    const controller = new ExternalMediaController();

    router.get('/search/omdb', controller.searchOmdb.bind(controller));
    router.get('/search/omdb-details', controller.getOmdbDetails.bind(controller));
    router.get('/search/book', controller.searchGoogleBooks.bind(controller));

    return router;
};
