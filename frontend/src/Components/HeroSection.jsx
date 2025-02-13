"use client";

import { useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSection = ({ title, description, media }) => {
  const [sliderRef, setSliderRef] = useState(null);

  const settings = {
    dots: false,
    infinite: true, // Enable infinite scrolling
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // Autoplay the carousel
    autoplaySpeed: 5000, // Slide every 5 seconds
    pauseOnHover: false, // Keep autoplaying when hovering
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Slider ref={(slider) => setSliderRef(slider)} {...settings}>
        {media.map((item, index) => (
          <div key={index} className="h-screen w-full">
            {item.type === "image" ? (
              <img
                src={item.src || "/placeholder.svg"}
                onError={(e) => (e.target.src = "/placeholder.svg")}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                src={item.src}
                onError={(e) => console.error("Video failed to load", e)}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </Slider>

      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">{title}</h1>
          <p className="mb-8 text-lg md:text-xl">{description}</p>
          <button className="rounded-full bg-white px-6 py-2 text-black transition-colors hover:bg-gray-200">
            Learn More
          </button>
        </div>
      </div>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-black opacity-75 transition-opacity hover:opacity-100"
        onClick={() => sliderRef?.slickPrev()}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-black opacity-75 transition-opacity hover:opacity-100"
        onClick={() => sliderRef?.slickNext()}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default HeroSection;
