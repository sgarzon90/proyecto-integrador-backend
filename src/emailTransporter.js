const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true para usar SSL/TLS
    auth: {
        user: "santigg90@gmail.com",
        pass: "APUQr0Ss8ZM1Xfzn",
    },
});

module.exports = transporter;