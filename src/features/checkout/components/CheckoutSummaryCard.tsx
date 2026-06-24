interface CheckoutSummaryCardProps {
  subtotal: number;
  discountValue: number;
  shippingFee: number;
  taxFee: number;
  totalPrice: number;
}

const CheckoutSummaryCard = ({ subtotal, discountValue, shippingFee, taxFee, totalPrice }: CheckoutSummaryCardProps) => (
  <div className="card">
    <h2 className="text-sm font-bold text-text-primary mb-3">
      Ringkasan Pembayaran
    </h2>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-text-secondary">Subtotal</span>
        <span className="font-medium">
          Rp{subtotal.toLocaleString("id-ID")}
        </span>
      </div>
      {discountValue > 0 && (
        <div className="flex justify-between text-success">
          <span>Diskon</span>
          <span className="font-medium">
            -Rp{discountValue.toLocaleString("id-ID")}
          </span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-text-secondary">Ongkos Kirim</span>
        <span className="font-medium">
          Rp{shippingFee.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-text-secondary">Pajak (12%)</span>
        <span className="font-medium">
          Rp{taxFee.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="border-t-[2px] border-bg-tertiary pt-2 flex justify-between text-base font-bold">
        <span>Total</span>
        <span className="text-brand-deep">
          Rp{totalPrice.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  </div>
);

export default CheckoutSummaryCard;
