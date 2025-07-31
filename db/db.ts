import { Pool } from "pg";

// Configure your PostgreSQL connection details using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10), // Default to 5432 if not specified
});

// Export the pool for use in other parts of your application
export default pool;

// Optional: Add a function to test the connection (for development/debugging)
export async function testDbConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit with an error code if connection fails
  }
}
