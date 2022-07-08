import {Router} from 'express';
import ProductosDaoMongoDB from '../daos/productosDaoMongoDB.js';
import {config} from '../utils/config.js';
import {isAdmin} from '../middlewares/isAdmin.js';
import { isAuth } from '../middlewares/isAuthenticated.js';

const routerProd = Router();
const productosDao = new ProductosDaoMongoDB(config.MONGO_URI);

// ---------------------------------------------- ROUTER PRODUCTOS ----------------------//

// Me permite listar todos los productos disponibles ó un producto por su ID
// USUARIO + ADMIN
routerProd.get("/:id?", isAuth, async (req, res) => {
        const id = req.params.id;
        if (isNaN(id)) {
            res.status(200).json(await productosDao.getAll());
        } else {
            const respuesta = await productosDao.getById(id);
            if (respuesta.error) {
                res.status(204).json(respuesta);
            } else {
                res.status(200).json(respuesta);
            }
        }
});

// Para incorporar productos al listado
// ADMIN
routerProd.post("/", isAdmin, async (req, res) => {
    const producto = req.body.producto;
    const prodId = await productosDao.agregar(producto);
    res.status(201).json(prodId);
});

// Actualiza un producto por su ID
// ADMIN
routerProd.put("/:id", isAdmin, async (req, res) => {
    const admin = req.body.admin;
    const id = req.params.id;
    const producto = req.body.producto;
    const prodId = await productosDao.updateById(id, producto);
    res.status(201).json(prodId);
});

// Borra un producto por su ID
// ADMIN
routerProd.delete("/:id", isAdmin, async (req, res) => {
    const admin = req.body.admin;
    const id = req.params.id;
    const prodId = await productosDao.deleteById(id);
    res.status(200).json(prodId);
});

export default routerProd;