import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-brand-deep font-extrabold text-2xl tracking-tight">
            SEAPEDIA
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-text-secondary font-medium hover:text-brand-deep transition-colors">
              Produk
            </Link>
            <Link to="/stores" className="text-text-secondary font-medium hover:text-brand-deep transition-colors">
              Toko
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth/login" className="btn-ghost text-sm !py-2 !px-5">
            Masuk
          </Link>
          <Link to="/auth/register" className="btn-primary text-sm !py-2 !px-5">
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
