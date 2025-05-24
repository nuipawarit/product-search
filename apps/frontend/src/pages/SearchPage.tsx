import React, { useState } from "react";
import { searchProducts, Product } from "../services/api";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Search Products</h2>
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          className="flex-grow border border-gray-300 p-2 rounded-l"
          placeholder="Enter product name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ul className="space-y-4">
        {products.length > 0
          ? products.map((p) => (
              <li
                key={p.id}
                className="p-4 border border-gray-200 rounded hover:shadow"
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-600">Price: ${p.price}</p>
              </li>
            ))
          : !loading && <li className="text-gray-500">No products found.</li>}
      </ul>
    </div>
  );
};

export default SearchPage;
