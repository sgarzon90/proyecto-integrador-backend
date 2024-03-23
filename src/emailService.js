const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "puntoorienteempresa@gmail.com",
        pass: "Anypassword24",
    },
});

const sendEmail = async (emailData) => {
    try {
        await transporter.sendMail({
            from: emailData.email,
            to: "puntoorienteempresa@gmail.com",
            subject: "Nueva consulta desde el formulario de contacto",
            html: `
                <p>Nombre: ${emailData.fullname}</p>
                <p>Teléfono: ${emailData.telephone}</p>
                <p>Email: ${emailData.email}</p>
                <p>Consulta: ${emailData.consult}</p>
            `,
        });
        console.log("Correo electrónico enviado con éxito.");
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
    }
};

module.exports = sendEmail;