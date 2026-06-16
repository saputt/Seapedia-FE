import { apiFetch } from "../../../api/client";

export const registerUser = (data) =>
  apiFetch("auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  apiFetch("auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const switchUserRole = (role) =>
  apiFetch("auth/switch-role", {
    method: "POST",
    body: JSON.stringify({ role }),
  });
