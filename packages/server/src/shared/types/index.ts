import type { StringValue } from "ms";

// Base types
export interface Entity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// User types
export interface User extends Entity {
  username: string;
  password: string;
}

export interface UserPublic {
  id: number;
  username: string;
}

// Media types
export enum MediaType {
  MOVIE = 'movie',
  SERIES = 'series',
  BOOK = 'book'
}

export enum WatchStatus {
  NOT_WATCHING = 'not_watching',
  WATCHING = 'watching',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  DROPPED = 'dropped',
  PLAN_TO_WATCH = 'plan_to_watch'
}

export interface WatchedItem extends Entity {
  userId: number;
  mediaType: MediaType;
  mediaId: string;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  status: WatchStatus;
  currentEpisode: number;
}

// External API types
export interface ExternalMediaItem {
  id: string;
  title: string;
  type: MediaType;
  year?: string;
  posterUrl?: string;
  plot?: string;
}

export interface OMDBSearchResult {
  Search?: OMDBMovie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface OMDBMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDBDetailsResult {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
  Error?: string;
}

export interface GoogleBooksResult {
  kind: string;
  totalItems: number;
  items?: GoogleBookItem[];
}

export interface GoogleBookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    readingModes: {
      text: boolean;
      image: boolean;
    };
    pageCount?: number;
    printType: string;
    categories?: string[];
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    panelizationSummary?: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: {
      isAvailable: boolean;
    };
    pdf: {
      isAvailable: boolean;
    };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
  searchInfo?: {
    textSnippet: string;
  };
}

// Authentication types
export interface AuthToken {
  userId: number;
  username: string;
  exp: StringValue | number;
  iat: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userId: number;
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Command and Query types
export interface Command {
  readonly type: string;
}

export interface Query {
  readonly type: string;
}

export interface CommandHandler<T extends Command, R = void> {
  handle(command: T): Promise<R>;
}

export interface QueryHandler<T extends Query, R> {
  handle(query: T): Promise<R>;
}

// Configuration types
export interface DatabaseConfig {
  filename: string;
}

export interface ServerConfig {
  port: number;
  jwtSecret: string;
  nodeEnv: 'development' | 'production' | 'test';
}

export interface ExternalApiConfig {
  omdbApiKey?: string;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  externalApis: ExternalApiConfig;
}
