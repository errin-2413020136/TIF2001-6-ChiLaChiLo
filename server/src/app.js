
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend Softdev berhasil berjalan!",
  });
});

app.use("/api/auth", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
