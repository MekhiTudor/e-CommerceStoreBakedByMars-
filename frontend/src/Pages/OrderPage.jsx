import React, { useState, useEffect } from "react";
import { Search, User, ShoppingCart, Star, X, Plus, Minus } from "lucide-react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";

function Page() {
  const [boxSize, setBoxSize] = useState(6);
  const [selectedCookies, setSelectedCookies] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_products/")
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

  const handleBoxSizeChange = (event) => {
    setBoxSize(Number(event.target.value));
    setSelectedCookies([]);
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
  const lastAddedCookie = selectedCookies[selectedCookies.length - 1];

  return (
    <div className="min-h-screen bg-[#FDF5ED]">
      {/* Top Banner */}
      <div className="relative bg-primary text-white py-2 text-center">
        <p className="font-medium">
          Handcrafted cookies delivered FRESH to your door
        </p>
        <button className="absolute right-4 top-1/2 -translate-y-1/2">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <header className="bg-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Button variant="contained" color="primary">
            SHOP
          </Button>
          <Button variant="outlined" color="secondary">
            <Link to="/">Home</Link>
          </Button>
          <Button variant="outlined" color="secondary">
            SUBSCRIBE
          </Button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1
            className="text-4xl font-bold text-primary"
            style={{ fontFamily: "cursive" }}
          >
            Baked By Mars
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outlined" color="secondary" size="small">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outlined" color="secondary" size="small">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="outlined" color="secondary" size="small">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden bg-[#F5E6D3] p-8">
          {lastAddedCookie ? (
            <img
              src={`http://127.0.0.1:8000/media/${lastAddedCookie.image}`}
              alt={lastAddedCookie.name}
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            <p className="text-center">
              Select a cookie to see its image here!
            </p>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold mb-4">Build Your Cookie Box</h2>
          <FormControl fullWidth>
            <InputLabel id="box-size-label">Box Size</InputLabel>
            <Select
              labelId="box-size-label"
              id="box-size-select"
              value={boxSize}
              onChange={handleBoxSizeChange}
            >
              <MenuItem value={6}>Half Dozen (6)</MenuItem>
              <MenuItem value={8}>8 Pack</MenuItem>
              <MenuItem value={12}>Full Dozen (12)</MenuItem>
            </Select>
          </FormControl>

          <p className="font-semibold">
            Selected: {selectedCookies.length}/{boxSize}
          </p>
          <h3 className="mt-4 font-semibold">Select Cookies:</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {cookies.map((cookie) => (
              <div
                key={cookie.id}
                className="border p-2 rounded bg-gray-100 hover:bg-gray-300 cursor-pointer"
                onClick={() => handleSelectCookie(cookie)}
              >
                <img
                  src={`http://127.0.0.1:8000/media/${cookie.image}`}
                  alt={cookie.name}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-center mt-2">{cookie.name}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-4 font-semibold">Your Box:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCookies.map((cookie, index) => (
              <div
                key={index}
                className="border p-2 rounded bg-blue-100 flex items-center"
              >
                <img
                  src={`http://127.0.0.1:8000/media/${cookie.image}`}
                  alt={cookie.name}
                  className="w-10 h-10 object-cover rounded-full"
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

          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isBoxFull}
          >
            Add to Cart
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Page;
