
const pool = require("../config/database");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, dan password wajib diisi.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password minimal 8 karakter.",
      });
    }

    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Username atau email sudah digunakan.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    return res.status(201).json({
      message: "Registrasi berhasil!",
    });
  } catch (error) {
    console.error("Error registrasi:", error.message);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
}

module.exports = { register };
