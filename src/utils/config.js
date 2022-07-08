import "dotenv/config";
import parseArgs from "minimist";

const args = parseArgs(process.argv.slice(2));

export const config = {
    PORT: args.port || process.env.PORT,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
    MODO: args.modo || process.env.MODO,
    ADMIN: args.admin || false,
    TWILIO_ACC_SID: process.env.TWILIO_ACC_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    ADMIN_TEL: process.env.ADMIN_TEL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};
