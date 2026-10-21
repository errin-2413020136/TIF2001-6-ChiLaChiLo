require("dotenv").config();
const pool = require("./config/database");

async function testConnection() {
  try {
    const result = await pool.query("SELECT current_database() AS database, version() AS version");
    console.log("Koneksi PostgreSQL berhasil:", result.rows[0].database);
    console.log(result.rows[0].version);
  } catch (error) {
    console.error("Koneksi PostgreSQL gagal:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testConnection();
