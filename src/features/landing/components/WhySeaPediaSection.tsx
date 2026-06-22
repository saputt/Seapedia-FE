import { useState } from "react";

const faqItems = [
  {
    q: "Kenapa harus belanja di SEAPEDIA?",
    a: "SEAPEDIA menghadirkan pengalaman belanja yang cepat, aman, dan mudah. Kamu bisa menemukan berbagai produk kebutuhan dari toko-toko terpercaya dalam satu platform, tanpa perlu repot berpindah aplikasi.",
  },
  {
    q: "Apakah belanja di SEAPEDIA aman?",
    a: "Tentu. Setiap transaksi di SEAPEDIA diproses secara aman. Kami juga punya sistem lacak pesanan agar kamu bisa memantau status pesanan secara real-time dari proses hingga barang sampai.",
  },
  {
    q: "Bagaimana cara pembayarannya?",
    a: "SEAPEDIA menyediakan dompet digital (SEAPEDIA Wallet) yang bisa kamu top-up kapan saja. Pembayaran jadi lebih cepat dan praktis tanpa perlu input data berulang kali.",
  },
  {
    q: "Siapa saja yang bisa bergabung?",
    a: "SEAPEDIA terbuka untuk semua orang. Kamu bisa mendaftar sebagai pembeli untuk belanja kebutuhan sehari-hari, atau sebagai penjual untuk membuka toko dan menjangkau lebih banyak pelanggan.",
  },
  {
    q: "Apakah ada layanan pengiriman?",
    a: "Ya, SEAPEDIA memiliki fitur driver yang siap mengantarkan pesananmu. Kamu bisa melacak posisi driver secara real-time dan memastikan pesanan sampai dengan aman.",
  },
];

const FaqAccordion = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border-primary rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-bg-secondary transition-colors duration-200"
      >
        <span className="font-semibold text-text-primary text-sm leading-snug">{q}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-brand-deep transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-0 text-text-secondary text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

const WhySeaPediaSection = () => (
  <section className="py-16 md:py-20 bg-bg-secondary">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-[2rem] font-bold text-text-primary">
          Kenapa <span className="text-brand-deep">SEAPEDIA</span>?
        </h2>
        <p className="mt-3 text-text-secondary text-lg">
          Jawaban untuk pertanyaan yang mungkin kamu cari
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {faqItems.map((item, i) => (
          <FaqAccordion key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  </section>
);

export default WhySeaPediaSection;
