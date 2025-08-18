import React, { useState, useEffect } from 'react';
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

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Watched Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Status:
            </label>
            <select
              id="status"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              value={status}
              onChange={(e) => setStatus(e.target.value as WatchedItem['status'])}
            >
              <option value="not_started">Not Started</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="dropped">Dropped</option>
              <option value="planning">Planning</option>
            </select>
          </div>

          {status === 'pending' && (item.type === 'tv' || item.type === 'book') && (
            <div className="mb-4">
              <label htmlFor="currentEpisode" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                {item.type === 'tv' ? 'Current Episode:' : 'Current Page:'}
              </label>
              <input
                type="number"
                id="currentEpisode"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={currentEpisode}
                onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWatchedItemForm;
