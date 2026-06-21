import { useQuery } from "@tanstack/react-query";
import { fetchAddresses } from "../api/address.api";

export const useAddresses = (enabled = true) =>
  useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
    enabled,
  });
