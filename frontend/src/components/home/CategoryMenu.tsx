import Link from 'next/link';

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'}/public/categories`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [{ id: 'all', name: 'All Categories' }];
  }
}

export default async function CategoryMenu() {
  const categories = await getCategories();

  return (
    <div className="bg-white border-b border-gray-100 hidden md:block">

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <ul className="flex items-center gap-8 h-12 overflow-x-auto hide-scrollbar">
          {categories.map((cat: { id: string; name: string }) => (
            <li key={cat.id} className="shrink-0">
              <Link 
                href={`/search?category=${cat.id}`} 
                className="px-5 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-bold text-gray-600 uppercase tracking-tight block"
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

