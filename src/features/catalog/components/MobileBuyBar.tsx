import Button from "../../../shared/components/ui/Button";

interface MobileBuyBarProps {
  isLoggedIn: boolean;
  stock: number;
  quantity: number;
  addPending: boolean;
  clearPending: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onLoginClick: () => void;
}

const MobileBuyBar = ({ isLoggedIn, stock, quantity, addPending, clearPending, onAddToCart, onBuyNow, onLoginClick }: MobileBuyBarProps) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-brand-deep shadow-lg p-4 md:hidden z-50">
    <div className="max-w-[1280px] mx-auto flex gap-4">
      {isLoggedIn ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={addPending}
          disabled={stock < 1 || quantity < 1}
          onClick={onAddToCart}
        >
          {addPending ? "Menambahkan..." : `Tambah ke Keranjang (${quantity})`}
        </Button>
      ) : (
        <Button
          onClick={onLoginClick}
          variant="primary"
          size="lg"
          fullWidth
        >
          Tambah ke Keranjang
        </Button>
      )}
      <Button
        variant="ghost"
        size="lg"
        fullWidth
        onClick={onBuyNow}
        disabled={!isLoggedIn || stock < 1 || quantity < 1 || clearPending}
      >
        {clearPending ? "Memproses..." : `Beli Sekarang (${quantity})`}
      </Button>
    </div>
  </div>
);

export default MobileBuyBar;
