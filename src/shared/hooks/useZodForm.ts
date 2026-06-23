import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, infer as zInfer } from "zod";

export function useZodForm<T extends ZodType>(
  schema: T,
  defaultValues?: zInfer<T>
) {
  return useForm<zInfer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });
}