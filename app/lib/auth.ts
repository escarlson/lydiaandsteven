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

const pool = createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER!,
  password: parsedDatabasePassword!,
  database: process.env.DB_NAME!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const isEmailAllowed = (email: string) => {
  const allowedEmails = (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e !== "");

  if (allowedEmails.length === 0) {
    return true;
  }

  const lowerEmail = email.toLowerCase();
  return allowedEmails.includes(lowerEmail);
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET as string || "",
  database: pool,
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!isEmailAllowed(user.email)) {
            throw new Error("Email not allowed");
          }
        },
      },
    },
    session: {
      create: {
        before: async (data) => {
          const [rows] = await pool.query("SELECT email FROM user WHERE id = ?", [data.userId]) as [{ email: string }[], unknown];
          if (rows.length > 0) {
            if (!isEmailAllowed(rows[0].email)) {
              throw new Error("Email not allowed");
            }
          }
        },
      },
    },
  },
})