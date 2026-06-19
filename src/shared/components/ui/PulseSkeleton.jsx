const PulseSkeleton = ({ className = "", as: Tag = "div" }) => (
  <Tag className={`animate-pulse bg-bg-tertiary rounded ${className}`} />
);

export default PulseSkeleton;
