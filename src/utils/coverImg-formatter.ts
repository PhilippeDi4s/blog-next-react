export function coverImgFormatter(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    if (url.hostname === "localhost") {
      return url.pathname;
    }
  } finally{
    return imageUrl
  }
}
