export type ViewType = 'search' | 'watched';

export type MediaType = 'movie' | 'tv' | 'book';

export interface OmdbResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  imdbRating?: string;
  totalSeasons?: string;
}

export interface BookResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    pageCount?: number;
    publisher?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export interface WatchedItem {
  id: number;
  userId: number;
  externalId: string;
  title: string;
  year: string;
  type: MediaType;
  poster: string;
  status: 'not_started' | 'pending' | 'completed' | 'on_hold' | 'dropped' | 'planning';
  currentEpisode: number;
  totalEpisodes?: number;
  createdAt: string;
  updatedAt: string;
  mediaId?: number;
  releaseDate?: string;
  mediaType?: MediaType;
  posterPath?: string;
  genre?: string;
  director?: string;
  actors?: string;
  runtime?: string;
  imdbRating?: string;
  plot?: string;
  authors?: string;
  publisher?: string;
  pageCount?: number;
  isbn?: string;
}

export interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface SearchState {
  searchResults: (OmdbResult | BookResult)[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  query: string;
}

export interface WatchedItemsState {
  watchedItems: WatchedItem[];
  loading: boolean;
  error: string | null;
}
