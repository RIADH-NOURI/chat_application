import express from "express";

import {
  getMessages,
  getMessageById,
  getLatestMessages,
  getImagesByMessageId
} from "../../controllers/private/privateMessage.controller.js";
import uploadMiddleware from "../../middlewares/uploadMiddleware.js";
import {
  uploadManyImages,
  uploadManyFiles,
} from "../../utils/uploadServices.js";
import { rateLimitMiddleware } from "../../middlewares/rateLimitMiddleware.js";
const router = express.Router();


router.get("/private/images/:id", getImagesByMessageId)
router.get("/private/messages/:id", getMessages);
router.put(
  "/private/messages/images/:messageId",
  rateLimitMiddleware,

  uploadMiddleware.array("images"),
  (req, res, next) => {
    console.log("Received files:", req.files);
    next();
  },
  uploadManyImages
);

router.put(
  "/private/messages/files/:messageId",
  rateLimitMiddleware,

  uploadMiddleware.array("files"),
  (req, res, next) => {
    console.log("Received file:", req.files);
    next();
  },
  uploadManyFiles
);
router.get("/message/:id", getMessageById);
router.get("/private/messages/:id/latest", getLatestMessages);

export default router;
