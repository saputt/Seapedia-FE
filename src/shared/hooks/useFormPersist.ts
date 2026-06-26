import { useCallback, useEffect } from "react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

const STORAGE_PREFIX = "form_";

export function useFormPersist<T extends FieldValues>(
  formKey: string,
  form: UseFormReturn<T>,
) {
  const storageKey = STORAGE_PREFIX + formKey;

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      for (const key of Object.keys(saved)) {
        form.setValue(key as Path<T>, saved[key]);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, form]);

  const persist = useCallback(
    (data: T) => {
      localStorage.setItem(storageKey, JSON.stringify(data));
    },
    [storageKey],
  );

  const clearPersisted = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { persist, clearPersisted };
}
