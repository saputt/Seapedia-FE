const StarRating = ({ value, onChange, size = "md", readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          {star <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default StarRating;
