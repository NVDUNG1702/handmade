/**
 * Utility functions for API handling
 */

/**
 * Clean query parameters by removing undefined, null, and empty strings
 * This prevents backend validation errors when empty values are sent
 *
 * @param params - Object containing query parameters
 * @returns Cleaned parameters object
 *
 * @example
 * ```ts
 * const params = {
 *   page: 1,
 *   limit: 10,
 *   keyword: "",
 *   status: undefined,
 *   priority: "HIGH"
 * };
 *
 * const cleaned = cleanQueryParams(params);
 * // Result: { page: 1, limit: 10, priority: "HIGH" }
 * ```
 */
export function cleanQueryParams<T extends Record<string, any>>(
  params?: T
): Record<string, any> {
  const cleanParams: Record<string, any> = {};

  if (!params) {
    return cleanParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    // Only include values that are not undefined, null, or empty string
    if (value !== undefined && value !== null && value !== "") {
      // Special handling for numbers: 0 is valid
      if (typeof value === "number" || typeof value === "boolean") {
        cleanParams[key] = value;
      } else if (typeof value === "string" && value.trim() !== "") {
        cleanParams[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        cleanParams[key] = value;
      } else if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length > 0
      ) {
        cleanParams[key] = value;
      }
    }
  });

  return cleanParams;
}

/**
 * Build query string from params object
 * @param params - Parameters object
 * @returns Query string without leading "?"
 */
export function buildQueryString(params?: Record<string, any>): string {
  const cleanParams = cleanQueryParams(params);
  const searchParams = new URLSearchParams();

  Object.entries(cleanParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}
