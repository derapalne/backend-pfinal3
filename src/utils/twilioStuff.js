import twilio from "twilio";
import { config } from "./config.js";
import { logger } from "./logger.js";
const client = twilio(config.TWILIO_ACC_SID, config.TWILIO_AUTH_TOKEN);

const sendOrderWhatsapp = (user, productos) => {
    let prods = "";
    productos.forEach((p) => {
        prods += `\n ${p.nombre} -|- $${p.precio} -|- COD. ${p.codigo}`;
    });
    client.messages
        .create({
            body: `Ha llegado un pedido de ${user.nombre} (${user.email}): ${prods}`,
            from: "whatsapp:+14155238886",
            to: `whatsapp:${config.ADMIN_TEL}`,
        })
        .then((message) => logger.info(message.sid))
        .done();
};

const sendOrderSMS = (user, productos) => {
    let prods = "";
    productos.forEach((p) => {
        prods += `\n ${p.nombre} -|- $${p.precio} -|- COD. ${p.codigo}`;
    });
    client.messages
        .create({
            body: `Hola, ${user.nombre}! Tu pedido de: ${prods} \nya está en camino!`,
            from: "+12567870326",
            to: user.tel,
        })
        .then((message) => logger.info(message.sid))
        .done();
};

export { sendOrderWhatsapp, sendOrderSMS };
