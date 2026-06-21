import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  enabled?: boolean;
  rootMargin?: string;
}

const useInfiniteScroll = (
  callback: () => void,
  { enabled = true, rootMargin = "100px" }: UseInfiniteScrollOptions = {}
): React.RefObject<HTMLDivElement | null> => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled) {
        callback();
      }
    },
    [callback, enabled]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, { rootMargin });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleObserver, rootMargin]);

  return sentinelRef;
};

export default useInfiniteScroll;
