import ContenedorMongoDB from "../contenedores/contenedorMongoDB.js";
import mongoose from "mongoose";
import Carritos from "../models/carritos.js";
import check from "../utils/check.js";

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
            const carrito = {productos: []};
            return this.guardar(carrito);
        } catch(e) {
            console.log(e);
        }
    }

    async agregarProd(id, producto) {
        if(check(producto)) {
            try {
                connect(this.uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                const carrito = await this.Model.find({id: id});
                if(carrito.length) {
                    await carrito[0].productos.push(producto);
                    await this.Model.updateOne({id: id}, {productos: carrito[0].productos});
                    return producto.id;
                } else {
                    return "Id inexistente."
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            return "El producto no cumple los requisitos"
        }
    }

    async deleteProdById(id, idProd) {
        if(check(producto)) {
            try {
                connect(this.uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                const carrito = await this.Model.find({id: id});
                if(carrito.length) {
                    const oldLenght = carrito[0].productos.length;
                    carrito[0].productos = await carrito[0].productos.filter((e) => e.id != idProd);
                    if(carrito[0].productos.length != oldLenght) {
                        await this.Model.updateOne({id: id}, {productos: carrito[0].productos});
                        return idProd;
                    } else {
                        return "No se ha podido borrar el producto"
                    }
                    
                } else {
                    return "Id inexistente."
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            return "El producto no cumple los requisitos"
        }
    }
    
}

export default CarritosDaoMongoDB;