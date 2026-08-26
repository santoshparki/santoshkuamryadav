"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  url: string;
  caption?: string | null;
};

type ProjectGalleryProps = {
  images: GalleryImage[];
  title: string;
};

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const galleryImages = images.length > 0 ? images : [{ url: "/placeholder-project.jpg", caption: title }];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];
  const hasMultipleImages = galleryImages.length > 1;

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[320px] w-full overflow-hidden rounded-[28px] bg-[#07101b] sm:h-[420px] lg:h-[520px]">
        <Image
          src={activeImage.url}
          alt={activeImage.caption ?? title}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 920px"
        />
        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Show previous project image"
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xl text-white transition hover:bg-black/80"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Show next project image"
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xl text-white transition hover:bg-black/80"
            >
              <span aria-hidden="true">→</span>
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Project image gallery">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show project image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative h-24 overflow-hidden rounded-2xl border transition sm:h-28 ${activeIndex === index ? "border-cyan-300 ring-2 ring-cyan-300/40" : "border-white/10 hover:border-cyan-300/50"}`}
            >
              <Image
                src={image.url}
                alt={image.caption ?? `${title} image ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 240px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
