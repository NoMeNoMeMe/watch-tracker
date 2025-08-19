import { useState } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import AuthForm from './components/AuthForm';
import FormsManager from './components/FormsManager';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import ViewContent from './components/ViewContent';
import notify from './helpers/notify';
import { useFormManager } from './hooks/useFormManager';
import { useSearch } from './hooks/useSearch';
import { useWatchedItems } from './hooks/useWatchedItems';
import { useAuthStore } from './store/authStore';
import type { BookResult, MediaType, OmdbResult, ViewType, WatchedItem } from './types';

function App() {
  const { userId, accessToken, isAuthenticated, logout } = useAuthStore();
  const watchedItemsHook = useWatchedItems(userId, accessToken);
  const searchHook = useSearch();
  const formManager = useFormManager();

  const [view, setView] = useState<ViewType>('search');
  const [watchedFilter, setWatchedFilter] = useState<string>('all');
  const [mediaType, setMediaType] = useState<MediaType>('movie');

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    if (newView !== 'search') {
      searchHook.clearSearch();
    }
    if (newView === 'watched') {
      watchedItemsHook.fetchWatchedItems();
    }
  };

  const handleLogoutClick = () => {
    logout();
    setView('search');
    searchHook.clearSearch();
    formManager.resetAllForms();
  };

  const handleSearch = (query: string, type: MediaType, page: number = 1) => {
    setMediaType(type);
    searchHook.handleSearch(query, type, page);
  };

  const handleAddClick = (item: OmdbResult | BookResult) => {
    formManager.showAddForm(item);
  };

  const handleAddToWatched = async (status: string, currentEpisode: number) => {
    if (!formManager.selectedItem) {
      notify({ type: 'error', message: 'Please select an item to add to your watched list.', logToConsole: true });
      return;
    }

    const success = await watchedItemsHook.addWatchedItem(
      formManager.selectedItem,
      status,
      currentEpisode
    );

    if (success) {
      notify({ type: 'success', message: 'Item added successfully!' });
      formManager.hideAddForm();
    } else {
      notify({ type: 'error', message: 'Failed to add item!', logToConsole: true });
    }
  };

  const handleEditClick = (item: WatchedItem) => {
    formManager.showEditForm(item);
  };

  const handleUpdateWatchedItem = async (id: number, status: string, currentEpisode: number) => {
    if (!formManager.itemToEdit) {
      notify({ type: 'error', message: 'No item selected for editing!', logToConsole: true });
      return;
    }

    const success = await watchedItemsHook.updateWatchedItem(
      id,
      status,
      currentEpisode,
      formManager.itemToEdit
    );

    if (success) {
      notify({ type: 'success', message: 'Item updated successfully!' });
      formManager.hideEditForm();
    } else {
      notify({ type: 'error', message: 'Failed to update item!' });
    }
  };

  const handleDeleteClick = async (id: number) => {
    const success = await watchedItemsHook.deleteWatchedItem(id);
    if (success) {
      notify({ type: 'success', message: 'Item deleted successfully!' });
    } else {
      notify({ type: 'error', message: 'Failed to delete item!' });
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <AuthForm />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Navigation
        currentView={view}
        onViewChange={handleViewChange}
        onLogout={handleLogoutClick}
      />

      <ViewContent
        view={view}
        // Search related props
        onSearch={handleSearch}
        searchResults={searchHook.searchResults}
        mediaType={mediaType}
        searchLoading={searchHook.loading}
        currentPage={searchHook.currentPage}
        totalPages={searchHook.totalPages}
        onItemClick={handleAddClick}
        onPreviousPage={searchHook.searchPreviousPage}
        onNextPage={searchHook.searchNextPage}
        // Watched list related props
        watchedItems={watchedItemsHook.watchedItems}
        watchedLoading={watchedItemsHook.loading}
        watchedFilter={watchedFilter}
        onFilterChange={setWatchedFilter}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      <FormsManager
        // Add to watched form props
        showAddToWatchedForm={formManager.showAddToWatchedForm}
        selectedItem={formManager.selectedItem}
        mediaType={mediaType}
        onAddToWatched={handleAddToWatched}
        onCancelAdd={formManager.hideAddForm}
        // Edit watched form props
        showEditWatchedForm={formManager.showEditWatchedForm}
        itemToEdit={formManager.itemToEdit}
        onUpdateWatchedItem={handleUpdateWatchedItem}
        onCancelEdit={formManager.hideEditForm}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </Layout>
  );
}

export default App;
