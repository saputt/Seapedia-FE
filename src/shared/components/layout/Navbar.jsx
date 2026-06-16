const Navbar = () => {
  return (
    <nav className="bg-bg-primary border-b-[3px] border-brand-deep h-16 px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="text-brand-deep font-extrabold text-2xl tracking-tight">
            SEAPEDIA
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/products" className="text-text-secondary font-medium hover:text-brand-deep transition-colors">
              Produk
            </a>
            <a href="/stores" className="text-text-secondary font-medium hover:text-brand-deep transition-colors">
              Toko
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/auth/login" className="btn-ghost text-sm !py-2 !px-5">
            Masuk
          </a>
          <a href="/auth/register" className="btn-primary text-sm !py-2 !px-5">
            Daftar
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
