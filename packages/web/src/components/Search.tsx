import React, { useState } from 'react';

interface SearchProps {
  onSearch: (query: string, type: 'movie' | 'tv' | 'book') => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv' | 'book'>('movie');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value as 'movie' | 'tv' | 'book');
  };

  const handleSearch = () => {
    onSearch(query, type);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(query, type);
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      <input
        type="text"
        placeholder="Search for a movie, TV show, or book..."
        className="w-full max-w-lg px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <select
        value={type}
        onChange={handleTypeChange}
        className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="movie">Movie</option>
        <option value="tv">TV Show</option>
        <option value="book">Book</option>
      </select>
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Search
      </button>
    </div>
  );
};

export default Search;