const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const productsRouter = require("./routes/products.router.js");
const contactRouter = require("./routes/contact.router.js");
const database = require("./connectionDB.js");
const { ENV_PATH, DIR_PUBLIC_PATH } = require("./constants/paths.js");
const { ERROR_SERVER } = require("./constants/messages.js");

require("dotenv").config({ path: ENV_PATH });

const server = express();
const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || "localhost";

server.use(bodyParser.json());
server.use(cors());
server.use("/api/products", productsRouter);
server.use("/api/contact", contactRouter); // Usar el enrutador de contacto para la ruta /api/contact
server.use("/public", express.static(DIR_PUBLIC_PATH));

server.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(error.code).send({ success: false, message: error.field });
    }
    res.status(500).send({ success: false, message: ERROR_SERVER });
});

server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

server.listen(PORT, HOST, () => {
    console.log(`Server NodeJS version: ${process.version}`);
    console.log(`Ejecutándose en http://${HOST}:${PORT}`);
    database.connect(process.env.DATABASE_URL, process.env.DATABASE_NAME);
});

process.on("SIGINT", async () => {
    await database.desconnect();
    process.exit();
});