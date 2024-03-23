const sendEmail = require("../emailService");

const sendContactForm = async (req, res) => {
    try {
        // Obtener los datos del formulario de la solicitud
        const { fullname, telephone, email, consult } = req.body;

        // Llamar al servicio de correo electrónico para enviar el correo
        await sendEmail({ fullname, telephone, email, consult });

        // Enviar respuesta al cliente
        res.status(200).json({ success: true, message: "Formulario enviado correctamente" });
    } catch (error) {
        console.error("Error al enviar el formulario de contacto:", error);
        res.status(500).json({ success: false, message: "Error al enviar el formulario de contacto" });
    }
};

module.exports = { sendContactForm };