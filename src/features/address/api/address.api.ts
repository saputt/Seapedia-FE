import { apiFetch } from "../../../api/client";
import type { Address, AddressInput } from "../../../types";

export const fetchAddresses = (): Promise<Address[]> => apiFetch("address");

export const createAddress = (data: AddressInput): Promise<Address> =>
  apiFetch("address", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateAddress = (id: string, data: AddressInput): Promise<Address> =>
  apiFetch(`address/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteAddress = (id: string): Promise<void> =>
  apiFetch(`address/${id}`, { method: "DELETE" });

export const setDefaultAddress = (id: string): Promise<void> =>
  apiFetch(`address/${id}/default`, { method: "PATCH" });
