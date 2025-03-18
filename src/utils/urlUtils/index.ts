/**
 * Truncate a URL to a specified maximum length
 * @param url The URL to truncate
 * @param maxLength Maximum length of the truncated URL
 * @param showFullDomain Whether to show the full domain name (true) or just the hostname (false)
 * @returns The truncated URL
 */
export function truncateUrl(url: string, maxLength: number = 60, showFullDomain: boolean = true): string {
  if (!url || url.length <= maxLength) return url;

  try {
    // Special case for Wikipedia - extract article name for better display
    if (url.includes("wikipedia.org")) {
      if (url.includes("/wiki/")) {
        const articleName = url.split("/wiki/")[1].split(/[#?&]/)[0];
        // Create readable display text from article name
        const displayText = articleName
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return `Wikipedia: ${displayText}`;
      }
      return "Wikipedia";
    }

    // Special case for Google search URLs
    if (url.includes("google.com/search")) {
      return "Google Search";
    }

    // Handle other search engines
    if (url.includes("bing.com/search")) return "Bing Search";
    if (url.includes("search.yahoo.com")) return "Yahoo Search";
    if (url.includes("duckduckgo.com")) return "DuckDuckGo Search";

    // Smart truncation - keep domain and some of path
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    const domain = urlObj.hostname;
    
    // For very clean URLs (just domain), return the full domain
    if (urlObj.pathname === "/" || urlObj.pathname === "") {
      return domain;
    }

    if (domain.length >= maxLength - 5) {
      // If domain itself is too long, truncate it
      return domain.substring(0, maxLength - 3) + "...";
    }

    // For domains with www, consider showing without www if space is tight
    const displayDomain = domain.startsWith("www.") && !showFullDomain 
      ? domain.substring(4) 
      : domain;

    // Extract path without query parameters
    const path = urlObj.pathname;
    
    // Keep domain and truncate path
    const pathToShow = maxLength - displayDomain.length - 5;
    
    // If path is very short, show it entirely
    if (path.length <= pathToShow) {
      // Truncate any query string
      return `${displayDomain}${path}` + (urlObj.search ? "..." : "");
    }
    
    // Otherwise show truncated path
    return `${displayDomain}${path.substring(0, pathToShow)}...`;
  } catch {
    // If URL parsing fails, do simple truncation
    return url.substring(0, maxLength - 3) + "...";
  }
}
