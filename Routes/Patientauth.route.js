// Routes/Patient.auth.route.js

const express = require("express");
const router = express.Router();

const {
  requestPasswordResetOTP,
  verifyOTPAndResetPassword,
} = require("../Controllers/Patientauth.controller");

// Route to request password reset OTP by email
router.post("/forgot-password", requestPasswordResetOTP);

// Route to verify OTP and reset the password
router.post("/reset-password", verifyOTPAndResetPassword);

module.exports = router;
