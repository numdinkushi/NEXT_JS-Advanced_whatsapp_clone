import { Router } from "express";
import { addAudioMessage, addImageMessage, addMessage, getMessages } from "../controllers/MessageController.js";
import multer from "multer";

const router = Router();

const uploadAudio = multer({dest: "uploads/recordings"});
const uploadImage = multer({dest: "uploads/images"});

router.post("/add-messages", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadImage.single("audio"), addAudioMessage);

export default router;