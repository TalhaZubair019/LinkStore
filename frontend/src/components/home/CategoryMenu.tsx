'use client';

import Link from 'next/link';

const categories = [
  { id: '1', name: 'Electronic Devices', icon: '📱' },
  { id: '2', name: 'Electronic Accessories', icon: '🔌' },
  { id: '3', name: 'TV & Home Appliances', icon: '📺' },
  { id: '4', name: 'Health & Beauty', icon: '💄' },
  { id: '5', name: 'Babies & Toys', icon: '👶' },
  { id: '6', name: 'Groceries & Pets', icon: '🦴' },
  { id: '7', name: 'Home & Lifestyle', icon: '🛋️' },
  { id: '8', name: 'Women\'s Fashion', icon: '👗' },
  { id: '9', name: 'Men\'s Fashion', icon: '👕' },
  { id: '10', name: 'Watches & Accessories', icon: '⌚' },
  { id: '11', name: 'Sports & Outdoor', icon: '⚽' },
  { id: '12', name: 'Automotive & Motorbike', icon: '🚗' },
];

export default function CategoryMenu() {
  return (
    <div className="w-64 bg-white rounded-xl shadow-xs border border-gray-100 hidden lg:block overflow-hidden py-2 shrink-0 h-[400px]">
      <ul className="h-full flex flex-col justify-between">
        {categories.map((cat, idx) => (
          <li key={cat.id}>
            <Link 
              href={`#`} 
              className="flex items-center gap-3 px-4 py-1.5 text-xs text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
            >
              <span className="text-sm">{cat.icon}</span>
              <span className="font-medium">{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
