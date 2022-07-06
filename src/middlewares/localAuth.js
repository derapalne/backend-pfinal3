import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import UsuariosDaoMongoDB from "../daos/usuariosDaoMongoDB.js";
import { config } from "../utils/config.js";
import { logger } from "../utils/logger.js";
import {sendRegisterMail} from "../utils/mailer.js";
const usuariosDao = new UsuariosDaoMongoDB(config.MONGO_URI);

passport.serializeUser((usuario, done) => {
    done(null, usuario.email);
});

passport.deserializeUser(async (email, done) => {
    const usuario = await usuariosDao.getByEmail(email);
    done(null, usuario);
});

passport.use(
    "local-register",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            const existe = await usuariosDao.getByEmail(email);
            // logger.trace(existe);
            if (existe) {
                return done(null, false);
            } else {
                const usuario = {
                    email: req.body.email,
                    nombre: req.body.nombre,
                    direccion: req.body.direccion,
                    edad: req.body.edad,
                    tel: "+5411" + req.body.tel,
                    avatar: "./imgUploads/" + req.file.filename,
                };
                // logger.trace(usuario);
                usuario.password = await bcrypt.hash(password, 9);
                usuariosDao.agregar(usuario);
                logger.trace("Usuario creado: " + usuario.email);
                sendRegisterMail(usuario);
                return done(null, usuario);
            }
        }
    )
);

passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            const usuario = await usuariosDao.getByEmail(email);
            if(!usuario) {
                return done(null, false);
            }
            const passOk = await bcrypt.compare(password, usuario.password);
            if(!passOk) {
                return done(null, false);
            }
            return done(null, usuario);
        }
    )
);
