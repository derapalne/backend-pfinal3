import ContenedorMongoDB from "../contenedores/contenedorMongoDB.js";
import Usuarios from "../models/usuarios.js";
import { logErr, logger } from "../utils/logger.js";
import mongoose from "mongoose";

class UsuariosDaoMongoDB extends ContenedorMongoDB {
    constructor(uri) {
        super(uri, Usuarios);
    }

    async agregar(usuario) {
        try {
            return await this.guardar(usuario);
        } catch (e) {
            logErr.error(e);
        }
    }

    async getByEmail(email) {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const respuesta = await this.Model.find({ email: email }, { _id: 0, __v: 0 });
            if(respuesta[0]) {
                return respuesta[0];
            } else {
                return null;
            }
             
        } catch (e) {
            logErr.error(e);
        }
    }

}

export default UsuariosDaoMongoDB;
