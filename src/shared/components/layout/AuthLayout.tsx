import { useState, useEffect, useCallback } from "react";
import { VTLink as Link } from "../../utils/VTLink";

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

const QUOTES = [
  {
    text: "Belanja mudah, hidup lebih ringan.",
    sub: "Temukan ribuan produk favoritmu di satu tempat.",
  },
  {
    text: "Kualitas terbaik, harga terjangkau.",
    sub: "Kepuasanmu adalah prioritas kami.",
  },
  {
    text: "Dari rumah ke rumah, dengan penuh percaya.",
    sub: "Pengiriman aman dan cepat ke seluruh Indonesia.",
  },
];

const AuthLayout = ({ children, subtitle }: AuthLayoutProps) => {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - quotes */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="350" cy="50" r="120" fill="white" />
            <circle cx="50" cy="350" r="80" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <Link to="/" className="text-white font-extrabold text-4xl tracking-tight mb-16">
            SEAPEDIA
          </Link>

          <div className="relative w-full max-w-md h-32">
            {QUOTES.map((quote, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ease-in-out flex flex-col items-center text-center ${
                  index === current
                    ? "opacity-100 translate-y-0"
                    : index < current
                    ? "opacity-0 -translate-y-4"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <p className="text-white text-2xl font-bold leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="text-white/70 text-base mt-3">
                  {quote.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5 mt-12">
            {QUOTES.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`rounded-full transition-all cursor-pointer ${
                  index === current
                    ? "w-7 h-3 bg-white"
                    : "w-3 h-3 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center bg-bg-secondary px-4 py-10 lg:py-0">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="text-brand-deep font-extrabold text-3xl tracking-tight">
              SEAPEDIA
            </Link>
            {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
