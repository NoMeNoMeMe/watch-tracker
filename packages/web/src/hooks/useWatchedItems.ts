import { useState, useCallback } from 'react';
import type { WatchedItem, OmdbResult, BookResult, MediaType } from '../types';

interface UseWatchedItemsReturn {
  watchedItems: WatchedItem[];
  loading: boolean;
  error: string | null;
  fetchWatchedItems: () => Promise<void>;
  addWatchedItem: (item: OmdbResult | BookResult, status: string, currentEpisode: number) => Promise<boolean>;
  updateWatchedItem: (id: number, status: string, currentEpisode: number, originalItem: WatchedItem) => Promise<boolean>;
  deleteWatchedItem: (id: number) => Promise<boolean>;
  setError: (error: string | null) => void;
}


export const useWatchedItems = (userId: number | null, accessToken: string | null): UseWatchedItemsReturn => {
  const baseUrl = import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const [watchedItems, setWatchedItems] = useState<WatchedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchedItems = useCallback(async () => {
    if (!userId || !accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/watched/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch watched items');
      }

      const backendItems = await response.json();

      // Map backend response to WatchedItem type
      const watchedItems: WatchedItem[] = backendItems.map((item: WatchedItem) => ({
        id: item.id,
        userId: item.userId,
        externalId: item.mediaId,
        title: item.title,
        year: item.releaseDate,
        type: item.mediaType as MediaType,
        poster: item.posterPath || '',
        status: item.status,
        currentEpisode: item.currentEpisode,
        totalEpisodes: undefined, // Backend doesn't store this
        createdAt: new Date().toISOString(), // Backend doesn't have timestamps
        updatedAt: new Date().toISOString(),
        // Optional fields that backend doesn't store
        genre: undefined,
        director: undefined,
        actors: undefined,
        runtime: undefined,
        imdbRating: undefined,
        plot: undefined,
        authors: undefined,
        publisher: undefined,
        pageCount: undefined,
        isbn: undefined,
      }));

      setWatchedItems(watchedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch watched items');
    } finally {
      setLoading(false);
    }
  }, [userId, accessToken, baseUrl]);

  const addWatchedItem = async (
    item: OmdbResult | BookResult,
    status: string,
    currentEpisode: number
  ): Promise<boolean> => {
    if (!userId || !accessToken) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine media type and extract relevant data
      let mediaType: MediaType;

      let backendPayload;

      if ('imdbID' in item) {
        // OMDB result (movie/tv)
        mediaType = item.Type === 'series' ? 'tv' : 'movie';
        backendPayload = {
          userId,
          mediaType,
          mediaId: item.imdbID,
          title: item.Title,
          posterPath: item.Poster !== 'N/A' ? item.Poster : '',
          releaseDate: item.Year,
          status,
          currentEpisode,
        };
      } else {
        // Book result
        mediaType = 'book';
        backendPayload = {
          userId,
          mediaType,
          mediaId: item.id,
          title: item.volumeInfo.title,
          posterPath: item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail || '',
          releaseDate: item.volumeInfo.publishedDate?.split('-')[0] || '',
          status,
          currentEpisode,
        };
      }

      const response = await fetch(`${baseUrl}/watched`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to add watched item');
      }

      // Refetch the items to get the updated list
      await fetchWatchedItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add watched item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateWatchedItem = async (
    id: number,
    status: string,
    currentEpisode: number,
    originalItem: WatchedItem
  ): Promise<boolean> => {
    if (!userId || !accessToken) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedPayload = {
        userId,
        mediaType: originalItem.type,
        mediaId: originalItem.externalId,
        title: originalItem.title,
        posterPath: originalItem.poster,
        releaseDate: originalItem.year,
        status,
        currentEpisode,
      };

      const response = await fetch(`${baseUrl}/watched/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to update watched item');
      }

      // Refetch the items to get the updated list
      await fetchWatchedItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update watched item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteWatchedItem = async (id: number): Promise<boolean> => {
    if (!userId || !accessToken) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/watched/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete watched item');
      }

      // Refetch the items to get the updated list
      await fetchWatchedItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete watched item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setErrorHandler = (error: string | null) => {
    setError(error);
  };

  return {
    watchedItems,
    loading,
    error,
    fetchWatchedItems,
    addWatchedItem,
    updateWatchedItem,
    deleteWatchedItem,
    setError: setErrorHandler,
  };
};
