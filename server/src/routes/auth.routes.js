const express = require("express");
const { register, login, me, authenticateToken } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, me);

module.exports = router;
