export default async function uploadProductImage(file) {
  const body = new FormData();
  body.append("image", file); // must match multer.single("image") field name

  const token = localStorage.getItem("bearerToken"); // confirm this matches your auth storage key
  const res = await fetch("/api/products/upload-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Image upload failed");
  }
  return data.imageUrl;
}
