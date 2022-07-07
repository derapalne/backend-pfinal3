// ADMIN CHECK
import { config } from "../utils/config.js";

export const isAdmin = (req, res, next) => {
    if (config.ADMIN) {
        next();
    } else {
        res.status(203).json({
            error: -1,
            descripcion: `Ruta ${req.url} Método ${req.method} no autorizado`,
        });
    }
};