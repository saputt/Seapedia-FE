import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../utils/scrollToTop";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;