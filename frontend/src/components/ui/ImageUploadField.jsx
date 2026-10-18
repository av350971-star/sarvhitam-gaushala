import { useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { api } from "../../services/api.js";
import { getImageUrl } from "../../utils/imageUrl.js";

export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const displaySrc = getImageUrl(value);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Try uploading to backend /api/upload
      const res = await api.upload(file);
      if (res?.success && res?.url) {
        onChange(res.url);
        setUploading(false);
        e.target.value = "";
        return;
      }
    } catch {
      // 2. Graceful fallback to base64 if backend is not reachable
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-brown-700">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brown-100 bg-cream-50">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-saffron-600" />
          ) : displaySrc ? (
            <img src={displaySrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-brown-300" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer rounded-full border border-brown-200 px-4 py-1.5 text-sm font-medium text-brown-700 transition-colors hover:bg-cream-50">
            {uploading ? "अपलोड हो रहा है..." : value ? "बदलें" : "अपलोड करें"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFile}
              className="hidden"
            />
          </label>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              हटाएं
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
