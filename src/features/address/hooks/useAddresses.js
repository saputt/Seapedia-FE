import { useQuery } from "@tanstack/react-query";
import { fetchAddresses } from "../../order/api/order.api";

export const useAddresses = (enabled = true) =>
  useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
    enabled,
  });
