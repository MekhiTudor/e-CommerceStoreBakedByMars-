import { useState, useEffect } from "react";
import CookieCard from "../Components/CookieCard";

export const FlavorsPage = () => {
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace this URL with your actual backend API endpoint
  const backendUrl = "http://127.0.0.1:8000/api/get_products/";

  useEffect(() => {
    const fetchFlavors = async () => {
      try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch flavors");
        }
        const data = await response.json();
        setFlavors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlavors();
  }, []);
  console.log(flavors);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Our Flavors</h1>

      {loading && <p className="text-center">Loading flavors...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {flavors.map((flavor) => (
          <CookieCard key={flavor.id} {...flavor} />
        ))}
      </div>
    </div>
  );
};
