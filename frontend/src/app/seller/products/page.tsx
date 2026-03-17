'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Sparkles, 
  Loader2, 
  X, 
  Package,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUpload from '@/components/ui/ImageUpload';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    inventoryCount: 0,
    category: 'Electronics',
    description: '',
    images: [] as string[],
    badges: [] as string[]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/vendor/my-products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateAIDescription = async () => {
    if (!formData.title) {
      alert("Please enter a product title first!");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/ai/generate-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.title, category: formData.category })
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, description: data.description });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/vendor/my-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', price: '', inventoryCount: 0, category: 'Electronics', description: '', images: [], badges: [] });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Product Management</h1>
            <p className="text-sm text-gray-500 font-medium">Add, edit and manage your store products with AI power</p>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95"
         >
           <Plus className="w-5 h-5" /> Add New Product
         </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col">
         {/* Filters & Search */}
         <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl w-full md:w-96 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-xs">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search products by title or SKU..." className="bg-transparent border-none outline-hidden text-sm w-full font-bold text-gray-800 placeholder:text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest hidden md:block">Filter by</span>
               <select className="flex-1 md:flex-none bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-600 outline-hidden hover:border-gray-200 transition-colors cursor-pointer">
                 <option>All Status</option>
                 <option>Approved</option>
                 <option>Pending</option>
                 <option>Rejected</option>
               </select>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5">Product Details</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5">Inventory</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6 flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl"></div>
                        <div className="h-4 bg-gray-100 rounded w-48"></div>
                      </td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-12"></div></td>
                      <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-full w-24"></div></td>
                      <td className="px-8 py-6"><div className="h-8 bg-gray-100 rounded w-16 float-right"></div></td>
                    </tr>
                  ))
                ) : products.length > 0 ? (
                  products.map((product: any) => (
                    <tr key={product._id} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                      <td className="px-8 py-6 flex items-center gap-5">
                        <div className="relative w-16 h-16 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 shadow-xs group-hover:scale-105 transition-transform">
                           {product.images?.[0] ? (
                             <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-200"><Package size={24} /></div>
                           )}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{product.title}</span>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-gray-900">${product.price.toFixed(2)}</td>
                      <td className="px-8 py-6 font-bold text-gray-600">{product.inventoryCount} units</td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          product.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          product.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {product.status === 'approved' && <CheckCircle2 size={10} />}
                          {product.status === 'pending' && <Loader2 size={10} className="animate-spin" />}
                          {product.status === 'rejected' && <AlertCircle size={10} />}
                          {product.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="text-gray-400 hover:text-indigo-600 p-2.5 bg-gray-50 hover:bg-white rounded-xl border border-transparent hover:border-indigo-100 shadow-xs transition-all"><Edit className="w-4 h-4" /></button>
                           <button className="text-gray-400 hover:text-rose-600 p-2.5 bg-gray-50 hover:bg-white rounded-xl border border-transparent hover:border-rose-100 shadow-xs transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                             <Package size={40} />
                          </div>
                          <p className="text-lg font-black text-gray-900 uppercase tracking-tight">No products found</p>
                          <p className="text-sm text-gray-400 font-medium">Click "Add New Product" to start selling!</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-500">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-10 py-8 border-b border-gray-100 flex items-center justify-between z-10">
               <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Create Listing</h2>
                  <p className="text-sm text-gray-400 font-medium">Craft your product masterpiece</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <X />
               </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Left Column: Media */}
                 <div className="space-y-6">
                    <ImageUpload 
                      value={formData.images[0] || ''} 
                      onChange={(url) => setFormData({ ...formData, images: [url] })} 
                    />
                    
                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 space-y-4">
                       <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles size={14} /> AI Magic Dashboard
                       </h4>
                       <p className="text-xs text-indigo-400 font-medium leading-relaxed">
                          Generate high-converting, SEO-optimized descriptions automatically using LinkStore's advanced AI engine.
                       </p>
                       <button 
                         type="button"
                         onClick={generateAIDescription}
                         disabled={aiLoading}
                         className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} 
                         {aiLoading ? "Thinking..." : "Generate AI Description"}
                       </button>
                    </div>
                 </div>

                 {/* Right Column: Info */}
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Product Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden transition-all" 
                        placeholder="e.g. Sony WH-1000XM5 Noise Cancelling Headphones" 
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Price ($)</label>
                         <input 
                           type="number" 
                           value={formData.price}
                           onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden transition-all" 
                           placeholder="0.00" 
                           required
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Inventory</label>
                         <input 
                           type="number" 
                           value={formData.inventoryCount}
                           onChange={(e) => setFormData({ ...formData, inventoryCount: parseInt(e.target.value) })}
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden transition-all" 
                           placeholder="0" 
                           required
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-hidden transition-all cursor-pointer"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home & Lifestyle</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full bg-gray-50 border border-gray-100 rounded-[24px] px-6 py-4 text-sm font-medium text-gray-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden transition-all resize-none" 
                        placeholder="Detail your product's best features..."
                        required
                      />
                    </div>
                 </div>
               </div>

               <div className="flex justify-end gap-5 pt-8 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-gray-900 text-white px-12 py-4 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {submitting ? "Processing..." : "Finish & Publish"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Save(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
  );
}
