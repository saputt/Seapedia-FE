import { useQuery } from "@tanstack/react-query";
import { fetchAddresses } from "../api/address.api";

/**
 * Hook untuk mengambil daftar alamat pengguna.
 * Menggunakan address.api.js yang sudah dipisah dari order.api.js.
 */
export const useAddresses = (enabled = true) =>
  useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
    enabled,
  });
