// ADMIN CHECK

export const isAdmin = (req, res, next) => {
    let admin = true;
    if (admin) {
        next();
    } else {
        res.status(203).json({
            error: -1,
            descripcion: `Ruta ${req.url} Método ${req.method} no autorizado`,
        });
    }
};