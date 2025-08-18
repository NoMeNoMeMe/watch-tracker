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
  return (
    <nav className="bg-gray-800 text-white p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => onViewChange('search')}
            className={`px-4 py-2 rounded transition-colors ${
              currentView === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => onViewChange('watched')}
            className={`px-4 py-2 rounded transition-colors ${
              currentView === 'watched'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            My List
          </button>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
