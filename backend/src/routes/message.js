import express from "express";
import {
  getUsersForSideBar,
  getMessages,
  sendMessage,
  // imageUpload,
} from "../controllers/message.js";
import multer from "multer";
import { storage } from "../lib/cloudinaryConfig.js";
const upload = multer({ storage });

import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", isAuthenticated, getUsersForSideBar);
router.get("/:id", isAuthenticated, getMessages);
router.post("/send/:id", isAuthenticated, upload.single("image"), sendMessage);

export default router;
