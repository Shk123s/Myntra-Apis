const nodemailer = require("nodemailer");
require('dotenv').config()
//for email
exports.transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.USER_NAME,
      pass:process.env.USER_PASS,
    },
  });