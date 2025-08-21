import React from 'react';
import type { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onLogout,
}) => {
  const navLinkClasses = (view: ViewType) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-all duration-100 ease-in-out text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 ${
      currentView === view
        ? 'shadow-lg shadow-cyan-500/50 dark:shadow-blue-500/50'
        : 'shadow-md'
    }`;

  return (
    <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-900/50 rounded-lg mb-6 gap-1">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onViewChange('search')}
          className={navLinkClasses('search')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          Search
        </button>
        <button
          onClick={() => onViewChange('watched')}
          className={navLinkClasses('watched')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3-5 3V4z" />
          </svg>
          List
        </button>
      </div>
      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-md text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default Navigation;
