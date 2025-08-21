import React, { useEffect, useState } from 'react';
import type { WatchedItem } from '../types';

interface EditWatchedItemFormProps {
  item: WatchedItem;
  onSave: (id: number, status: string, currentEpisode: number) => void;
  onCancel: () => void;
}

const EditWatchedItemForm: React.FC<EditWatchedItemFormProps> = ({ item, onSave, onCancel }) => {
  const [status, setStatus] = useState<WatchedItem['status']>(item.status);
  const [currentEpisode, setCurrentEpisode] = useState(item.currentEpisode);

  useEffect(() => {
    setStatus(item.status);
    setCurrentEpisode(item.currentEpisode);
  }, [item]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(item.id, status, currentEpisode);
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Item</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value as WatchedItem['status'])}
              >
                <option value="planning">{item.type === 'book' ? 'Plan to Read' : 'Plan to Watch'}</option>
                <option value="pending">{item.type === 'book' ? 'Reading' : 'Watching'}</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            {(status === 'pending') && (item.type === 'tv' || item.type === 'book') && (
              <div>
                <label htmlFor="currentEpisode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {item.type === 'book' ? 'Current Page' : 'Current Episode'}
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

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWatchedItemForm;
