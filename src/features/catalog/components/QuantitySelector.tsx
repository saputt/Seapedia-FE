interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  disabled?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector = ({ quantity, stock, disabled = false, onIncrease, onDecrease }: QuantitySelectorProps) => {
  const isAtMax = quantity >= stock;

  return (
    <div className="flex items-center border-3 border-brand-deep bg-white">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1 || disabled}
        className="px-3 py-2 text-text-primary font-bold hover:bg-brand-subtle transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        -
      </button>
      <span className="px-4 py-2 font-semibold">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={isAtMax || disabled}
        className={`px-3 py-2 font-bold transition-all disabled:cursor-not-allowed hover:bg-brand-subtle ${
          isAtMax
            ? "text-gray-400 bg-gray-100 opacity-60"
            : "text-text-primary"
        }`}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
