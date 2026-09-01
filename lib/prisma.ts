/**
 * Prisma Client Singleton
 * Used in API routes and Server Actions for database operations
 */
import { config as loadEnv } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

loadEnv({ path: ".env.local", override: false });
loadEnv({ path: ".env", override: false });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: pg.Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;
const DB_QUERY_TIMEOUT_MS = Number(process.env.DB_QUERY_TIMEOUT_MS ?? 2000);

function isDatabaseConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  // Prisma uses P1001 when the Postgres host cannot be reached. Its message
  // ("Can't reach database server") does not necessarily contain the word
  // "connection", so check both the stable Prisma code and its message.
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : undefined;

  return (
    code === "P1001" ||
    code === "P1002" ||
    // A database can be temporarily behind its migration state (for example,
    // while a Supabase project is being restored). Public pages should render
    // their empty state instead of failing their entire server render.
    code === "P2021" ||
    /timeout|ETIMEDOUT|ECONN|connection|closed the connection|could not connect|connect|can't reach database server/i.test(
      message
    )
  );
}

export async function withDbFallback<T>(
  operation: () => Promise<T>,
  fallback: NoInfer<T>
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      operation().catch((error) => {
        if (isDatabaseConnectionError(error)) {
          console.warn("Database query timed out or failed; using fallback data.");
          return fallback;
        }

        throw error;
      }),
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), DB_QUERY_TIMEOUT_MS);
      }),
    ]);
  } catch (error) {
    console.error("Database query failed unexpectedly", error);
    return fallback;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

function createSafePrismaClient() {
  if (!connectionString) {
    return new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === "count") {
            return async () => 0;
          }

          if (prop === "findMany" || prop === "findFirst") {
            return async () => [];
          }

          if (prop === "create" || prop === "update" || prop === "delete") {
            return async () => null;
          }

          return new Proxy(
            {},
            {
              get(childProp) {
                if (childProp === "count") {
                  return async () => 0;
                }

                if (childProp === "findMany" || childProp === "findFirst") {
                  return async () => [];
                }

                if (childProp === "create" || childProp === "update" || childProp === "delete") {
                  return async () => null;
                }

                return () => null;
              },
            }
          );
        },
      }
    ) as PrismaClient;
  }

  // Create a single shared pg.Pool singleton to avoid connection exhaustion.
  // Each PrismaPg instance creates its own internal pool by default, which
  // can accumulate across Turbopack HMR reloads and exceed Supabase's
  // direct connection limit. Using one external pool with a controlled
  // max size prevents "Server has closed the connection" errors.
  const pool =
    globalForPrisma.pgPool ??
    new pg.Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 5,
      idleTimeoutMillis: 15_000,
      connectionTimeoutMillis: 3_000,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool, {
    disposeExternalPool: false,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma || createSafePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
