import React from 'react';
import DetailedItemModal from './DetailedItemModal';
import EditWatchedItemForm from './EditWatchedItemForm';
import type { MediaType, OmdbResult, BookResult, WatchedItem } from '../types';

interface FormsManagerProps {
  // Add to watched form state
  showAddToWatchedForm: boolean;
  selectedItem: OmdbResult | BookResult | null;
  mediaType: MediaType;
  onAddToWatched: (status: string, currentEpisode: number) => Promise<void>;
  onCancelAdd: () => void;

  // Edit watched form state
  showEditWatchedForm: boolean;
  itemToEdit: WatchedItem | null;
  onUpdateWatchedItem: (id: number, status: string, currentEpisode: number) => Promise<void>;
  onCancelEdit: () => void;
}

const FormsManager: React.FC<FormsManagerProps> = ({
  showAddToWatchedForm,
  selectedItem,
  mediaType,
  onAddToWatched,
  onCancelAdd,
  showEditWatchedForm,
  itemToEdit,
  onUpdateWatchedItem,
  onCancelEdit,
}) => {
  return (
    <>
      {showAddToWatchedForm && selectedItem && (
        <DetailedItemModal
          item={selectedItem}
          mediaType={mediaType}
          onAdd={onAddToWatched}
          onCancel={onCancelAdd}
        />
      )}

      {showEditWatchedForm && itemToEdit && (
        <EditWatchedItemForm
          item={itemToEdit}
          onSave={onUpdateWatchedItem}
          onCancel={onCancelEdit}
        />
      )}
    </>
  );
};

export default FormsManager;
