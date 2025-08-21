import React from 'react';
import type { WatchedItem } from '../types';
import ItemCard from './shared/ItemCard';

interface WatchedListProps {
  watchedItems: WatchedItem[];
  loading: boolean;
  watchedFilter: string;
  onFilterChange: (filter: string) => void;
  onItemClick: (item: WatchedItem) => void;
  onEditClick: (item: WatchedItem) => void;
  onDeleteClick: (id: number) => void;
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

const WatchedList: React.FC<WatchedListProps> = ({
  watchedItems,
  loading,
  watchedFilter,
  onFilterChange,
  onItemClick,
  onEditClick,
  onDeleteClick,
}) => {
  const filters = ['all', 'planning', 'pending', 'completed', 'on_hold', 'dropped'];

  const formatStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'planning':
        return 'Planning';
      case 'not_started':
        return 'Not Started';
      case 'on_hold':
        return 'On Hold';
      case 'dropped':
        return 'Dropped';
      default:
        return status.toUpperCase();
    }
  };

  const filteredItems = watchedItems.filter(item => {
    if (watchedFilter === 'all') return true;
    return item.status === watchedFilter;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
              watchedFilter === filter
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {formatStatus(filter)}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-2m3 2v-2m-9-4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {watchedFilter === 'all' ? 'No items in your list' : `No items with status "${formatStatus(watchedFilter)}"`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {watchedFilter === 'all' ? "Add some items from the search page to get started!" : "Try selecting another filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle=""
              year={item.year}
              poster={item.poster}
              status={item.status}
              progress={
                (item.type === 'tv' || item.type === 'book') && item.status === 'pending'
                  ? {
                      current: item.currentEpisode,
                      total: item.totalEpisodes || item.pageCount,
                    }
                  : undefined
              }
              onItemClick={() => onItemClick(item)}
              onEditClick={() => onEditClick(item)}
              onDeleteClick={() => onDeleteClick(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchedList;
