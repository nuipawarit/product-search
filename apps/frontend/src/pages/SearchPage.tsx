import React, { useState, useEffect } from "react";
import { searchProducts, Product } from "../services/api";
import MobileMenu from "../components/MobileMenu";
import ProductSkeleton from "../components/ProductSkeleton";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true);
      try {
        const list = await searchProducts("");
        setProducts(list);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadAllProducts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const list = await searchProducts(query);
      setProducts(list);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              Product Search
            </h1>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="hidden sm:block text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap"
              >
                Logout
              </button>
              <MobileMenu onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

              <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 sm:mb-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative bg-white rounded-lg shadow-sm">
                <input
                  type="text"
                  className="w-full pl-3 sm:pl-4 pr-16 sm:pr-20 py-2.5 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base lg:text-lg"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bg-blue-600 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-xs sm:text-sm"
                  disabled={loading}
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>
            </form>
          </div>

                  {error && (
            <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base">
              {error}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          )}

                  {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-36 sm:h-40 lg:h-48 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://placehold.co/400x300?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-36 sm:h-40 lg:h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-4 min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-2">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                          {product.name}
                        </h3>
                        {product.category && (
                          <span className="self-start px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                            {product.category}
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 flex-1">
                          {product.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500">
                          ${product.price ?? "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <div className="text-gray-400 mb-3 sm:mb-4">
                    <svg
                      className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base px-4">
                    Try adjusting your search terms or browse all products.
                  </p>
                </div>
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default SearchPage;
