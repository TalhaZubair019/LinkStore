"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"}/public/categories`,
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`,
      );
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-1 w-full items-center bg-gray-100 rounded-full border border-transparent focus-within:bg-white focus-within:border-indigo-400 focus-within:shadow-md transition-all max-w-2xl px-2 py-1.5 h-12"
    >
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-transparent text-gray-500 font-bold text-xs uppercase tracking-widest px-4 border-none outline-hidden border-r border-gray-100 cursor-pointer hidden md:block focus:ring-0"
      >
        {categories.length > 0 ? (
          categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.name === "All Categories" ? "all" : cat.name}
            >
              {cat.name}
            </option>
          ))
        ) : (
          <option value="all">All Categories</option>
        )}
      </select>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search in LinkStore..."
        className="flex-1 bg-transparent border-none outline-hidden px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 md:px-6 md:py-2 rounded-full flex items-center justify-center transition-colors shadow-sm"
      >
        <Search className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </form>
  );
}
