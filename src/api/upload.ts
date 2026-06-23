import { apiFetch } from "./client";

export const uploadImage = (file: File): Promise<{ url: string }> => {
  const fd = new FormData();
  fd.append("file", file);
  return apiFetch("upload", {
    method: "POST",
    body: fd,
  });
};
