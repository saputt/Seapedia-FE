import { VTLink as Link } from "../../shared/utils/VTLink";
import Button from "../shared/components/ui/Button";

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
    <div className="card max-w-md w-full text-center p-10">
      <div className="text-6xl mb-4">🌊</div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-text-secondary mb-8">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={() => window.history.back()} variant="ghost" size="md">
          Kembali
        </Button>
        <Button variant="primary" size="md">
          <Link to="/">Ke Beranda</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default NotFoundPage;