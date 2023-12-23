/**
 * This function extracts the root domain from a given domain string.
 *
 * @param {string} domain - The domain string from which the root domain is to be extracted.
 * It can be a URL or a simple domain name. If the domain does not start with "http",
 * the function prepends "http://" to it to create a valid URL.
 *
 * @returns {string|null} The root domain of the given domain string. If the domain string
 * is a valid URL or domain name, the function returns the root domain as a string.
 * If the domain string is not a valid URL or domain name, the function logs an error message
 * and returns null.
 *
 * @example
 * // returns 'google.com'
 * getRootDomain('https://www.google.com')
 *
 * @example
 * // returns 'example.com'
 * getRootDomain('example.com')
 *
 * @example
 * // returns null and logs "Invalid domain: not a domain"
 * getRootDomain('not a domain')
 */
export const getRootDomain = (domain: string) => {
  try {
    const url = new URL(
      domain.startsWith("http") ? domain : "http://" + domain,
    );
    const parts = url.hostname.split(".");
    const len = parts.length;
    return len > 1 ? `${parts[len - 2]}.${parts[len - 1]}` : url.hostname;
  } catch (e) {
    console.error("Invalid domain:", domain);
    return null;
  }
};
