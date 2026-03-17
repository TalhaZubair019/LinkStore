import Link from "next/link";
import { ChevronRight, SearchX } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/layout/FilterSidebar";
import SortSelect from "@/components/layout/SortSelect";

async function getSearchResults(searchParams: any) {
  const { q, category, minPrice, maxPrice, sort, page } = searchParams;
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/public/products/search/all`);
  
  if (q) url.searchParams.set('q', q);
  if (category) url.searchParams.set('category', category);
  if (minPrice) url.searchParams.set('minPrice', minPrice);
  if (maxPrice) url.searchParams.set('maxPrice', maxPrice);
  if (sort) url.searchParams.set('sort', sort);
  if (page) url.searchParams.set('page', page);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('Failed to fetch search results');
    return res.json();
  } catch (err) {
    console.error(err);
    return { products: [], total: 0, pages: 0 };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/public/categories`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const { products, total } = await getSearchResults(searchParams);
  const categories = await getCategories();
  const query = searchParams.q || "";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900">Search Results</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar categories={categories} />

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    {query ? `Results for "${query}"` : "All Products"}
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">Found {total} products in LinkStore</p>
               </div>
               
               {/* Sort Select */}
               <div className="hidden md:block">
                  <SortSelect />
               </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] p-16 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                  <SearchX size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">No matching products</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
                  We couldn't find anything matching your search. Try adjusting your filters or search terms.
                </p>
                <Link 
                  href="/search" 
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
