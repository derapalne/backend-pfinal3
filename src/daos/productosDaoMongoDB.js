import mongoose from 'mongoose';
import ContenedorMongoDB from "../contenedores/contenedorMongoDB.js"
import check from "../utils/check.js";
import Productos from "../models/productos.js";

class ProductosDaoMongoDB extends ContenedorMongoDB {
    constructor(uri) {
        super(uri, Productos);
    }

    async agregar(producto) {
        if(check(producto)) {
            try {
               return await this.guardar(producto);
            } catch(e) {
                console.log(e);
            }
        }
    }

    async updateById(id, producto) {
        if (check(producto)) {
            try {
                mongoose.connect(this.uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });

                const res = await this.Model.updateOne(
                    { id: id },
                    {
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        codigo: producto.codigo,
                        precio: producto.precio,
                        thumbnail: producto.thumbnail,
                        stock: producto.stock,
                        timestamp: producto.timestamp,
                    }
                );
                console.log(res);
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("El producto no cumple los requisitos");
        }
    }
}

export default ProductosDaoMongoDB;