import { useQuery } from "@tanstack/react-query";
import { getMyStore } from "../api/store.api";

export const useMyStore = (options = {}) =>
  useQuery({
    queryKey: ["myStore"],
    queryFn: getMyStore,
    retry: false,
    ...options,
  });
