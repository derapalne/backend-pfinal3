import mongoose from "mongoose";

const usuariosCollection = "usuarios";

const usuariosSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    edad: { type: Number, required: true },
    tel: { type: String, required: true },
    avatar: { type: String, required: true },
});

const Usuarios = new mongoose.model(usuariosCollection, usuariosSchema);

export default Usuarios;
