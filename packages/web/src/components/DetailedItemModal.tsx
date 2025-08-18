import React, { useState } from 'react';
import type { MediaType, OmdbResult, BookResult } from '../types';
import { useImageWithFallback } from '../hooks/useImageWithFallback';
import useFetchDetailedInfo from '../hooks/useFetchDetailedInfo';

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
  const [status, setStatus] = useState('plan-to-watch');
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { detailedItem, loading, error } = useFetchDetailedInfo(item);

  // Get basic info for display
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

  const { src: posterSrc, handleError } = useImageWithFallback(getPoster(), {
    fallbackSrc: '/no-image.jpg'
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd(status, currentEpisode);
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const renderMovieTVDetails = () => {
    if (!detailedItem || !('imdbID' in detailedItem)) return null;

    const details = detailedItem;
    const hasDetailedInfo = details.Plot || details.Genre || details.Director;

    return (
      <div className="space-y-3">
        {!hasDetailedInfo && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              Click "Add to List" to save this {mediaType === 'tv' ? 'TV series' : 'movie'} to your watched list.
            </p>
          </div>
        )}

        {details.Plot && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Plot</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{details.Plot}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.Genre && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Genre</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{details.Genre}</p>
            </div>
          )}

          {details.Director && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Director</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{details.Director}</p>
            </div>
          )}

          {details.Actors && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Actors</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{details.Actors}</p>
            </div>
          )}

          {details.Runtime && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Runtime</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{details.Runtime}</p>
            </div>
          )}

          {details.imdbRating && details.imdbRating !== 'N/A' && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">IMDb Rating</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">⭐ {details.imdbRating}/10</p>
            </div>
          )}

          {details.totalSeasons && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Seasons</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{details.totalSeasons}</p>
            </div>
          )}

          {details.Language && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Language</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{details.Language}</p>
            </div>
          )}

          {details.Released && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Released</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{details.Released}</p>
            </div>
          )}
        </div>

        {details.Awards && details.Awards !== 'N/A' && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Awards</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">🏆 {details.Awards}</p>
          </div>
        )}
      </div>
    );
  };

  const renderBookDetails = () => {
    if (!detailedItem || 'imdbID' in detailedItem) return null;

    const book = detailedItem;
    const info = book.volumeInfo;

    return (
      <div className="space-y-3">
        {info.description && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Description</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className={`${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                {info.description.replace(/<[^>]*>/g, '')}
              </p>
              {info.description.length > 200 && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs mt-1 font-medium"
                >
                  {isDescriptionExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {info.authors && info.authors.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Authors</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{info.authors.join(', ')}</p>
            </div>
          )}

          {info.publisher && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Publisher</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{info.publisher}</p>
            </div>
          )}

          {info.pageCount && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Pages</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{info.pageCount}</p>
            </div>
          )}

          {info.categories && info.categories.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Categories</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{info.categories.join(', ')}</p>
            </div>
          )}

          {info.industryIdentifiers && info.industryIdentifiers.length > 0 && (
            <div className="col-span-full">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">ISBN</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {info.industryIdentifiers.map((id, index) => (
                  <span key={index} className="mr-4">
                    {id.type}: {id.identifier}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add to Watched List</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <img
                src={posterSrc}
                alt={getTitle()}
                className="w-48 h-72 object-cover rounded-lg shadow-md"
                onError={handleError}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {getTitle()}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {getYear()} • {mediaType === 'tv' ? 'TV Series' : mediaType === 'movie' ? 'Movie' : 'Book'}
              </p>

              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-500">Loading details...</span>
                </div>
              ) : error ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm">
                    <strong>Note:</strong> {error}
                  </p>
                  <p className="text-xs mt-1">Showing basic information only.</p>
                </div>
              ) : null}

              {detailedItem && (
                <>
                  {mediaType === 'book' ? renderBookDetails() : renderMovieTVDetails()}
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Add to Your List
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Status:
                </label>
                <select
                  id="status"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="not_started">Not Started</option>
                  <option value="pending">{mediaType === 'book' ? 'Reading' : 'Watching'}</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="dropped">Dropped</option>
                  <option value="planning">{mediaType === 'book' ? 'Plan to Read' : 'Plan to Watch'}</option>
                </select>
              </div>

              {status === 'watching' && (mediaType === 'tv' || mediaType === 'book') && (
                <div>
                  <label htmlFor="currentEpisode" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    {mediaType === 'book' ? 'Current Page:' : 'Current Episode:'}
                  </label>
                  <input
                    type="number"
                    id="currentEpisode"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    value={currentEpisode}
                    onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
