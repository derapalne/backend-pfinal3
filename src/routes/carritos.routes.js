import {Router} from 'express';
import CarritosDaoMongoDB from '../daos/carritosDaoMongoDB.js';
import ProductosDaoMongoDB from '../daos/productosDaoMongoDB.js';
import {config} from '../utils/config.js';

const routerCart = Router();
const carritosDao = new CarritosDaoMongoDB(config.MONGO_URI);
const productosDao = new ProductosDaoMongoDB(config.MONGO_URI);

// ---------------------------------------------- ROUTER CARRITO ------------------------//

// Crea un carrito y devuelve su ID
routerCart.post("/", async (req, res) => {
    res.status(201).json(await carritosDao.agregarCart());
});

// Vacía un carrito y lo elimina
routerCart.delete("/:id", async (req, res) => {
    const id = req.params.id;
    res.status(200).json(await carritosDao.deleteById(id));
});

// Me permite listar todos los productos guardados en el carrito
routerCart.get("/:id/productos", async (req, res) => {
    const id = req.params.id;
    const carrito = await carritosDao.getById(id);
    if (carrito) {
        res.status(200).json(await carrito.productos);
    } else {
        res.status(404).json({ error: "Carrito inexistente" });
    }
});

// Para incorporar productos al carrito por su ID de producto
routerCart.post("/:id/productos", async (req, res) => {
    const idCart = req.params.id;
    const idProd = req.body.idProd;
    const producto = await productosDao.getById(idProd);
    if (producto.error) {
        res.status(204).json(producto);
    } else {
        const carritoReturn = await carritosDao.agregarProd(idCart, producto);
        if (carritoReturn) {
            res.status(204).json(carritoReturn);
        } else {
            res.status(201).json({ mensaje: "Producto agregado." });
        }
    }
});

// Eliminar un producto del carrito por su ID de carrito e ID de producto
routerCart.delete("/:id/productos/:id_prod", (req, res) => {
    const idCart = req.params.id;
    const idProd = req.params.id_prod;
    carritosDao.deleteProdById(idCart, idProd);
    res.status(200).json({ mensaje: "El producto fue borrado" });
});

export default routerCart;