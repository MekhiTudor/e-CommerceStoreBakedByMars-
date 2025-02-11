import { HeroSection } from "../Components/HeroSection";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <HeroSection />
      <p>{isAuthenticated ? "User is logged in" : "User is NOT logged in"}</p>
    </>
  );
};
