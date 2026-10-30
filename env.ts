// src/env.ts

const requiredEnvs = [
  "DATABASE_URL",
  "NEXT_PUBLIC_API_URL",
] as const;

function validateEnv() {
  const missing: string[] = [];

  for (const envName of requiredEnvs) {
    if (!process.env[envName]) {
      missing.push(envName);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Fatal Error: Missing required environment variables:");
    missing.forEach((env) => console.error(`   - ${env}`));
    console.error("\nPlease check your .env file or environment configuration.");
    process.exit(1); // Stops the build/app immediately
  }
}

// Run the validation check
validateEnv();