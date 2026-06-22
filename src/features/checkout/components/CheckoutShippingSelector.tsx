import Spinner from "../../../shared/components/ui/Spinner";
import { SHIPPING_LIST } from "../../../shared/constants/order";

interface CheckoutShippingSelectorProps {
  shippingMethod: string;
  isFetching: boolean;
  onChange: (method: string) => void;
}

const CheckoutShippingSelector = ({ shippingMethod, isFetching, onChange }: CheckoutShippingSelectorProps) => (
  <div className="card relative">
    <h2 className="text-sm font-bold text-text-primary mb-3">
      Metode Pengiriman
    </h2>
    <div className="space-y-2">
      {SHIPPING_LIST.map((s: { id: string; name: string; desc: string; price: number }) => (
        <label
          key={s.id}
          className={`flex items-center gap-3 px-3 py-2 rounded border-[2px] cursor-pointer transition-colors ${
            shippingMethod === s.id
              ? "border-brand-deep bg-brand-subtle"
              : "border-bg-tertiary hover:border-brand-light"
          }`}
        >
          <input
            type="radio"
            name="shipping"
            value={s.id}
            checked={shippingMethod === s.id}
            onChange={() => onChange(s.id)}
            className="accent-brand-deep shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">
              {s.name}
            </p>
            <p className="text-xs text-text-secondary">{s.desc}</p>
          </div>
          <p className="text-sm font-semibold text-text-primary shrink-0">
            Rp{s.price.toLocaleString("id-ID")}
          </p>
        </label>
      ))}
    </div>

    {isFetching && (
      <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded">
        <Spinner />
      </div>
    )}
  </div>
);

export default CheckoutShippingSelector;
