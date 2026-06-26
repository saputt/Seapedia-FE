import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-deep text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-extrabold text-xl tracking-tight mb-2">SEAPEDIA</h3>
            <p className="text-brand-subtle text-sm leading-relaxed">
              Platform belanja online terpercaya. Temukan kebutuhanmu dengan mudah dan cepat.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-3">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-brand-subtle text-sm hover:text-white transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-brand-subtle text-sm hover:text-white transition-colors">
                  Tentang Kita
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-brand-subtle text-sm hover:text-white transition-colors">
                  Toko
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="text-brand-subtle text-sm hover:text-white transition-colors">
                  Masuk
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-3">Kontak</h4>
            <ul className="space-y-2">
              <li className="text-brand-subtle text-sm">support@seapedia.id</li>
              <li className="text-brand-subtle text-sm">021-1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-mid mt-8 pt-6 text-center">
          <p className="text-brand-subtle text-xs">
            &copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
