require("dotenv").config();
const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>If you didn't request this, ignore this email.</p>
            `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email could not be sent.");
    }
  }
}

module.exports = new EmailService();
