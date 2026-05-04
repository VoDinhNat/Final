const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultDevApiBaseUrl = "http://localhost:5000/api";
const defaultProdApiBaseUrl =
  typeof window !== "undefined" ? `${window.location.origin}/api` : "";
const defaultApiBaseUrl = import.meta.env.DEV
  ? defaultDevApiBaseUrl
  : defaultProdApiBaseUrl;

if (!rawApiBaseUrl) {
  console.warn(
    `VITE_API_BASE_URL is not set. Falling back to ${defaultApiBaseUrl}.`
  );
}

export const API_BASE_URL = (rawApiBaseUrl || defaultApiBaseUrl).replace(
  /\/+$/,
  ""
);

if (
  import.meta.env.PROD &&
  !API_BASE_URL.startsWith("https://") &&
  !API_BASE_URL.startsWith("http://localhost")
) {
  console.warn(
    "Production API base URL should use HTTPS to protect auth cookies and user data in transit."
  );
}

