import { apiFetch } from "../../../api/client";

export const getProfile = () => apiFetch("user/profile");

export const updateProfile = (username) =>
  apiFetch("user/profile", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });

export const changePassword = (oldPassword, newPassword) =>
  apiFetch("user/password", {
    method: "PATCH",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
