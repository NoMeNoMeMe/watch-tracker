import axios from 'axios';
import { ExternalMediaService } from '../../../domain/services/ExternalMediaService';

export class GoogleBooksExternalMediaService implements ExternalMediaService {
    async search(query: string, _type: string): Promise<any> {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
            params: {
                q: query
            },
        });
        return response.data;
    }
}
