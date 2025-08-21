import React from 'react';
import { useImageWithFallback } from '../../hooks/useImageWithFallback';

interface ItemCardProps {
  id: string | number;
  title: string;
  subtitle: string;
  year: string;
  poster: string;
  status?: string;
  progress?: {
    current: number;
    total?: number;
  };
  onItemClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  subtitle,
  year,
  poster,
  status,
  progress,
  onItemClick,
  onEditClick,
  onDeleteClick,
}) => {
   const { handleError } = useImageWithFallback({ fallbackSrc: '/no-image.jpg' });

  const getStatusClasses = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'on_hold':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'dropped':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

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

  const progressPercentage = progress && progress.total ? (progress.current / progress.total) * 100 : 0;

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={onItemClick}
      data-id={id}
    >
      <div className="relative">
        <img
        src={poster !== 'N/A' ? poster : '/no-image.jpg'}
        alt={`Poster for ${title}`}
        className="w-full h-72 object-cover"
        onError={handleError}
        />
        {status && (
          <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(status)}`}>
            {formatStatus(status)}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate" title={title}>{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mb-2">{year}</p>

        {progress && progress.total && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {(onEditClick || onDeleteClick) && (
          <div className="flex gap-2 mt-4">
            {onEditClick && (
              <button
                onClick={(e) => { e.stopPropagation(); onEditClick(); }}
                className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                Edit
              </button>
            )}
            {onDeleteClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this item?')) {
                    onDeleteClick();
                  }
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
