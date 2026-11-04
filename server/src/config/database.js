require("dotenv").config();
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL belum diatur. Endpoint yang membutuhkan database tidak akan tersedia sampai konfigurasi diisi.");
}

const isLocalDatabase = process.env.DATABASE_URL
  ? /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
  : true;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Remote PostgreSQL must use TLS with certificate verification enabled.
  ssl: process.env.DATABASE_URL && !isLocalDatabase ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

module.exports = pool;
