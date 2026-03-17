'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-1 w-full overflow-hidden bg-gray-100 rounded-lg border border-gray-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all max-w-3xl">
      <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-100 text-gray-700 text-sm px-4 py-2.5 border-none outline-hidden border-r border-gray-300 cursor-pointer hidden md:block"
      >
        <option value="All">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Home">Home & Lifestyle</option>
        <option value="Beauty">Beauty</option>
      </select>
      
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search in LinkStore" 
        className="w-full bg-transparent border-none outline-hidden px-4 text-sm text-gray-900 placeholder:text-gray-400"
      />
      <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 flex items-center justify-center transition-colors">
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
