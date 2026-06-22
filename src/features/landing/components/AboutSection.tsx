const AboutSection = () => (
  <section className="bg-brand-deep py-16 md:py-20 relative overflow-hidden">
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />
    <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-white/5 rounded-full pointer-events-none" />

    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-[2rem] md:text-4xl font-bold text-white leading-tight">
            Apa Itu{" "}
            <span className="text-white/80">SEAPEDIA?</span>
          </h2>
          <p className="mt-4 text-white/80 text-lg leading-relaxed">
            SEAPEDIA adalah platform belanja online yang menghubungkan
            kamu dengan berbagai toko dan produk kebutuhan sehari-hari
            dari penjual terpercaya.
          </p>
          <p className="mt-3 text-white/70 text-base leading-relaxed">
            Kami hadir untuk membuat pengalaman belanja lebih mudah,
            cepat, dan aman — tanpa ribet, tanpa khawatir.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15">
            <p className="text-3xl font-bold text-white">100+</p>
            <p className="text-white/70 text-sm mt-1">Toko Terpercaya</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15">
            <p className="text-3xl font-bold text-white">1000+</p>
            <p className="text-white/70 text-sm mt-1">Produk Tersedia</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15">
            <p className="text-3xl font-bold text-white">10rb+</p>
            <p className="text-white/70 text-sm mt-1">Pengguna Aktif</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/15">
            <p className="text-3xl font-bold text-white">#1</p>
            <p className="text-white/70 text-sm mt-1">Platform Belanja</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
