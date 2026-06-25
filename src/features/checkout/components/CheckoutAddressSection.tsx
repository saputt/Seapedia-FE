import { memo } from "react";
import Button from "../../../shared/components/ui/Button";
import type { Address } from "../../../types";

interface CheckoutAddressSectionProps {
  selectedAddress: Address | null;
  onSelectClick: () => void;
}

const CheckoutAddressSection = memo(({ selectedAddress, onSelectClick }: CheckoutAddressSectionProps) => (
  <div className="card">
    <h2 className="text-sm font-bold text-text-primary mb-3">
      Alamat Pengiriman
    </h2>
    {selectedAddress ? (
      <div
        onClick={onSelectClick}
        className="cursor-pointer hover:bg-brand-subtle -mx-3 -my-2 px-3 py-2 rounded transition-colors"
      >
        <p className="text-sm font-semibold text-text-primary">
          {selectedAddress.label}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          {selectedAddress.fullAddress}
        </p>
        <p className="text-xs text-brand-deep mt-1 font-medium">
          Ketuk untuk mengganti
        </p>
      </div>
    ) : (
      <div>
        <p className="text-sm text-text-secondary mb-3">
          Belum ada alamat pengiriman dipilih.
        </p>
        <Button onClick={onSelectClick} variant="primary">
          Pilih Alamat
        </Button>
      </div>
    )}
  </div>
));
CheckoutAddressSection.displayName = "CheckoutAddressSection";

export default CheckoutAddressSection;
