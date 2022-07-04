import log4js from "log4js";

log4js.configure({
    appenders: {
        consola: {type: 'console'},
        archivo: {type: 'file', filename: 'errors.log'}
    },
    categories: {
        default : {appenders: ['consola'], level: "all"},
        log: {appenders: ["consola"], level: "all"},
        logErr: {appenders: ["consola","archivo"], level: "warn"}
    }
});

const logger = log4js.getLogger("log");
const logErr = log4js.getLogger("logErr");

export { logger, logErr };