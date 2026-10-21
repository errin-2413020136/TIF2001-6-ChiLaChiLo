require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");
const pool = require("./config/database");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

app.get("/", (_req, res) => {
  res.json({ message: "Softdev backend API is running", version: "v1" });
});

app.get("/api/v1/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (_error) {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.use("/api/v1/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Request body harus berupa JSON yang valid." });
  }
  console.error("Unhandled request error:", err.message);
  return res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend berjalan di http://localhost:${PORT}`));
}

module.exports = app;
