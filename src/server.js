const express = require("express");
const multer = require("multer");
const cors = require("cors");

const { sendEmail } = require("./controllers/contact.controller.js");
const productsRouter = require("./routes/products.router.js");
const database = require("./connectionDB.js");

const { ENV_PATH, DIR_PUBLIC_PATH } = require("./constants/paths.js");
const { ERROR_SERVER } = require("./constants/messages.js");

// variables de entorno
require("dotenv").config({ path: ENV_PATH });

// Configuración de express
const server = express();
const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || "localhost";

// Middlewares
server.use(express.json());

server.use(cors());
server.options("", cors());
server.use("/api/products", productsRouter);

// Configuración de carpeta estatica
server.use("/public", express.static(DIR_PUBLIC_PATH));

// Control de errores
server.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(error.code).send({ success: false, message: error.field });
    }
    res.status(500).send({ success: false, message: ERROR_SERVER });
});

server.post("/api/contact", async (req, res) => {
    try {
        const { fullname, email, telephone, consult } = req.body;
        await sendEmail(fullname, email, telephone, consult);
        res.status(200).send({ success: true, message: "Consulta enviada con éxito" });
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
});

// Control de rutas inexistentes
server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Método oyente de solicitudes
server.listen(PORT, HOST, () => {
    console.log(`Server NodeJS version: ${process.version}`);
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    database.connect(process.env.DATABASE_URL, process.env.DATABASE_NAME);
});

// Método para desconectar MongoDB
process.on("SIGINT", async () => {
    await database.desconnect();
    process.exit();
});