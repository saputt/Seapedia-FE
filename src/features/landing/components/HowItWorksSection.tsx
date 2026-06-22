const HowItWorksSection = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-[2rem] font-bold text-text-primary">
          Cara Kerja
        </h2>
        <p className="mt-3 text-text-secondary text-lg">
          Belanja di SEAPEDIA semudah 1-2-3
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center py-8 px-6 border-border-primary relative">
          <div className="w-12 h-12 bg-brand-deep text-white text-lg font-bold rounded-xl flex items-center justify-center mx-auto mb-5">
            1
          </div>
          <h3 className="font-bold text-text-primary text-lg mb-2">
            Daftar Akun
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Buat akun SEAPEDIA-mu dalam hitungan detik. Gratis dan
            mudah — cukup masukkan data dirimu.
          </p>
        </div>

        <div className="card text-center py-8 px-6 border-border-primary relative">
          <div className="w-12 h-12 bg-brand-deep text-white text-lg font-bold rounded-xl flex items-center justify-center mx-auto mb-5">
            2
          </div>
          <h3 className="font-bold text-text-primary text-lg mb-2">
            Jelajahi Produk
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Cari produk kebutuhanmu dari berbagai toko terpercaya.
            Filter, cari, dan temukan yang terbaik.
          </p>
        </div>

        <div className="card text-center py-8 px-6 border-border-primary relative">
          <div className="w-12 h-12 bg-brand-deep text-white text-lg font-bold rounded-xl flex items-center justify-center mx-auto mb-5">
            3
          </div>
          <h3 className="font-bold text-text-primary text-lg mb-2">
            Pesan & Terima
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Checkout dengan mudah, lacak pesananmu, dan terima
            barang langsung di depan pintu.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
