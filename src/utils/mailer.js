import { createTransport } from "nodemailer";
import { config } from "./config.js";
import { logErr } from "./logger.js";

const TEST_MAIL = config.ADMIN_EMAIL;

const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "carissa.okon55@ethereal.email",
        pass: "zh3Jr8mXtrFbWR57KB",
    },
});

const sendRegisterMail = async (user) => {
    const mailOptions = {
        from: "App Dera Commerce",
        to: TEST_MAIL,
        subject: "Nuevo registro!",
        html: `<h1>Nuevo Registro: ${user.nombre}</h1>
                <p>Email:${user.email}</p>
                <p>Direccion:${user.direccion}</p>
                <p>Edad:${user.edad}</p>
                <p>Teléfono:${user.tel}</p>`,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (e) {
        logErr.error(e);
    }
};

const sendOrderMail = async (user,prods) => {
    let pedido = '';
    prods.forEach((prod) => {
        pedido += `<p>${prod.nombre} -|- $${prod.precio} -|- COD. ${prod.codigo}</p>`
    })
    const mailOptions = {
        from: "App Dera Commerce",
        to: TEST_MAIL,
        subject: `Nuevo Pedido de ${user.nombre}`,
        html: `<h1>Nuevo Pedido de: ${user.nombre}</h1>
                <p>Email:${user.email}</p>` + pedido,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (e) {
        logErr.error(e);
    }
}

export { sendRegisterMail, sendOrderMail };