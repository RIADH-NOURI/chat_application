import multer from "multer";

const storage = multer.memoryStorage();

const uploadMiddleware = multer({ storage });

export default uploadMiddleware;
