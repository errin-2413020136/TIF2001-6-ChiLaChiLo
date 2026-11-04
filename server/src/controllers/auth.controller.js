const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { normalizeString, validateRegistration } = require("../utils/auth.validation");

function createToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET harus diatur dan minimal 32 karakter.");
  }
  return jwt.sign(
    { sub: String(user.id), role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h", issuer: "softdev-api" }
  );
}

async function register(req, res) {
  const validation = validateRegistration(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(500).json({ message: "Konfigurasi autentikasi server belum lengkap." });
  }
  const { username, email, password } = validation.data;

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at",
      [username, email, passwordHash]
    );
    const user = result.rows[0];
    const token = createToken(user);
    return res.status(201).json({ message: "Registrasi berhasil.", token, user });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Username atau email sudah digunakan." });
    }
    if (error.message.includes("JWT_SECRET")) {
      console.error(error.message);
      return res.status(500).json({ message: "Konfigurasi autentikasi server belum lengkap." });
    }
    console.error("Register failed:", error.message);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

async function login(req, res) {
  const identifier = normalizeString(req.body?.identifier || req.body?.email || req.body?.username);
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!identifier || !password || identifier.length > 254 || password.length > 72) {
    return res.status(400).json({ message: "Identifier dan password wajib diisi dengan format yang valid." });
  }

  try {
    const result = await pool.query(
      "SELECT id, username, email, password_hash, role, created_at FROM users WHERE LOWER(email) = LOWER($1) OR username = $1 LIMIT 1",
      [identifier]
    );
    const user = result.rows[0];
    const validPassword = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !validPassword) {
      return res.status(401).json({ message: "Username/email atau password salah." });
    }

    const token = createToken(user);
    return res.status(200).json({
      message: "Login berhasil.",
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, created_at: user.created_at },
    });
  } catch (error) {
    if (error.message.includes("JWT_SECRET")) {
      console.error(error.message);
      return res.status(500).json({ message: "Konfigurasi autentikasi server belum lengkap." });
    }
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(500).json({ message: "Konfigurasi autentikasi server belum lengkap." });
  }
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token Bearer diperlukan." });
  }
  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET, { issuer: "softdev-api" });
    return next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Akses ditolak." });
    }
    return next();
  };
}

async function me(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
      [req.auth.sub]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    return res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Profile lookup failed:", error.message);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}

module.exports = { register, login, me, authenticateToken, requireRole };
