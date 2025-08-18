import React from 'react';
import Search from './Search';
import SearchResults from './SearchResults';
import WatchedList from './WatchedList';
import type { ViewType, MediaType, OmdbResult, BookResult, WatchedItem } from '../types';

interface ViewContentProps {
  view: ViewType;
  // Search related props
  onSearch: (query: string, type: MediaType, page?: number) => void;
  searchResults: (OmdbResult | BookResult)[];
  mediaType: MediaType;
  searchLoading: boolean;
  searchError: string | null;
  currentPage: number;
  totalPages: number;
  onItemClick: (item: OmdbResult | BookResult) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  // Watched list related props
  watchedItems: WatchedItem[];
  watchedLoading: boolean;
  watchedError: string | null;
  watchedFilter: string;
  onFilterChange: (filter: string) => void;
  onEditClick: (item: WatchedItem) => void;
  onDeleteClick: (id: number) => void;
}

const ViewContent: React.FC<ViewContentProps> = ({
  view,
  onSearch,
  searchResults,
  mediaType,
  searchLoading,
  searchError,
  currentPage,
  totalPages,
  onItemClick,
  onPreviousPage,
  onNextPage,
  watchedItems,
  watchedLoading,
  watchedError,
  watchedFilter,
  onFilterChange,
  onEditClick,
  onDeleteClick,
}) => {
  if (view === 'search') {
    return (
      <>
        <Search onSearch={onSearch} />
        <SearchResults
          searchResults={searchResults}
          mediaType={mediaType}
          loading={searchLoading}
          error={searchError}
          currentPage={currentPage}
          totalPages={totalPages}
          onItemClick={onItemClick}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </>
    );
  }

  if (view === 'watched') {
    return (
      <WatchedList
        watchedItems={watchedItems}
        loading={watchedLoading}
        error={watchedError}
        watchedFilter={watchedFilter}
        onFilterChange={onFilterChange}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );
  }

  return null;
};

export default ViewContent;
