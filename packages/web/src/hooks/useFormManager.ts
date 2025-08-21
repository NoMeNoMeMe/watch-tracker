import { useState } from 'react';
import type { BookResult, OmdbResult, WatchedItem } from '../types';

interface FormManagerState {
  // Add to watched form state
  showAddToWatchedForm: boolean;
  selectedItem: OmdbResult | BookResult | null;

  // Edit watched form state
  showEditWatchedForm: boolean;
  itemToEdit: WatchedItem | null;
}

export const useFormManager = () => {
  const [formState, setFormState] = useState<FormManagerState>({
    showAddToWatchedForm: false,
    selectedItem: null,
    showEditWatchedForm: false,
    itemToEdit: null,
  });

  const showAddForm = (item: OmdbResult | BookResult) => {
    setFormState(prev => ({
      ...prev,
      showAddToWatchedForm: true,
      selectedItem: item,
    }));
  };

  const hideAddForm = () => {
    setFormState(prev => ({
      ...prev,
      showAddToWatchedForm: false,
      selectedItem: null,
    }));
  };

  const showEditForm = (item: WatchedItem) => {
    setFormState(prev => ({
      ...prev,
      showEditWatchedForm: true,
      itemToEdit: item,
    }));
  };

  const hideEditForm = () => {
    setFormState(prev => ({
      ...prev,
      showEditWatchedForm: false,
      itemToEdit: null,
    }));
  };

  // TODO: Implement detailed view when clicked on watched item
  const showWatchedItemForm = (item: WatchedItem) => {
    setFormState(prev => ({
      ...prev,
      showAddToWatchedForm: true,
      itemToEdit: item,
    }));
  };

  const hideWatchedItemForm = () => {
    setFormState(prev => ({
      ...prev,
      showAddToWatchedForm: false,
      itemToEdit: null,
    }));
  };

  const resetAllForms = () => {
    setFormState({
      showAddToWatchedForm: false,
      selectedItem: null,
      showEditWatchedForm: false,
      itemToEdit: null,
    });
  };

  return {
    ...formState,
    showAddForm,
    hideAddForm,
    showEditForm,
    hideEditForm,
    showWatchedItemForm,
    hideWatchedItemForm,
    resetAllForms,
  };
};
