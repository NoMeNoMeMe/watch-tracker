import React from 'react';
import ItemCard from './shared/ItemCard';
import type { MediaType, OmdbResult, BookResult } from '../types';

interface SearchResultsProps {
  searchResults: (OmdbResult | BookResult)[];
  mediaType: MediaType;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onItemClick: (item: OmdbResult | BookResult) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  mediaType,
  loading,
  error,
  currentPage,
  totalPages,
  onItemClick,
  onPreviousPage,
  onNextPage,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Searching...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results found. Try a different search term.
      </div>
    );
  }

  const mapItemToProps = (item: OmdbResult | BookResult): {
    id: string | number;
    title: string;
    subtitle: string;
    year: string;
    poster: string;
  } => {
    if (mediaType === 'book') {
      const bookItem = item as BookResult;
      return {
        id: bookItem.id,
        title: bookItem.volumeInfo.title,
        subtitle: bookItem.volumeInfo.authors?.join(', ') || 'Book',
        year: bookItem.volumeInfo.publishedDate?.split('-')[0] || '',
        poster: bookItem.volumeInfo.imageLinks?.thumbnail ||
                bookItem.volumeInfo.imageLinks?.smallThumbnail ||
                '/no-image.jpg',
      };
    }
    const omdbItem = item as OmdbResult;
    return {
      id: omdbItem.imdbID,
      title: omdbItem.Title,
      subtitle: mediaType === 'tv' ? 'TV Series' : 'Movie',
      year: omdbItem.Year,
      poster: omdbItem.Poster !== 'N/A' ? omdbItem.Poster : '/no-image.jpg',
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searchResults.map((item) => (
          <ItemCard
            {...mapItemToProps(item)}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
