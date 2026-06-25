import { memo } from "react";
import Button from "../../../shared/components/ui/Button";

interface CheckoutDiscountSectionProps {
  discountCode: string;
  appliedCode: string;
  discountValue: number;
  discountCheckError: string;
  discountErrorMsg: string;
  isPending: boolean;
  onCodeChange: (code: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CheckoutDiscountSection = memo(({
  discountCode,
  appliedCode,
  discountValue,
  discountCheckError,
  discountErrorMsg,
  isPending,
  onCodeChange,
  onApply,
  onRemove,
  onKeyDown,
}: CheckoutDiscountSectionProps) => (
  <div className="card">
    <h2 className="text-sm font-bold text-text-primary mb-3">
      Kode Diskon
    </h2>
    {appliedCode ? (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-success">{appliedCode}</p>
          {discountValue > 0 && (
            <p className="text-xs text-text-secondary">
              Diskon: Rp{discountValue.toLocaleString("id-ID")}
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-sm text-danger hover:underline self-start sm:self-auto"
        >
          Hapus
        </button>
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={discountCode}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="input-neo w-full !py-2 !text-sm"
          placeholder="Masukkan kode diskon"
        />
        <Button
          onClick={onApply}
          variant="primary"
          size="sm"
          disabled={!discountCode.trim() || isPending}
        >
          {isPending ? "Memvalidasi..." : "Pakai"}
        </Button>
      </div>
    )}
    {(discountCheckError || discountErrorMsg) && (
      <p className="text-danger text-xs mt-1">{discountCheckError || discountErrorMsg}</p>
    )}
    {appliedCode && !discountCheckError && !discountErrorMsg && (
      <p className="text-success text-xs mt-1">Diskon {appliedCode} berhasil diterapkan!</p>
    )}
  </div>
));
CheckoutDiscountSection.displayName = "CheckoutDiscountSection";

export default CheckoutDiscountSection;
