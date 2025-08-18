import axios from 'axios';
import { ExternalMediaService } from '../../../domain/services/ExternalMediaService';

export class OmdbExternalMediaService implements ExternalMediaService {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.OMDB_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('OMDB API key is not configured');
        }
    }

    async search(query: string, type: string): Promise<any> {
        const response = await axios.get(`http://www.omdbapi.com/`, {
            params: {
                apikey: this.apiKey,
                s: query,
                type: type,
            },
        });
        return response.data;
    }

    async getDetails(id: string): Promise<any> {
        const response = await axios.get(`http://www.omdbapi.com/`, {
            params: {
                apikey: this.apiKey,
                i: id,
                plot: 'full',
            },
        });
        return response.data;
    }
}
