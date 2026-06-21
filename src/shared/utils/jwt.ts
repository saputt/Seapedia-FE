export const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};
