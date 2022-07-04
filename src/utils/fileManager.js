// ------>>>>> MULTER
import multer from "multer";
import { logger } from "./logger.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imgUploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${process.pid}-${Date.now()}-${file.originalname}`);
    }
})

// logger.info(storage);

const upload = multer({storage: storage});
// const upload = multer({dest: './imgUploads'});

export default upload;