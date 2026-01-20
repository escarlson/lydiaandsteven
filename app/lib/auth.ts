const required = ["DB_HOST", "DB_USER", "DB_PORT", "DB_PASSWORD", "DB_NAME"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

// Handle potential backslashes in DB_PASSWORD as escape characters break the CLI
let parsedDatabasePassword = process.env.DB_PASSWORD;
if (process.env.DB_PASSWORD) {
  parsedDatabasePassword = process.env.DB_PASSWORD.replace(/\\/g, "");
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "",
    database: createPool({
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER!,
        password: parsedDatabasePassword!,
        database: process.env.DB_NAME!,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    }),
})