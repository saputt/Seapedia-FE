interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  disabled?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector = ({ quantity, stock, disabled = false, onIncrease, onDecrease }: QuantitySelectorProps) => (
  <div className="flex items-center border-3 border-brand-deep bg-white">
    <button
      onClick={onDecrease}
      disabled={quantity <= 1 || disabled}
      className="px-3 py-2 text-text-primary hover:bg-brand-subtle disabled:opacity-50"
    >
      -
    </button>
    <span className="px-4 py-2">{quantity}</span>
    <button
      onClick={onIncrease}
      disabled={quantity >= stock || disabled}
      className="px-3 py-2 text-text-primary hover:bg-brand-subtle disabled:opacity-50"
    >
      +
    </button>
  </div>
);

export default QuantitySelector;
