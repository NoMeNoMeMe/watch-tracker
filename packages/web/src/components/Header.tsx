import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-700  dark:bg-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Watch Tracker
        </h1>
        <p className="mt-1 text-base text-blue-200">
          Your personal dashboard for tracking movies, TV shows, and books.
        </p>
      </div>
    </header>
  );
};

export default Header;
