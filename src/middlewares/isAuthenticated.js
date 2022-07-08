export const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).redirect("/login");
    }
};