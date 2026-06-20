import { useRef } from "react";

/**
 * ImageUpload component untuk upload gambar dengan preview.
 * Digunakan di ProductCreatePage dan ProductEditPage.
 *
 * @param {Object} props
 * @param {string|null} props.preview - URL preview gambar (null jika belum ada)
 * @param {Function} props.onChange - Fungsi yang dipanggil saat file dipilih (File) => void
 * @param {Function} [props.onClear] - Fungsi untuk clear gambar (opsional)
 */
const ImageUpload = ({ preview, onChange, onClear }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="w-full md:w-80 shrink-0">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="aspect-square border-[3px] border-dashed border-border bg-bg-secondary rounded flex flex-col items-center justify-center cursor-pointer hover:bg-brand-subtle transition-colors overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <span className="text-3xl block mb-2">📷</span>
            <span className="text-sm text-text-muted font-medium">
              Klik untuk upload gambar
            </span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {preview && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-brand-deep font-semibold mt-2 hover:underline"
        >
          Ganti Gambar
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
