import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import Button from "../../shared/components/ui/Button";

const steps = [
  {
    title: "Selamat Datang, Calon Seller!",
    description: "Bergabunglah sebagai seller di SEAPEDIA dan mulai jualan produkmu ke ribuan pembeli.",
    icon: "🏪",
  },
  {
    title: "Kenapa Jadi Seller?",
    description: "Akses ke ribuan pembeli aktif, tools manajemen toko lengkap, dan sistem pembayaran yang aman.",
    icon: "📈",
  },
  {
    title: "Fitur Unggulan",
    description: "Manajemen produk, pesanan, pengiriman, dan riwayat transaksi - semuanya dalam satu dashboard.",
    icon: "🛠️",
  },
  {
    title: "Siap Memulai?",
    description: "Langkah selanjutnya adalah membuat toko kamu. Isi nama toko dan deskripsi, lalu mulai berjualan!",
    icon: "🚀",
  },
];

const SellerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard/seller/create-store");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const step = steps[currentStep];

  return (
    <MainLayout navbarVariant="default">
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card !p-8 text-center">
            <div className="text-6xl mb-6">{step.icon}</div>
            <h1 className="text-2xl font-bold text-text-primary mb-3">{step.title}</h1>
            <p className="text-text-secondary mb-8">{step.description}</p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentStep
                      ? "bg-brand-deep"
                      : index < currentStep
                        ? "bg-brand-mid"
                        : "bg-bg-tertiary"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="ghost"
                size="lg"
                fullWidth
              >
                {currentStep === 0 ? "Batal" : "Kembali"}
              </Button>
              <Button
                onClick={handleNext}
                variant="primary"
                size="lg"
                fullWidth
              >
                {currentStep === steps.length - 1 ? "Buat Toko" : "Selanjutnya"}
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-text-muted mt-4">
            Langkah {currentStep + 1} dari {steps.length}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerOnboarding;
