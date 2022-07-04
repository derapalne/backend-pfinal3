// ------>>>>> MULTER
import multer from "multer";
import { logger } from "./logger.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/imgUploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${process.pid}-${file.originalname}`);
    }
})

// logger.info(storage);

const upload = multer({storage: storage});
// const upload = multer({dest: './imgUploads'});

export default upload;