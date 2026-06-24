import { apiFetch } from "../../../api/client";
import type { RegisterData, LoginData, RoleName, LoginResponse, SwitchRoleResponse } from "../../../types";

export const registerUser = (data: RegisterData): Promise<LoginResponse> =>
  apiFetch("auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data: LoginData): Promise<LoginResponse> =>
  apiFetch("auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const switchUserRole = (role: RoleName): Promise<SwitchRoleResponse> =>
  apiFetch("auth/switch-role", {
    method: "POST",
    body: JSON.stringify({ role }),
  });

export const addUserRole = (role: RoleName): Promise<{ message: string }> =>
  apiFetch("auth/roles", {
    method: "POST",
    body: JSON.stringify({ role }),
  });
