import React from 'react';
import ItemCard from './shared/ItemCard';
import type { WatchedItem } from '../types';

interface WatchedListProps {
  watchedItems: WatchedItem[];
  loading: boolean;
  error: string | null;
  watchedFilter: string;
  onFilterChange: (filter: string) => void;
  onEditClick: (item: WatchedItem) => void;
  onDeleteClick: (id: number) => void;
}

const WatchedList: React.FC<WatchedListProps> = ({
  watchedItems,
  loading,
  error,
  watchedFilter,
  onFilterChange,
  onEditClick,
  onDeleteClick,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading your watched items...</span>
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

  const filteredItems = watchedItems.filter(item => {
    if (watchedFilter === 'all') return true;
    return item.status === watchedFilter;
  });

  // const getStatusBadgeColor = (status: string) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'bg-green-100 text-green-800';
  //     case 'pending':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'planning':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'not_started':
  //     case 'on_hold':
  //     case 'dropped':
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

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
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'completed', 'pending', 'planning', 'dropped', 'not_started', 'on_hold'].map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              watchedFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter === 'all' ? 'All' : formatStatus(filter)}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {watchedFilter === 'all'
            ? "You haven't added any items to your watched list yet."
            : `No items with status "${formatStatus(watchedFilter)}" found.`
          }
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={`${item.year} • ${item.type === 'tv' ? 'TV Series' : item.type === 'movie' ? 'Movie' : 'Book'}`}
              year={item.year}
              poster={item.poster}
              status={item.status}
              progress={
                item.type === 'tv' || item.type === 'book'
                  ? {
                      current: item.currentEpisode,
                      total: item.totalEpisodes || item.pageCount,
                    }
                  : undefined
              }
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
