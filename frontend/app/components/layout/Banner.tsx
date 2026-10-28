"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const banners = [
  "/images/banner.png",
  "/images/banner2.png",
  "/images/banner3.png",
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  // Tự động chuyển ảnh sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full">
      <div className="group relative aspect-[3/1] w-full overflow-hidden bg-gray-100">

        {/* Ảnh banner */}
        {banners.map((banner, index) => (
          <Image
            key={banner}
            src={banner}
            alt={`Ảnh quảng cáo ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`
              object-cover
              transition-all
              duration-700
              ${
                current === index
                  ? "scale-100 opacity-100"
                  : "scale-105 opacity-0"
              }
            `}
          />
        ))}

        {/* Mũi tên trái */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Ảnh trước"
          className="
            absolute left-4 top-1/2 z-20
            -translate-y-1/2
            rounded-full
            bg-black/30 p-3
            text-white
            opacity-0
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-110
            hover:bg-white
            hover:text-black
            group-hover:opacity-100
          "
        >
          <ChevronLeft size={26} />
        </button>

        {/* Mũi tên phải */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Ảnh sau"
          className="
            absolute right-4 top-1/2 z-20
            -translate-y-1/2
            rounded-full
            bg-black/30 p-3
            text-white
            opacity-0
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-110
            hover:bg-white
            hover:text-black
            group-hover:opacity-100
          "
        >
          <ChevronRight size={26} />
        </button>

        {/* Chấm chuyển slide */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Xem ảnh quảng cáo ${index + 1}`}
              className={`
                h-2 rounded-full
                transition-all
                duration-300
                ${
                  current === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}