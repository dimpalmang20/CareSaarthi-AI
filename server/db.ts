import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

// create postgres connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// export drizzle database instance
export const db = drizzle(pool);
