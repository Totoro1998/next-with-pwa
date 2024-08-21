"use client";

export default function ImageLoader({ src, width, quality }) {
  if (process.env.NODE_ENV === "production") return src;
  let base = process.env.NEXT_PUBLIC_IMAGE_BASE;
  if (src.includes("static") || src.includes("blog") || src.includes("_assets") || src.includes("http")) {
    base = "";
  }
  return `${base}${src}?w=${width}`;
}
