const express = require("express");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const productsRouter = require("./routes/products.router.js");
const database = require("./connectionDB.js");
const { ENV_PATH, DIR_PUBLIC_PATH } = require("./constants/paths.js");
const { ERROR_SERVER } = require("./constants/messages.js");
const { validateEmail } = require("./validations/email.validation.js");

require("dotenv").config({ path: ENV_PATH });

const server = express();
const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || "localhost";

server.use(bodyParser.json());
server.use(cors());
server.use("/api/products", productsRouter);
server.use("/public", express.static(DIR_PUBLIC_PATH));

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

server.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(error.code).send({ success: false, message: error.field });
    }
    res.status(500).send({ success: false, message: ERROR_SERVER });
});

server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

server.options("", cors());

const sendEmail = async (req, res) => {
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
};

server.post("/contact", validateEmail, sendEmail);

server.listen(PORT, HOST, () => {
    console.log(`Server NodeJS version: ${process.version}`);
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    database.connect(process.env.DATABASE_URL, process.env.DATABASE_NAME);
});

process.on("SIGINT", async () => {
    await database.desconnect();
    process.exit();
});