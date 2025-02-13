import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { X } from "lucide-react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { addToCart } from "../Helpers/AddToCart";
import { NavBar } from "../Components/NavBar";

function OrderPage() {
  const [boxSize, setBoxSize] = useState(6);
  const [selectedCookies, setSelectedCookies] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, csrfToken, getCsrfToken } = useContext(AuthContext);
  const [bgColor, setBgColor] = useState("#FDEED9");
  const [lastAddedCookie, setLastAddedCookie] = useState(null); // Added state for lastAddedCookie
  const nav = useNavigate();

  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/get_products/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCookies(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCookies();
  }, []);

  const handleBoxSizeChange = (event) => {
    setBoxSize(Number.parseInt(event.target.value, 10));
    setSelectedCookies([]);
  };

  const handleSelectCookie = (cookie) => {
    if (selectedCookies.length < boxSize) {
      setSelectedCookies([...selectedCookies, cookie]);
      setLastAddedCookie(cookie); // Update lastAddedCookie
    }
  };

  const handleRemoveCookie = (index) => {
    setSelectedCookies(selectedCookies.filter((_, i) => i !== index));
  };

  const isBoxFull = selectedCookies.length === boxSize;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Handle authentication
      return;
    }

    try {
      console.log("selected Cookies:", selectedCookies);
      await getCsrfToken();
      await addToCart(selectedCookies, boxSize, csrfToken, getCsrfToken);
      nav("/cart");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      {/* Navigation */}
      <NavBar />

      <div
        className={`ml-[100px] min-h-screen transition-colors duration-500 ease-in-out`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Top Banner */}
        <div className="relative bg-[#E34989] text-white py-3 text-center">
          <p className="font-medium text-lg">
            Handcrafted cookies delivered FRESH to your door
          </p>
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-3xl overflow-hidden bg-[#A98360] p-8 shadow-lg">
            <h2>{lastAddedCookie?.name}</h2>
            {lastAddedCookie ? (
              <img
                src={`http://127.0.0.1:8000/media/${lastAddedCookie.image}`}
                alt={lastAddedCookie.name}
                className="w-150 h-150 object-cover rounded-full shadow-inner"
              />
            ) : (
              <div className="flex justify-center h-80 w-80">
                <p className="ml-[150px] text-center text-white text-xl font-semibold">
                  Select a cookie to see its image here!
                </p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <h2 className="text-5xl font-bold mb-6 text-[#573C27]">
              Build Your Cookie Box
            </h2>
            <FormControl fullWidth className="bg-white rounded-lg shadow-md">
              <InputLabel id="box-size-label">Box Size</InputLabel>
              <Select
                labelId="box-size-label"
                id="box-size-select"
                value={boxSize}
                onChange={handleBoxSizeChange}
                className="rounded-lg"
              >
                <MenuItem value={6}>Half Dozen (6)</MenuItem>
                <MenuItem value={8}>8 Pack</MenuItem>
                <MenuItem value={12}>Full Dozen (12)</MenuItem>
              </Select>
            </FormControl>

            <p className="font-semibold text-lg text-[#573C27]">
              Selected: {selectedCookies.length}/{boxSize}
            </p>
            <h3 className="mt-6 font-semibold text-2xl text-[#573C27]">
              Select Cookies:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {cookies.map((cookie) => (
                <div
                  key={cookie.id}
                  className="border-2 border-[#A98360] p-3 rounded-xl bg-white hover:bg-[#FFADC6] cursor-pointer transition-all duration-300 shadow-md"
                  onClick={() => {
                    handleSelectCookie(cookie);
                    setBgColor(cookie.color || "#FDEED9");
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000/media/${cookie.image}`}
                    alt={cookie.name}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <p className="text-center mt-2 font-medium text-[#573C27]">
                    {cookie.name}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-6 font-semibold text-2xl text-[#573C27]">
              Your Box:
            </h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {selectedCookies.map((cookie, index) => (
                <div
                  key={index}
                  className="border-2 border-[#E34989] p-2 rounded-lg bg-white flex items-center shadow-sm"
                >
                  <img
                    src={`http://127.0.0.1:8000/media/${cookie.image}`}
                    alt={cookie.name}
                    className="w-12 h-12 object-cover rounded-full shadow-sm"
                  />
                  <p className="ml-2 font-medium text-[#573C27]">
                    {cookie.name}
                  </p>
                  <button
                    className="ml-2 text-[#E34989] hover:text-red-600 transition-colors"
                    onClick={() => handleRemoveCookie(index)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              variant="contained"
              fullWidth
              disabled={!isBoxFull}
              onClick={handleAddToCart}
              className="mt-8 bg-[#E34989] hover:bg-[#FFADC6] text-white font-bold py-3 rounded-lg text-lg transition-colors"
            >
              Add to Cart
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}

export default OrderPage;
