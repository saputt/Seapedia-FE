import { VTLink as Link } from "../../../shared/utils/VTLink";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-3 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-[2.75rem] md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.2] tracking-tight">
            Belanja Kebutuhan
            <span className="text-brand-deep"> Sehari-hari</span>
            <br />
            dengan Mudah
          </h1>
          <p className="mt-5 text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl">
            Temukan berbagai produk kebutuhanmu dari toko terpercaya.
            Belanja cepat, aman, dan nyaman hanya di SEAPEDIA.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link to="/auth/register" className="btn-primary text-base !py-3 !px-8">
              Mulai Belanja
            </Link>
            <Link to="/" className="btn-ghost text-base !py-3 !px-8">
              Lihat Produk
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-subtle rounded-full opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-subtle rounded-full opacity-30 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
