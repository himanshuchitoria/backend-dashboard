// Utils/emailSender.js

const nodemailer = require('nodemailer');

// Create transporter configuration using Gmail SMTP and environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,         // Your email address (from .env)
    pass: process.env.EMAIL_APP_PASSWORD, // Your Gmail app password (from .env)

  },
  debug: true, // Enable debug output
  logger: true // Log information in console
});

/**
 * Sends an OTP email to the specified recipient
 * @param {string} to - The recipient's email address
 * @param {string | number} otp - The OTP code to send
 * @returns {Promise} resolves if email sent successfully, rejects otherwise
 */
async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code for Password Reset - ReformMe Healthcare',
    text: `Dear user,\n\nYour OTP code for resetting your password is: ${otp}\n\nIf you did not request this, please ignore this email.\n\nThank you. \n\n Team ReformMe Healthcare`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendOTPEmail };
