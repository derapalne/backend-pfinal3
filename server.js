// ------>>>>> IMPORTS LOCALES
// >>>>>UTILS
import { config } from "./src/utils/config.js";
import { logger, logErr } from "./src/utils/logger.js";
// >>>>>ROUTERS
import routerCart from "./src/routes/carritos.routes.js";
import routerProd from "./src/routes/productos.routes.js";
import routerMain from "./src/routes/main.routes.js";
// >>>>>LOCAL AUTH
import "./src/middlewares/localAuth.js";

// ------>>>>> IMPORTS NODE/NPM
// >>>>>EXPRESS & SESSION
import express, { json, urlencoded } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import compression from "compression";

// >>>>>CLUSTER
import cluster from "cluster";
import os from "os";
const numCPUs = os.cpus.length;

// [-------- * CONSTANTES DEL SERVIDOR * --------]
const PORT = config.PORT;

// [-------- * CONFIGURAR EL SERVIDOR * --------]
const app = express();

// [-------- * MIDDLEWARES * --------]
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: config.MONGO_URI,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        }),
        secret: "ludicolo",
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());

// [-------- * MOTOR DE PLANTILLAS * --------]
app.use(express.static("./public"));
// app.use("/img", express.static("./img"));
app.set("views", "./src/views");
app.set("view engine", "ejs");

// [-------- * ROUTERS * --------]

app.use("/api/productos", routerProd);
app.use("/api/carrito", routerCart);
app.use("/", routerMain);


// ERROR 404

// app.use((err, req, res, next) => {
//     logErr.warn(`Url ${req.url}, método ${req.method} no implementado`);
//     res.status(404).send({
//         error: -2,
//         descripcion: `Url ${req.url}, método ${req.method} no implementado`,
//     });
//     next();
// });

// PRUEBAS

// productosDao.agregar({
//     nombre: "Guerra Biológica",
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

// carritosApi.crearCarrito();
// carritosApi.crearCarrito();
// carritosApi.crearCarrito();

// [-------- * CORRER EL SERVIDOR * --------]

if (config.MODO == "fork") {
    const server = app.listen(PORT, () => {
        logger.info("Servidor escuchando en http://localhost:" + PORT);
    });
    server.on("error", (e) => logErr.error("Error en el servidor: " + e));
} else if (config.MODO == "cluster") {
    if (cluster.isPrimary) {
        logger.info(`Proceso primario corriendo :) ${process.pid}`);
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on("listening", (worker, address) => {
            logger.info(
                `Proceso secundario ${worker.process.pid} escuchando en http://localhost:${address.port}`
            );
        });
    } else {
        const server = app.listen(PORT, () => {
            logger.info("Servidor escuchando en http://localhost:" + PORT);
        });
        server.on("error", (e) => logErr.error("Error en el servidor: " + e));
    }
} else {
    logErr.warn("No se ha elegido un modo de funcionamiento, por favor elija fork o cluster");
}
