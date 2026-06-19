export const CATEGORY_LABEL = {
  ELECTRONICS: "Elektronik & Gadget",
  FASHION: "Fashion & Pakaian",
  HOME: "Kebutuhan Rumah Tangga",
  FOOD: "Makanan & Minuman",
  HOBBY: "Hobi & Hiburan",
};

export const CATEGORIES = Object.entries(CATEGORY_LABEL).map(([key, label]) => ({ key, label }));
