import ContenedorMongoDB from "../contenedores/contenedorMongoDB.js";
import mongoose from "mongoose";
import Carritos from "../models/carritos.js";
import check from "../utils/check.js";
import { logger } from "../utils/logger.js";

class CarritosDaoMongoDB extends ContenedorMongoDB {
    constructor(uri) {
        super(uri, Carritos);
    }

    async agregarCart() {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const carrito = { productos: [] };
            return this.guardar(carrito);
        } catch (e) {
            console.log(e);
        }
    }

    async agregarProd(id, producto) {
        if (check(producto)) {
            try {
                mongoose.connect(this.uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                const carrito = await this.Model.find({ id: id });
                if (carrito.length) {
                    // Agregar el SLOT en el carrito es mi intento de solucionar el problema de diseño
                    // que plantea el desafío, se pueden tener varios del mismo producto pero eliminarlos
                    // o seleccionarlos individualmente termina siendo imposible ya que todos sus datos son 
                    // iguales. Igual no puedo hacer que esta línea de abajo funcione y le agregue
                    // la propiedad de SLOT al producto.
                    producto.slot = carrito[0].productos.length;
                    await carrito[0].productos.push(producto);
                    await this.Model.updateOne({ id: id }, { productos: carrito[0].productos });
                    // logger.trace(producto, carrito[0].productos.length);
                    return producto.id;
                } else {
                    return "Id inexistente.";
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            return "El producto no cumple los requisitos";
        }
    }

    async deleteProdBySlot(id, slotProd) {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const carritoArray = await this.Model.find({ id: id });
            // logger.trace(carritoArray[0].productos);
            if (carritoArray.length) {
                const oldLenght = carritoArray[0].productos.length;
                carritoArray[0].productos = carritoArray[0].productos.filter((e) => e.slot != slotProd);
                logger.trace(carritoArray[0].productos.length + " " + oldLenght)
                if (carritoArray[0].productos.length != oldLenght) {
                    await this.Model.updateOne({ id: id }, { productos: carritoArray[0].productos });
                    return slotProd;
                } else {
                    return "No se ha podido borrar el producto";
                }
            } else {
                return "Id inexistente.";
            }
        } catch (e) {
            console.log(e);
        }
    }

    async deleteAllProds(id) {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const carritoArray = await this.Model.find({ id: id });
            if (carritoArray.length) {
                carritoArray[0].productos = [];
                logger.trace("CarritoArray: --- "+carritoArray[0]);
                await this.guardar(carritoArray[0]);
                return carritoArray[0].id;
            } else {
                return "Id inexistente.";
            }
        } catch (e) {
            console.log(e);
        }
    }

    async confirmarPedido(id) {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const carritoArray = await this.Model.find({ id: id });
            if (carritoArray.length) {
                const productos = carritoArray[0].productos;
                const ok = await this.deleteAllProds(id);
                if(isNaN(ok)) {
                    return "No se han podido borrar los productos del carrito"
                } else {
                    return productos;
                }
            } else {
                return "Id inexistente.";
            }
        } catch (e) {
            console.log(e);
        }
    }
}

export default CarritosDaoMongoDB;
