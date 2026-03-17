import Image from "next/image";
import Link from "next/link";
import {
  Store,
  MapPin,
  Truck,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import SearchBar from "@/components/layout/SearchBar";
import ProductReviews from "@/components/products/ProductReviews";
import PDPClient from "@/components/products/PDPClient";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/public/products/${id}`, {
      next: { revalidate: 30 } // Revalidate every 30 seconds
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="text-indigo-600 font-bold hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 pb-20">
      {/* 1. Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center gap-6 lg:gap-12">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              L
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase hidden sm:block">
              LinkStore
            </span>
          </Link>
          <SearchBar />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-10">
        {/* Breadcrumbs */}
        <div className="mb-10 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900">{product.category || "Product"}</span>
        </div>

        {/* Main Product Section (Interactive Client Component) */}
        <PDPClient product={product} />

        {/* Store & Shipping Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Store Badge */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group">
             <div className="flex items-center gap-6">
               <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                  {product.storeId?.logoUrl ? (
                    <Image src={product.storeId.logoUrl} alt={product.storeId.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-black text-2xl">
                       {product.storeId?.name?.[0] || "S"}
                    </div>
                  )}
               </div>
               <div>
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 block">Verified Vendor</span>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">{product.storeId?.name || "Official Store"}</h3>
                 <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                      <ShieldCheck size={14} /> 98% Positive Feedback
                    </div>
                 </div>
               </div>
             </div>
             
             <Link 
               href={`/shop/${product.storeId?.slug || "#"}`}
               className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200"
             >
               Visit Store
             </Link>
          </div>

          {/* Shipping Info Side Card */}
          <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-500/30 flex flex-col justify-center gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Global Shipping</p>
                   <p className="text-lg font-black">Free Delivery Available</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Location</p>
                   <p className="text-lg font-black">International Warehouse</p>
                </div>
             </div>
          </div>
        </div>

        {/* Description & Specifications */}
        <div className="mt-20">
           <div className="flex items-center gap-12 border-b border-gray-100 mb-10">
              <button className="pb-4 text-sm font-black text-gray-900 border-b-2 border-indigo-600 uppercase tracking-widest">
                Product Specifications
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
              {/* Dynamic specs could go here if available, using dummy defaults for visual completeness */}
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Brand</span>
                <span className="text-sm font-black text-gray-900 underline decoration-indigo-500/30 decoration-4 underline-offset-4">Premium Selection</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Condition</span>
                <span className="text-sm font-black text-gray-900">Brand New</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Warranty</span>
                <span className="text-sm font-black text-gray-900">2 Year Official</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">In Stock</span>
                <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Available</span>
              </div>
           </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32">
          <ProductReviews productId={id} />
        </div>
      </main>
    </div>
  );
}
