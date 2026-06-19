import { useEffect, useRef, useCallback } from "react";

const useInfiniteScroll = (callback, { enabled = true, rootMargin = "100px" } = {}) => {
  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
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
