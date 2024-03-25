const Router = require("express");
const { validateParamId, validateBody } = require("../validations/products.validation.js");
const { getAll, getOne, create, update, remove, uploadImage } = require("../controllers/products.controller.js");
const configureMulter = require("../uploader.image.js");
const transporter = require("../emailTransporter.js");

require("dotenv").config({ path: ENV_PATH });

const routes = Router();
const uploaderImage = configureMulter(); // Ajuste aquí

routes.post("/send-email", async (req, res) => {
    const { fullname, telephone, email, consult } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: process.env.SMTP_EMAIL, // Opcional: puedes especificar una dirección diferente aquí
            subject: "Nueva consulta recibida",
            text: `Nombre: ${fullname}\nTeléfono: ${telephone}\nCorreo: ${email}\nConsulta: ${consult}`,
        });
        console.log("Correo enviado correctamente");
        res.status(200).json({ success: true, message: "Correo enviado correctamente" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ success: false, message: "Error al enviar el correo" });
    }
});

routes
    .get("/", (req, res) => {
        getAll(req, res);
    })
    .get("/:id", validateParamId, (req, res) => {
        getOne(req, res);
    })
    .post("/", validateBody, (req, res) => {
        create(req, res);
    })
    .put("/:id", validateParamId, validateBody, (req, res) => {
        update(req, res);
    })
    .delete("/:id", validateParamId, (req, res) => {
        remove(req, res);
    })
    .post("/upload", uploaderImage.single("file"), (req, res) => {
        uploadImage(req, res);
    });

module.exports = routes;