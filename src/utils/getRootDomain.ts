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
