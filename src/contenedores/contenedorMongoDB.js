import mongoose from 'mongoose';
import { logger, logErr } from '../utils/logger.js';

class ContenedorMongoDB {
    constructor(uri, Model) {
        this.uri = uri;
        this.Model = Model;
        // logger.info(this.uri);
    }

    async guardar(data) {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const largestId = await this.Model.find({},{_id: 0, id: 1}).sort({id: -1}).limit(1);
            if(largestId[0]) {
                data.id = largestId[0].id + 1;
            } else {
                data.id = 0;
            }
            data.timestamp = Date.now();
            const nuevaData = new this.Model(data);
            await nuevaData.save();
            logger.info(data);
            logger.info("Data guardada :) AGREGAR TIPO DE DATA");
            return data.id;
        } catch (e) {
            logErr.error(e);
        }
    }

    async getAll() {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            return await this.Model.find({}, { _id: 0, __v: 0 });
        } catch (e) {
            logErr.error(e);
        }
    }

    async getById(id) {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const respuesta = await this.Model.find({ id: id }, { _id: 0, __v: 0 });
            if(respuesta[0]) {
                return respuesta[0];
            } else {
                return {error: "Elemento no encontrado"};
            }
             
        } catch (e) {
            logErr.error(e);
        }
    }

    async deleteById(id) {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            const deletedCount = await this.Model.deleteOne({ id: id });
            if (deletedCount.deletedCount != 0) {
                return deletedCount;
            } else {
                return "No se ha podido borrar el elemento";
            }
        } catch (e) {
            logErr.error(e);
        }
    }

    async deleteAll() {
        try {
            mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            const deletedCount = await this.Model.deleteMany({});
            if (deletedCount.deletedCount != 0) {
                return deletedCount;
            } else {
                return "No se ha podido borrar";
            }
        } catch (e) {
            logErr.error(e);
        }
    }
}

export default ContenedorMongoDB;