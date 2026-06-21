export type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizeMap: Record<string, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[3px]",
    lg: "w-8 h-8 border-[3px]",
  };

  return (
    <span
      className={`${sizeMap[size] || sizeMap.md} border-brand-deep border-t-transparent rounded-full animate-spin inline-block ${className}`}
    />
  );
};

export default Spinner;
