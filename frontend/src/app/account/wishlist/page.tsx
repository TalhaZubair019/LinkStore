"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromWishlist } from "@/redux/slices/WishlistSlice";
import { addToCart } from "@/redux/slices/CartSlice";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowLeft,
  Search
} from "lucide-react";

export default function WishlistPage() {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: 1,
      image: item.image,
      storeId: "unknown" // In a real app, item would have storeId
    }));
    dispatch(removeFromWishlist(item.productId));
    alert("Added to cart!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
              <p className="text-sm text-gray-500 font-medium">Items you've saved for later</p>
           </div>
           <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-all" /> Back to Dashboard
           </Link>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.productId} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group flex flex-col">
               <Link href={`/product/${item.productId}`} className="relative h-64 bg-gray-50 overflow-hidden block">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <Heart size={48} />
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.productId);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
               </Link>

               <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-black text-gray-900 mb-2 line-clamp-2 min-h-12">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                     <p className="text-xl font-black text-indigo-600">${item.price.toFixed(2)}</p>
                     <button 
                       onClick={() => handleAddToCart(item)}
                       className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200"
                       title="Add to Cart"
                     >
                       <ShoppingCart size={20} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-20 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
           <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-200 mb-6">
              <Heart size={48} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
           <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
              Save items you love and they'll appear here. Don't let your favorites slip away!
           </p>
           <Link 
              href="/search" 
              className="px-10 py-4 bg-gray-900 text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2"
           >
              <Search size={18} /> Explore Products
           </Link>
        </div>
      )}
    </div>
  );
}
