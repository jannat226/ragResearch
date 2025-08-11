// server/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const forgotPasswordController = require("../controllers/forgotPasswordController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", forgotPasswordController.forgotPassword);

module.exports = router;
