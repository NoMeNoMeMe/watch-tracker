import { useCallback, useState } from 'react';
import notify from '../helpers/notify';
import type { BookResult, MediaType, OmdbResult } from '../types';

interface UseSearchReturn {
  searchResults: (OmdbResult | BookResult)[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  query: string;
  handleSearch: (query: string, type: MediaType, page?: number) => Promise<void>;
  searchPreviousPage: () => void;
  searchNextPage: () => void;
  clearSearch: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<(OmdbResult | BookResult)[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('movie');


  const handleSearch = useCallback(async (searchQuery: string, type: MediaType, page: number = 1) => {
    const baseURL = import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    if (!searchQuery.trim()) {
      notify({ type: 'error', message: 'Please enter a search query', logToConsole: true });
      return;
    }

    setLoading(true);
    setQuery(searchQuery);
    setMediaType(type);
    setCurrentPage(page);

    try {
      let results: (OmdbResult | BookResult)[] = [];
      let totalResults = 0;

      if (type === 'book') {
        // Search Google Books API via backend
        const response = await fetch(
          `${baseURL}/external/search/book?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=30`
        );

        if (!response.ok) {
          throw new Error('Failed to search books');
        }

        const data = await response.json();
        results = data.items || [];
        totalResults = data.totalItems || 0;
      } else {
        // Search OMDB API via backend
        const omdbType = type === 'tv' ? 'series' : 'movie';
        const response = await fetch(
          `${baseURL}/external/search/omdb?query=${encodeURIComponent(searchQuery)}&type=${omdbType}`
        );

        if (!response.ok) {
          throw new Error('Failed to search movies/TV shows');
        }

        const data = await response.json();

        if (data.Response === 'False') {
          if (data.Error === 'Movie not found!') {
            setSearchResults([]);
            setTotalPages(0);
            return;
          }
          throw new Error(data.Error || 'Search failed');
        }

        results = data.Search || [];
        totalResults = parseInt(data.totalResults, 10) || 0;
      }

      setSearchResults(results);
      setTotalPages(Math.ceil(totalResults / 10));
    } catch (err) {
      notify({ type: 'error', message: 'Search failed', logToConsole: true, error: err as Error });
      setSearchResults([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPreviousPage = useCallback(() => {
    if (currentPage > 1 && query) {
      handleSearch(query, mediaType, currentPage - 1);
    }
  }, [currentPage, query, mediaType, handleSearch]);

  const searchNextPage = useCallback(() => {
    if (currentPage < totalPages && query) {
      handleSearch(query, mediaType, currentPage + 1);
    }
  }, [currentPage, totalPages, query, mediaType, handleSearch]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setQuery('');
    setCurrentPage(1);
    setTotalPages(1);
    setLoading(false);
  }, []);

  return {
    searchResults,
    loading,
    currentPage,
    totalPages,
    query,
    handleSearch,
    searchPreviousPage,
    searchNextPage,
    clearSearch,
  };
};
