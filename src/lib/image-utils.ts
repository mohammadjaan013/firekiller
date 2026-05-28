export function getImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }

  const prefix = process.env.NEXT_PUBLIC_WP_UPLOADS || "https://lemonchiffon-gull-592316.hostingersite.com/wp-content/uploads";
  
  // ensure single slash
  const cleanPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;

  return `${cleanPrefix}/${cleanUrl}`;
}
