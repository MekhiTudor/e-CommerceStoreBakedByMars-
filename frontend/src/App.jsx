import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { HomePage } from "./Pages/homePage";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/registerPage";
import { FlavorsPage } from "./Pages/flavorsPage";
import { PurchasePage } from "./Pages/PurchasePage";
import { ShoppingCartPage } from "./Pages/ShoppingCartPage";
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/flavors" element={<FlavorsPage />}></Route>
        <Route path="/purchase" element={<PurchasePage />}></Route>
        <Route path="/cart" element={<ShoppingCartPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
