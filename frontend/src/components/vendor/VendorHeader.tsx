'use client';

import { Bell, Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/Store';

export default function VendorHeader() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name || 'Vendor Name'}</p>
            <p className="text-xs text-indigo-600 font-medium capitalize">{user?.role || 'Vendor'}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-50 transition-transform hover:scale-105 cursor-pointer">
            {user?.name?.[0]?.toUpperCase() || 'V'}
          </div>
        </div>
      </div>
    </header>
  );
}
