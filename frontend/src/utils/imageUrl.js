const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Resolves image paths so relative backend uploads (/uploads/...) work seamlessly
 * across different domains (e.g. Vercel frontend + Render backend) and in localhost.
 */
export function getImageUrl(path) {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  // Relative upload path from backend
  if (path.startsWith("/uploads/")) {
    return `${BASE_URL}${path}`;
  }

  return path;
}
