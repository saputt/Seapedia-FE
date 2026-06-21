import type { ElementType, ReactElement } from "react";

export type PulseSkeletonProps = {
  className?: string;
  as?: ElementType;
};

const PulseSkeleton = ({ className = "", as: Tag = "div" }: PulseSkeletonProps): ReactElement => (
  <Tag className={`animate-pulse bg-bg-tertiary rounded ${className}`} />
);

export default PulseSkeleton;
