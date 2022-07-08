import { Router } from "express";
import CarritosDaoMongoDB from "../daos/carritosDaoMongoDB.js";
import ProductosDaoMongoDB from "../daos/productosDaoMongoDB.js";
import { config } from "../utils/config.js";
import { logger } from "../utils/logger.js";
import { sendOrderMail } from "../utils/mailer.js";
import { sendOrderSMS, sendOrderWhatsapp } from "../utils/twilioStuff.js";

import { isAuth } from "../middlewares/isAuthenticated.js";

const routerCart = Router();
const carritosDao = new CarritosDaoMongoDB(config.MONGO_URI);
const productosDao = new ProductosDaoMongoDB(config.MONGO_URI);

// ---------------------------------------------- ROUTER CARRITO ------------------------//

// Crea un carrito y devuelve su ID
routerCart.post("/", isAuth, async (req, res) => {
        res.status(201).json(await carritosDao.agregarCart());
});

// Vacía un carrito y lo elimina
routerCart.delete("/:id", isAuth, async (req, res) => {
        const id = req.params.id;
        res.status(200).json(await carritosDao.deleteById(id));
});

// Me permite listar todos los productos guardados en el carrito
routerCart.get("/:id/productos", isAuth, async (req, res) => {
        const id = req.params.id;
        const carrito = await carritosDao.getById(id);
        if (carrito) {
            res.status(200).json(await carrito.productos);
        } else {
            res.status(404).json({ error: "Carrito inexistente" });
        }
});

// Para incorporar productos al carrito por su ID de producto
routerCart.post("/:id/productos", isAuth, async (req, res) => {
        const idCart = req.params.id;
        const idProd = req.body.idProd;
        const doDelete = req.body.delete;
        // Si existe el valor doDelete, significa BORRAR el producto 👍
        if (doDelete) {
            const deleteReturn = await carritosDao.deleteProdBySlot(idCart, idProd);
            // logger.trace({deleteReturn});
            // Si no es un número, es un error!
            if (isNaN(deleteReturn)) {
                res.status(204).json(deleteReturn);
            } else {
                // Si es un número quiere decir que fue borrado con éxito
                res.status(201).redirect("/");
            }
        } else {
            const producto = await productosDao.getById(idProd);
            if (producto.error) {
                res.status(204).json(producto);
            } else {
                const carritoReturn = await carritosDao.agregarProd(idCart, producto);
                // Si no es un número, es un error!
                if (isNaN(carritoReturn)) {
                    res.status(204).json(carritoReturn);
                } else {
                    // Si es un número quiere decir que fue agregado con éxito
                    res.status(201).redirect("/");
                }
            }
        }
});

// Eliminar un producto del carrito por su ID de carrito e ID de producto
routerCart.delete("/:id/productos/:id_prod", isAuth, (req, res) => {
        const idCart = req.params.id;
        const idProd = req.params.id_prod;
        carritosDao.deleteProdById(idCart, idProd);
        res.status(200).json({ mensaje: "El producto fue borrado" });
});

routerCart.post("/:id/confirmar", isAuth, async (req, res) => {
        const idCart = req.params.id;
        const productos = await carritosDao.confirmarPedido(idCart);
        sendOrderMail(req.user, productos);
        sendOrderSMS(req.user, productos);
        sendOrderWhatsapp(req.user, productos);
        res.status(200).render("pedido-confirmado");
})

export default routerCart;
