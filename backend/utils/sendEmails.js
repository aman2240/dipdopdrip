// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({to, subject, text, html = null}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // App password, not your regular Gmail password
      },
    });

    const mailOptions = {
      from: `"dipdopdrip" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text,
      ...(html && { html }), // optional HTML version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
