
require("dotenv").config();

const pool = require("./config/database");

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Koneksi ke MySQL berhasil! 🎉");
    connection.release();
  } catch (error) {
    console.error("Koneksi ke MySQL gagal:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
