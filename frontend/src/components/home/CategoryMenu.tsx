'use client';

import Link from 'next/link';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Lifestyle' },
  { id: 'beauty', name: 'Health & Beauty' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'automotive', name: 'Automotive' },
];

export default function CategoryMenu() {
  return (
    <div className="bg-white border-b border-gray-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <ul className="flex items-center gap-8 h-12 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <li key={cat.id} className="shrink-0">
              <Link 
                href={`/search?category=${cat.id}`} 
                className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors uppercase tracking-tight"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

