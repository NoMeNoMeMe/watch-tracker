import React from 'react';

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
  onClick?: () => void;
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
  onClick,
  onEditClick,
  onDeleteClick,
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_started':
      case 'on_hold':
      case 'dropped':
      default:
        return 'bg-gray-100 text-gray-800';
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
        return status;
    }
  };

  return (
    <div
      className="bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      data-id={id}
    >
      <img
        src={poster !== 'N/A' ? poster : '/no-image.jpg'}
        alt={title}
        className="w-full h-64 object-cover rounded-t-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('no-image.jpg')) {
            target.src = '/no-image.jpg';
          }
        }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-2">{subtitle}</p>
        <p className="text-gray-300 text-sm">{year}</p>

        {status && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
              status
            )}`}
          >
            {formatStatus(status)}
          </span>
        )}

        {progress && (
          <div className="mt-3">
            <p className="text-sm text-gray-300">
              Progress: {progress.current}
              {progress.total && ` / ${progress.total}`}
            </p>
            {progress.total && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (progress.current / progress.total) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            )}
          </div>
        )}

        {(onEditClick || onDeleteClick) && (
          <div className="flex space-x-2 mt-4">
            {onEditClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
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
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
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
