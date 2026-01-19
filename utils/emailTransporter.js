// emailTransporter.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  port: process.env.NODEMAILER_PORT,
  host: process.env.NODEMAILER_HOST,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

module.exports = transporter;
