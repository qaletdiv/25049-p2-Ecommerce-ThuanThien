"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const arrowClass =
  "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-foreground shadow transition-opacity hover:bg-white md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100";

// Large image with a column of thumbnails on its left; clicking a thumbnail swaps the large image.
// Hovering the large image zooms in where the mouse is. Products with several images also get prev/next arrows.
export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  // Zoom origin in percent of the image box, follows the mouse.
  const [origin, setOrigin] = useState("50% 50%");

  const hasMany = images.length > 1;
  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i + 1) % images.length);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="flex gap-3">
      {/* Thumbnails in a column on the left; only shown when there is more than one image. */}
      {hasMany && (
        <ul className="flex w-16 shrink-0 flex-col gap-2 md:w-20">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === current}
                onClick={() => setCurrent(i)}
                className={`relative block aspect-square w-full bg-surface ${
                  i === current ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="group relative aspect-[3/4] min-w-0 flex-1 overflow-hidden bg-surface">
        <div
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            src={images[current]}
            alt={hasMany ? `${title} (ảnh ${current + 1}/${images.length})` : title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ transformOrigin: origin }}
            className={`object-cover transition-transform duration-200 ${zoomed ? "scale-200" : "scale-100"}`}
          />
        </div>

        {hasMany && (
          <>
            <button type="button" onClick={prev} aria-label="Ảnh trước" className={`${arrowClass} left-3`}>
              <ChevronLeft size={22} />
            </button>
            <button type="button" onClick={next} aria-label="Ảnh sau" className={`${arrowClass} right-3`}>
              <ChevronRight size={22} />
            </button>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-0.5 text-xs text-white">
              {current + 1} / {images.length}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
