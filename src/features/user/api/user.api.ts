import { apiFetch } from "../../../api/client";
import type { UserProfile } from "../../../types";

export const getProfile = (): Promise<UserProfile> => apiFetch("user/profile");

export const updateProfile = (username: string): Promise<UserProfile> =>
  apiFetch("user/profile", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });

export const changePassword = (oldPassword: string, newPassword: string): Promise<void> =>
  apiFetch("user/password", {
    method: "PATCH",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
