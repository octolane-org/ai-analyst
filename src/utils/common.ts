import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS classnames merger with clsx
 * @param inputs - Classnames to merge.
 * @returns Returns a string of classnames.
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * This function is used to clear the URL search params.
 */
export const clearURLSearchParams = () => {
  window.history.replaceState({}, "", "/");
};

export const isBrowser = () => {
  return typeof window !== "undefined";
};

/**
 * This function is used to format the currency.
 * @param num - The number to format.
 * @returns Returns the formatted currency.
 * @example
 * // Returns 1.2B
 * currencyFormat(1200000000);
 */
export const currencyFormat = (num: number) => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
};
