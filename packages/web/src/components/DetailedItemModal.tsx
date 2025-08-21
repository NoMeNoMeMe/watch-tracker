import React, { useState } from 'react';
import useFetchDetailedInfo from '../hooks/useFetchDetailedInfo';
import { useImageWithFallback } from '../hooks/useImageWithFallback';
import type { BookResult, MediaType, OmdbResult } from '../types';

interface DetailedItemModalProps {
  item: OmdbResult | BookResult;
  mediaType: MediaType;
  onAdd: (status: string, currentEpisode: number) => void;
  onCancel: () => void;
}

const DetailedItemModal: React.FC<DetailedItemModalProps> = ({
  item,
  mediaType,
  onAdd,
  onCancel,
}) => {
  const [status, setStatus] = useState('planning');
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { detailedItem, loading } = useFetchDetailedInfo(item);

  const getTitle = (): string => {
    if ('Title' in item) return item.Title;
    return item.volumeInfo.title;
  };

  const getYear = (): string => {
    if ('Year' in item) return item.Year;
    return item.volumeInfo.publishedDate?.split('-')[0] || '';
  };

  const getPoster = (): string => {
    if ('Poster' in item) {
      return item.Poster !== 'N/A' ? item.Poster : '/no-image.jpg';
    }
    return item.volumeInfo.imageLinks?.thumbnail ||
           item.volumeInfo.imageLinks?.smallThumbnail ||
           '/no-image.jpg';
  };

  const { handleError } = useImageWithFallback({ fallbackSrc: '/no-image.jpg' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd(status, currentEpisode);
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const renderDetail = (label: string, value?: string) => {
    if (!value || value === 'N/A') return null;
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</h4>
        <p className="text-base text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    );
  };

  const renderMovieTVDetails = () => {
    if (!detailedItem || !('imdbID' in detailedItem)) return null;
    const d = detailedItem;

    return (
      <div className="space-y-4">
        {d.Plot && (
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Plot</h4>
            <p className="text-base text-gray-800 dark:text-gray-200">{d.Plot}</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {renderDetail("Genre", d.Genre)}
          {renderDetail("Director", d.Director)}
          {renderDetail("Actors", d.Actors)}
          {renderDetail("Runtime", d.Runtime)}
          {renderDetail("Language", d.Language)}
          {renderDetail("Released", d.Released)}
          {d.imdbRating && d.imdbRating !== 'N/A' && renderDetail("IMDb Rating", `⭐ ${d.imdbRating}/10`)}
          {d.totalSeasons && renderDetail("Seasons", d.totalSeasons)}
        </div>
        {d.Awards && d.Awards !== 'N/A' && renderDetail("Awards", `🏆 ${d.Awards}`)}
      </div>
    );
  };

  const renderBookDetails = () => {
    if (!detailedItem || 'imdbID' in detailedItem) return null;
    const info = detailedItem.volumeInfo;

    return (
      <div className="space-y-4">
        {info.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Description</h4>
            <div className="text-base text-gray-800 dark:text-gray-200">
              <p className={`${!isDescriptionExpanded ? 'line-clamp-4' : ''}`} dangerouslySetInnerHTML={{ __html: info.description }} />
              {info.description.length > 200 && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-blue-600 hover:underline dark:text-blue-400 text-sm mt-1 font-medium"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {renderDetail("Authors", info.authors?.join(', '))}
          {renderDetail("Publisher", info.publisher)}
          {renderDetail("Pages", info.pageCount?.toString())}
          {renderDetail("Categories", info.categories?.join(', '))}
        </div>
        {info.industryIdentifiers && (
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">ISBN</h4>
            <div className="text-base text-gray-800 dark:text-gray-200">
              {info.industryIdentifiers.map(id => `${id.type}: ${id.identifier}`).join(', ')}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
        <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Add to Your List</h2>
          <button onClick={onCancel} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={getPoster()}
                alt={`Poster for ${getTitle()}`}
                className="w-52 h-auto object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                onError={handleError}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {getTitle()}
              </h3>
              <p className="text-md text-gray-500 dark:text-gray-400 mb-4">
                {getYear()} &bull; <span className="capitalize">{mediaType === 'tv' ? 'TV Series' : mediaType}</span>
              </p>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                detailedItem ? (mediaType === 'book' ? renderBookDetails() : renderMovieTVDetails()) : <p>No detailed information available.</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="planning">{mediaType === 'book' ? 'Plan to Read' : 'Plan to Watch'}</option>
                    <option value="pending">{mediaType === 'book' ? 'Reading' : 'Watching'}</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>

                {(status === 'pending') && (mediaType === 'tv' || mediaType === 'book') && (
                  <div>
                    <label htmlFor="currentEpisode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {mediaType === 'book' ? 'Current Page' : 'Current Episode'}
                    </label>
                    <input
                      type="number"
                      id="currentEpisode"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentEpisode}
                      onChange={(e) => setCurrentEpisode(parseInt(e.target.value, 10) || 0)}
                      min="0"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  Add to List
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedItemModal;
