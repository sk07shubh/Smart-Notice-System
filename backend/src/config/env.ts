const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_BUCKET_NAME",
  "GMAIL_USER",
  "GMAIL_APP_PASSWORD",
  "APP_URL",
  "CORS_ORIGINS",
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

export function getCorsOrigins() {
  return (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
