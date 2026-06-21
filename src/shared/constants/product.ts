import type { ProductCategory } from "../../types";

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  ELECTRONICS: "Elektronik & Gadget",
  FASHION: "Fashion & Pakaian",
  HOME: "Kebutuhan Rumah Tangga",
  FOOD: "Makanan & Minuman",
  HOBBY: "Hobi & Hiburan",
};

export const CATEGORIES: { key: ProductCategory; label: string }[] = Object.entries(CATEGORY_LABEL).map(([key, label]) => ({ key: key as ProductCategory, label }));
