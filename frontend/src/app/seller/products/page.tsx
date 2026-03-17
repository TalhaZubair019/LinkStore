'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUpload from '@/components/ui/ImageUpload';


const dummyProducts = [
  { id: 1, title: 'Modern Ceramic Vase', price: 45.00, stock: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=100&auto=format&fit=crop' },
  { id: 2, title: 'Gold Hoop Earrings', price: 24.50, stock: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=100&auto=format&fit=crop' },
  { id: 3, title: 'Decorative Art Pitcher', price: 38.00, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=100&auto=format&fit=crop' },
];

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');


  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Products</h1>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
         >
           <Plus className="w-5 h-5" /> Add New Product
         </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
         <div className="p-4 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg w-96 focus-within:border-indigo-500 transition-colors">
             <Search className="w-4 h-4 text-gray-400" />
             <input type="text" placeholder="Search products..." className="bg-transparent border-none outline-hidden text-sm w-full" />
           </div>
           
           <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-hidden focus:border-indigo-500">
             <option>All Status</option>
             <option>Active</option>
             <option>Draft</option>
             <option>Out of Stock</option>
           </select>
         </div>

         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm text-gray-600">
             <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold border-b border-gray-100">
               <tr>
                 <th className="px-6 py-4">Product</th>
                 <th className="px-6 py-4">Price</th>
                 <th className="px-6 py-4">Stock</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {dummyProducts.map((product) => (
                 <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                   <td className="px-6 py-4 flex items-center gap-4">
                     <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden">
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                     </div>
                     <span className="font-bold text-gray-900">{product.title}</span>
                   </td>
                   <td className="px-6 py-4 font-bold text-gray-900">${product.price.toFixed(2)}</td>
                   <td className="px-6 py-4">{product.stock}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       {product.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right flex justify-end gap-2">
                     <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-md transition-colors"><Edit className="w-4 h-4" /></button>
                     <button className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      {/* Add Product Modal (Simplified) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
            <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Add New Product</h2>
            
            <form className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Product Title</label>
                   <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-hidden focus:border-indigo-500" placeholder="e.g. Vintage Leather Bag" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                   <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-hidden focus:border-indigo-500" placeholder="0.00" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Stock Inventory</label>
                   <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-hidden focus:border-indigo-500" placeholder="0" />
                 </div>
                 <div className="col-span-2">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Variants (Comma separated)</label>
                   <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-hidden focus:border-indigo-500" placeholder="e.g. Red, Blue, Green" />
                 </div>
                 <div className="col-span-2">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                   <select className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-hidden focus:border-indigo-500">
                     <option>Electronics</option>
                     <option>Fashion</option>
                     <option>Home</option>
                   </select>
                 </div>
               </div>

               <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cancel</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-indigo-600 text-white px-8 py-2.5 font-bold rounded-lg hover:bg-indigo-700">Save Product</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
