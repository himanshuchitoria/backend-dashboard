// Controllers/Patient.authController.js

const PatientModel = require("../Models/Patient.model");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../Utils/emailsender");

const otpStore = new Map(); // Temporary in-memory OTP store, consider Redis for production

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP - send OTP email for forgot password
const requestPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if patient exists
    const patient = await PatientModel.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "Email not found", status: false });
    }

    const otp = generateOTP();

    // Store OTP with expiration (for demo: 10 mins)
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email", status: true });
  } catch (error) {
    console.error("Error in requestPasswordResetOTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP and reset password
const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ message: "No OTP request found for this email", status: false });
    }

    if (record.expires < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired", status: false });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", status: false });
    }

    // OTP valid, hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in DB
    await PatientModel.findOneAndUpdate({ email }, { password: hashedPassword });

    otpStore.delete(email);

    res.status(200).json({ message: "Password reset successful", status: true });
  } catch (error) {
    console.error("Error in verifyOTPAndResetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  requestPasswordResetOTP,
  verifyOTPAndResetPassword
};
