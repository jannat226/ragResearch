// server/controllers/forgotPasswordController.js
const User = require("../models/User");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }
    // Here you would generate a token and send an email
    // For now, just respond as if successful
    return res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
