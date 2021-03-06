// >>>>>EXPRESS
import { Router } from "express";
const routerMain = Router();
// >>>>>PASSPORT
import passport from "passport";
// >>>>>DBs
import { config } from "../utils/config.js";
import ProductosDaoMongoDB from "../daos/productosDaoMongoDB.js";
const productosDao = new ProductosDaoMongoDB(config.MONGO_URI);
import CarritosDaoMongoDB from "../daos/carritosDaoMongoDB.js";
const carritosDao = new CarritosDaoMongoDB(config.MONGO_URI);
// >>>>>LOGUEO
import { logger, logErr } from "../utils/logger.js";
// >>>>>GUARDADO DE IMAGENES
import upload from "../utils/fileManager.js";
// >>>>>MIDDLEWARES
import {isAuth} from "../middlewares/isAuthenticated.js"

routerMain.get("/", isAuth, async (req, res) => {
    try {
            let carrito = await carritosDao.getByEmail(req.user.email);
            if (!carrito || carrito.userEmail != req.user.email) {
                await carritosDao.agregarCart(req.user.email);
                carrito = await carritosDao.getByEmail(req.user.email);
            }
            res.status(200).render("main", {
                usuario: req.user,
                productos: await productosDao.getAll(),
                carrito: carrito,
            });
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

routerMain.get("/login-error", (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect("/");
        } else {
            res.status(200).render("login", { error: "Credenciales incorrectas!" });
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
    "/register", isAuth,
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

routerMain.post("/logout", isAuth, (req, res) => {
    try {
            logger.trace("Desruyendo datos de sesi??n");
            req.session.destroy((err) => {
                logger.trace("Datos de sesi??n destruidos");
                res.status(200).render("login", {error: null});
            });
    } catch (e) {
        logErr.error(e);
    }
});

export default routerMain;

// Agregar productos, DESCOMENTAR Y COMENTAR DE A UNO SINO SE CARGAN MAL

// productosDao.deleteAll();

// productosDao.agregar({
//     nombre: "Guerra Biol??gica",
//     descripcion: "Efectivo contra tu vecino molesto.",
//     codigo: "GB398",
//     stock: 10,
//     precio: 800000000,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/9-256.png",
// });

// productosDao.agregar({
//     nombre: "Soborno",
//     descripcion: "Funciona sin fallas, siempre y cuando no te enganchen.",
//     codigo: "S133",
//     stock: 15,
//     precio: 75000,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/7-256.png",
// });

// productosDao.agregar({
//     nombre: "Manteca Brillante",
//     descripcion: "Es dura. No se recomienda comer.",
//     codigo: "MB078",
//     stock: 50,
//     precio: 150000,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/29-256.png",
// });

// productosDao.agregar({
//     nombre: "Martillo Bromista",
//     descripcion: "Convierte a tus amigos en monedas de diez centavos sin esfuerzo.",
//     codigo: "MB120",
//     stock: 2,
//     precio: 700,
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/finance-152/64/26-256.png",
// });
