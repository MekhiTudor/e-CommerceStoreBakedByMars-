import HeroSection from "../Components/HeroSection";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { NavBar } from "../Components/NavBar";

export const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <NavBar />

      <div className="relative w-[1720px] flex justify-center items-center">
        <img
          src="http://127.0.0.1:8000/media/uploads/product/IMG_1218.jpg" // Replace with your actual image path
          alt="Welcome Background"
          className="w-full h-[900px] object-cover"
        />
        <h1
          className="absolute text-4xl font-bold text-[#FDEED9] drop-shadow-lg"
          style={{ fontFamily: "Bagel Fat One" }}
        >
          W E L C O M E!
        </h1>
      </div>
      {/* <p>{isAuthenticated ? "User is logged in" : "User is NOT logged in"}</p> */}
    </>
  );
};
