import { useState, useEffect } from "react";

export function PurchasePage() {
  const [boxSize, setBoxSize] = useState(6); // Default box size
  const [selectedCookies, setSelectedCookies] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_products/") // Change to your actual API URL
      .then((response) => response.json())
      .then((data) => {
        setCookies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cookies:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading cookies...</p>;
  }

  const handleBoxSizeChange = (event) => {
    setBoxSize(Number(event.target.value));
    setSelectedCookies([]); // Reset selection when changing box size
  };

  const handleSelectCookie = (cookie) => {
    if (selectedCookies.length < boxSize) {
      setSelectedCookies([...selectedCookies, cookie]);
    }
  };

  const handleRemoveCookie = (index) => {
    const newSelection = [...selectedCookies];
    newSelection.splice(index, 1);
    setSelectedCookies(newSelection);
  };

  const isBoxFull = selectedCookies.length === boxSize;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Build Your Cookie Box</h2>

      {/* Box Size Selector */}
      <label className="block mb-2">Select Box Size:</label>
      <select
        value={boxSize}
        onChange={handleBoxSizeChange}
        className="border p-2 rounded mb-4"
      >
        <option value={6}>Half Dozen (6)</option>
        <option value={8}>8 Pack</option>
        <option value={12}>Full Dozen (12)</option>
      </select>

      {/* Selection Counter */}
      <p className="font-semibold">
        Selected: {selectedCookies.length}/{boxSize}
      </p>

      {/* Available Cookies List */}
      <h3 className="mt-4 font-semibold">Select Cookies:</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {cookies.map((cookie) => (
          <div
            key={cookie.id}
            className="border p-2 rounded bg-gray-100 hover:bg-gray-300 cursor-pointer"
            onClick={() => handleSelectCookie(cookie)}
            disabled={isBoxFull}
          >
            <img
              src={`http://127.0.0.1:8000/media/${cookie.image}`} // Use full URL
              alt={cookie.name}
              className="w-full h-32 object-cover rounded"
              height={100}
              width={100}
            />
            <p className="text-center mt-2">{cookie.name}</p>
          </div>
        ))}
      </div>

      {/* Selected Cookies */}
      <h3 className="mt-4 font-semibold">Your Box:</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedCookies.map((cookie, index) => (
          <div
            key={index}
            className="border p-2 rounded bg-blue-100 flex items-center"
          >
            <img
              src={`http://127.0.0.1:8000/media/${cookie.image}`} // Use full URL
              alt={cookie.name}
              className="w-10 h-10 object-cover rounded-full"
              height={100}
              width={100}
            />
            <p className="ml-2">{cookie.name}</p>
            <button
              className="ml-2 text-red-500"
              onClick={() => handleRemoveCookie(index)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* Add to Cart Button */}
      <button
        className={`mt-4 p-2 rounded w-full ${
          isBoxFull
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        disabled={!isBoxFull}
      >
        Add to Cart
      </button>
    </div>
  );
}
