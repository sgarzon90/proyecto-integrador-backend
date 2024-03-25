const nodemailer = require("nodemailer");
require("dotenv").config({ path: ENV_PATH });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true para usar SSL/TLS
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

module.exports = transporter;