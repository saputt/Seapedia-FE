import type { ProductCategory } from "../../types";

export const CATEGORY_LABEL: Record<ProductCategory, string> & { [key: string]: string } = {
  ELECTRONICS: "Elektronik & Gadget",
  FASHION: "Fashion & Pakaian",
  HOME: "Kebutuhan Rumah Tangga",
  FOOD: "Makanan & Minuman",
  HOBBY: "Hobi & Hiburan",
};

export const CATEGORY_SHORT: Record<ProductCategory, string> = {
  ELECTRONICS: "Elektronik",
  FASHION: "Fashion",
  HOME: "Rumah",
  FOOD: "Makanan",
  HOBBY: "Hobi",
};

export const CATEGORIES: { key: ProductCategory; label: string }[] = Object.entries(CATEGORY_LABEL).map(([key, label]) => ({ key: key as ProductCategory, label }));
