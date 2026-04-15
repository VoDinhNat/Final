const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl) {
  console.warn(
    "VITE_API_BASE_URL is not set. Falling back to http://localhost:5000/api."
  );
}

export const API_BASE_URL = (rawApiBaseUrl || "http://localhost:5000/api").replace(
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

