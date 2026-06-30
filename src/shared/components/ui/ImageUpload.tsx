import { useRef } from "react";

export type ImageUploadProps = {
  preview: string | null;
  onChange: (file: File) => void;
  onClear?: () => void;
};

const ImageUpload = ({ preview, onChange, onClear }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-brand-deep">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
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
          onClick={() => { onClear?.(); fileInputRef.current?.click(); }}
          className="text-xs text-brand-deep font-semibold mt-2 hover:underline"
        >
          Ganti Gambar
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
