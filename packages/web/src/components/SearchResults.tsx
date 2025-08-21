import React from 'react';
import type { BookResult, MediaType, OmdbResult } from '../types';
import ItemCard from './shared/ItemCard';

interface SearchResultsProps {
  searchResults: (OmdbResult | BookResult)[];
  mediaType: MediaType;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onItemClick: (item: OmdbResult | BookResult) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-72 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  mediaType,
  loading,
  currentPage,
  totalPages,
  onItemClick,
  onPreviousPage,
  onNextPage,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-2m3 2v-2m-9-4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    );
  }

  const mapItemToProps = (item: OmdbResult | BookResult) => {
    if (mediaType === 'book') {
      const bookItem = item as BookResult;
      return {
        id: bookItem.id,
        title: bookItem.volumeInfo.title,
        subtitle: bookItem.volumeInfo.authors?.join(', ') || 'Book',
        year: bookItem.volumeInfo.publishedDate?.split('-')[0] || '',
        poster: bookItem.volumeInfo.imageLinks?.thumbnail || bookItem.volumeInfo.imageLinks?.smallThumbnail || '/no-image.jpg',
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {searchResults.map((item) => (
          <ItemCard
            key={mapItemToProps(item).id}
            {...mapItemToProps(item)}
            onItemClick={() => onItemClick(item)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 sm:space-x-4">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
