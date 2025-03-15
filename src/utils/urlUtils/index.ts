/**
 * Truncate a URL to a specified maximum length
 * @param url The URL to truncate
 * @param maxLength Maximum length of the truncated URL
 * @returns The truncated URL
 */
export function truncateUrl(url: string, maxLength: number = 60): string {
  if (!url || url.length <= maxLength) return url;

  try {
    // Special case for Wikipedia - always show just the domain
    if (url.includes("wikipedia.org")) {
      return "en.wikipedia.org";
    }

    // Smart truncation - keep domain and some of path
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    const domain = urlObj.hostname;

    if (domain.length >= maxLength - 5) {
      // If domain itself is too long, truncate it
      return domain.substring(0, maxLength - 3) + "...";
    }

    // Keep domain and truncate path
    const pathToShow = maxLength - domain.length - 5;
    return `${domain}${url.substring(
      domain.length,
      domain.length + pathToShow
    )}...`;
  } catch (e) {
    // If URL parsing fails, do simple truncation
    return url.substring(0, maxLength - 3) + "...";
  }
}
