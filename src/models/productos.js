import mongoose from "mongoose";

const productosCollection = "productos";

const productosSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: String, required: true },
    precio: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

const Productos = new mongoose.model(productosCollection, productosSchema);

export default Productos;
