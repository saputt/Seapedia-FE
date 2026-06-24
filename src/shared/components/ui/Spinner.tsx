export type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizeMap: Record<string, string> = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  const dotSizeMap: Record<string, string> = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span className={`inline-flex items-center ${sizeMap[size] || sizeMap.md} ${className}`}>
      <span className={`${dotSizeMap[size] || dotSizeMap.md} bg-brand-deep rounded-full animate-bounce1`} />
      <span className={`${dotSizeMap[size] || dotSizeMap.md} bg-brand-deep rounded-full animate-bounce2`} />
      <span className={`${dotSizeMap[size] || dotSizeMap.md} bg-brand-deep rounded-full animate-bounce3`} />
    </span>
  );
};

export default Spinner;
