const express = require("express");
const router = express.Router();
const { validateEmail } = require("../validations/email.validation.js");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: ENV_PATH });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

router.post("/", validateEmail, async (req, res) => {
    const { fullname, telephone, email, consult } = req.body;

    const mailOptions = {
        from: email,
        to: "puntoorienteempresa@gmail.com",
        subject: "Consulta recibida desde el formulario de contacto",
        text: `Nombre: ${fullname}\nTeléfono: ${telephone}\nEmail: ${email}\nConsulta: ${consult}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Correo enviado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al enviar el correo" });
    }
});

module.exports = router;