// scripts/test_db.ts
import "dotenv/config"; // Load environment variables
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10), // Default to 5432 if not specified
});

async function testDatabase() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connection test successful:", result.rows[0].now);
  } catch (error) {
    console.error("Error testing database:", error);
  } finally {
    await pool.end();
  }
}

testDatabase();
