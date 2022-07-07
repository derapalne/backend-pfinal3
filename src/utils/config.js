import "dotenv/config";

export const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
    MODO: process.env.MODO || "fork",
    TWILIO_ACC_SID: process.env.TWILIO_ACC_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    ADMIN_TEL: process.env.ADMIN_TEL,
    ADMIN_MAIL: process.env.ADMIN_MAIL,
};
