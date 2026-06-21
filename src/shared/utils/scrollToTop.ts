export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const scrollToTopInstant = (): void => {
  window.scrollTo({ top: 0, behavior: "auto" });
};