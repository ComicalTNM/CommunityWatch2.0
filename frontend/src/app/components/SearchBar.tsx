// frontend/src/app/components/SearchBar.tsx
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 
                       rounded-lg blur opacity-75" />
        <div className="relative flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, organizations, or tags..."
            className="flex-grow p-3 rounded-l-lg backdrop-blur-xl bg-glass-light 
                     border-y border-l border-outline-default focus:outline-none 
                     focus:ring-2 focus:ring-white/20 text-white placeholder-white/50"
          />
          <button
            type="submit"
            className="backdrop-blur-xl bg-glass-medium px-6 rounded-r-lg 
                     border border-outline-default hover:bg-glass-heavy 
                     transition-all duration-300 text-white"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;