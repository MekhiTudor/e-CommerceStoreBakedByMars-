import React, { useState, useEffect } from "react";
import { NavBar } from "./NavBar";

const images = [
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen">
      <NavBar />
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
        Welcome to Our Store!
      </div>
    </div>
  );
};
