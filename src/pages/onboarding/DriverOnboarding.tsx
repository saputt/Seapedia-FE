import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../shared/components/layout/MainLayout";
import Button from "../../shared/components/ui/Button";
import { switchUserRole, addUserRole } from "../../features/auth/api/auth.api";
import useAuthStore from "../../features/auth/store/authStore";

const steps = [
  {
    title: "Selamat Datang, Calon Driver!",
    description: "Bergabunglah sebagai driver di SEAPEDIA dan bantu antarkan pesanan ke pembeli.",
    icon: "🛵",
  },
  {
    title: "Kenapa Jadi Driver?",
    description: "Fleksibel, pendapatan menarik, dan bantu komunitas lokal dengan pengiriman yang cepat dan aman.",
    icon: "💰",
  },
  {
    title: "Cara Kerja",
    description: "Lihat pekerjaan tersedia, pilih yang sesuai, antarkan pesanan, dan dapatkan penghasilan.",
    icon: "📋",
  },
  {
    title: "Siap Memulai?",
    description: "Klik tombol di bawah untuk mulai sebagai driver dan akses dashboard driver kamu.",
    icon: "🚀",
  },
];

const DriverOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const switchRole = useAuthStore((s) => s.switchRole);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartDriving();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleStartDriving = async () => {
    setIsLoading(true);
    try {
      await addUserRole("DRIVER");
      const res = await switchUserRole("DRIVER");
      switchRole("DRIVER", res.accessToken, res.userRoles);
      navigate("/dashboard/driver", { replace: true });
    } catch (error) {
      console.error("Failed to start as driver:", error);
      setIsLoading(false);
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
                disabled={isLoading}
              >
                {currentStep === 0 ? "Batal" : "Kembali"}
              </Button>
              <Button
                onClick={handleNext}
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                {currentStep === steps.length - 1
                  ? isLoading ? "Memproses..." : "Mulai sebagai Driver"
                  : "Selanjutnya"}
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

export default DriverOnboarding;
