const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "puntoorienteempresa@gmail.com", // Tu correo electrónico
        pass: "wsgv zdlc sfsy rpmk", // Tu contraseña
    },
});

// Función para enviar correo electrónico
const sendEmail = async (fullname, email, telephone, consult) => {
    try {
        // Configura el correo electrónico
        const mailOptions = {
            from: "puntoorienteempresa@gmail.com", // Remitente
            to: "santigg90@gmail.com", // Destinatario (en este caso, el correo de la tienda)
            subject: "Consulta desde el formulario de contacto", // Asunto del correo
            html: `
                <p>Nombre: ${fullname}</p>
                <p>Email: ${email}</p>
                <p>Teléfono: ${telephone}</p>
                <p>Consulta: ${consult}</p> `
            , // Cuerpo del correo en formato HTML
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
        throw new Error("Error al enviar el correo electrónico");
    }
};

module.exports = { sendEmail };