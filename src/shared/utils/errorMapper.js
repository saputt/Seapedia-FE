const errorMap = {
  "Invalid credential": "Email tidak terdaftar",
  "invalid credential": "Kata sandi salah",
  "email already exist": "Email sudah digunakan",
  "Too many requests": "Terlalu banyak percobaan. Silakan coba lagi nanti.",
  "storename": "Nama toko sudah digunakan",
  "already have store": "Anda sudah memiliki toko",
};

export const getReadableError = (err) => {
  if (!err) return "";
  if (err.name === "TypeError") return "Gagal terhubung ke server. Periksa koneksi Anda.";
  const msg = err.message || "";
  for (const [key, val] of Object.entries(errorMap)) {
    if (msg.includes(key)) return val;
  }
  return msg;
};
