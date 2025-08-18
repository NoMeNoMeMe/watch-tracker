import { useState } from 'react';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import Navigation from './components/Navigation';
import ViewContent from './components/ViewContent';
import FormsManager from './components/FormsManager';
import { ToastContainer, Bounce, toast } from 'react-toastify';
import { useAuthStore } from './store/authStore';
import { useWatchedItems } from './hooks/useWatchedItems';
import { useSearch } from './hooks/useSearch';
import { useFormManager } from './hooks/useFormManager';
import type { ViewType, MediaType, OmdbResult, BookResult, WatchedItem } from './types';

function App() {
  const { userId, accessToken, isAuthenticated, logout } = useAuthStore();
  const watchedItemsHook = useWatchedItems(userId, accessToken);
  const searchHook = useSearch();
  const formManager = useFormManager();

  const [view, setView] = useState<ViewType>('search');
  const [watchedFilter, setWatchedFilter] = useState<string>('all');
  const [mediaType, setMediaType] = useState<MediaType>('movie');

  // Fetch watched items when switching to watched view
  // useEffect(() => {
  //   if (userId && view === 'watched') {
  //     watchedItemsHook.fetchWatchedItems();
  //   }
  // }, [userId, view, watchedItemsHook]);

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
    console.log('App: Item clicked for adding:', item);
    formManager.showAddForm(item);
  };

  const handleAddToWatched = async (status: string, currentEpisode: number) => {
    if (!formManager.selectedItem) {
      watchedItemsHook.setError('Please select an item to add to your watched list.');
      return;
    }

    const success = await watchedItemsHook.addWatchedItem(
      formManager.selectedItem,
      status,
      currentEpisode
    );

    if (success) {
      toast.success('Item added successfully!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      formManager.hideAddForm();
    } else {
      toast.error('Failed to add item!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleEditClick = (item: WatchedItem) => {
    formManager.showEditForm(item);
  };

  const handleUpdateWatchedItem = async (id: number, status: string, currentEpisode: number) => {
    if (!formManager.itemToEdit) {
      watchedItemsHook.setError('No item selected for editing.');
      return;
    }

    const success = await watchedItemsHook.updateWatchedItem(
      id,
      status,
      currentEpisode,
      formManager.itemToEdit
    );

    if (success) {
      toast.success('Item updated successfully!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      formManager.hideEditForm();
    } else {
      toast.error('Failed to update item!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleDeleteClick = async (id: number) => {
    const success = await watchedItemsHook.deleteWatchedItem(id);
    if (success) {
      toast.success('Item deleted successfully!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } else {
      toast.error('Failed to delete item!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <AuthForm />
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
        searchError={searchHook.error}
        currentPage={searchHook.currentPage}
        totalPages={searchHook.totalPages}
        onItemClick={handleAddClick}
        onPreviousPage={searchHook.searchPreviousPage}
        onNextPage={searchHook.searchNextPage}
        // Watched list related props
        watchedItems={watchedItemsHook.watchedItems}
        watchedLoading={watchedItemsHook.loading}
        watchedError={watchedItemsHook.error}
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
