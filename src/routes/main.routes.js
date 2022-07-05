// >>>>>EXPRESS
import { Router } from "express";
const routerMain = Router();
// >>>>>PASSPORT
import passport from "passport";
// >>>>>DBs
import { config } from "../utils/config.js";
import ProductosDaoMongoDB from "../daos/productosDaoMongoDB.js";
const productosDao = new ProductosDaoMongoDB(config.MONGO_URI);
// >>>>>LOGUEO
import { logger, logErr } from "../utils/logger.js";
// >>>>>GUARDADO DE IMAGENES
import upload from "../utils/fileManager.js";

routerMain.get("/", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            res.redirect("/login");
        } else {
            res.status(200).render("main", {
                usuario: req.user,
                productos: await productosDao.getAll(),
            });
        }
    } catch (e) {
        logErr.error(e);
    }
});

routerMain.get("/login", (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect("/");
        } else {
            res.status(200).render("login", { error: null });
        }
    } catch (e) {
        logErr.error(e);
    }
});

routerMain.get("/register", (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect("/");
        } else {
            res.status(200).render("register", { error: null });
        }
    } catch (e) {
        logErr.error(e);
    }
});

routerMain.get("/register-error", (req, res) => {
    logger.trace(req.body);
    try {
        if (req.isAuthenticated()) {
            res.redirect("/");
        } else {
            res.status(200).render("register", { error: "Credenciales Incorrectas!" });
        }
    } catch (e) {
        logErr.error(e);
    }
});

routerMain.post(
    "/register",
    upload.single("avatar"),
    passport.authenticate("local-register", {
        successRedirect: "/",
        failureRedirect: "/register-error",
        passReqToCallback: true,
    }),
    (req, res, next) => {}
);

routerMain.post(
    "/login",
    passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login-error",
        passReqToCallback: true,
    }),
    (req, res, next) => {}
);

export default routerMain;