import React, { useState, useEffect, useRef, useCallback } from "react";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  gradient: string;
  icon?: React.ReactNode;
}

interface PromoBannerCarouselProps {
  banners: BannerItem[];
  autoPlayInterval?: number;
}

const PromoBannerCarousel: React.FC<PromoBannerCarouselProps> = ({
  banners,
  autoPlayInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, autoPlayInterval, banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  if (banners.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full shrink-0 ${banner.gradient} border-[3px] border-brand-deep shadow-[6px_6px_0_0_var(--color-brand-deep)]`}
          >
            <div className="flex items-center justify-between px-8 py-10 sm:px-14 sm:py-14">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-3xl font-bold text-brand-deep truncate">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-base sm:text-lg text-brand-deep/80 mt-2 truncate">
                    {banner.subtitle}
                  </p>
                )}
              </div>
              {banner.icon && (
                <div className="shrink-0 ml-6 text-brand-deep/60">
                  {banner.icon}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 border-[2px] border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 border-[2px] border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                index === currentIndex
                  ? "bg-brand-deep w-7"
                  : "bg-brand-deep/30 hover:bg-brand-deep/50 w-2.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoBannerCarousel;
