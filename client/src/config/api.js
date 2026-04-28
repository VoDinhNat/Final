const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl) {
  console.warn(
    "VITE_API_BASE_URL is not set. Falling back to https://final-xlvp.onrender.com/api."
  );
}

export const API_BASE_URL = (rawApiBaseUrl || "https://final-xlvp.onrender.com/api").replace(
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

