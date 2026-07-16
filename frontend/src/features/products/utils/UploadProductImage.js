// UploadProductImage.js
import { API_BASE_URL } from "../../../config/api.js"; // adjust relative path to match your project
import { storage } from "../../../shared/lib/storage.js";

export default async function uploadProductImage(file) {
  const body = new FormData();
  body.append("image", file);

  const token = storage.token.get();
  const res = await fetch(`${API_BASE_URL}/api/products/upload-image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Image upload failed");
  }
  return data.imageUrl;
}