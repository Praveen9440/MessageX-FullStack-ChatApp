import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
  isAuth,
} from "../controllers/auth.js";
import { isAuthenticated } from "../middleware/auth.js";

import multer from "multer";
import { storage } from "../lib/cloudinaryConfig.js";
const upload = multer({ storage });

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put(
  "/update-profile",
  isAuthenticated,
  upload.single("profilePic"),
  updateProfile
);

router.get("/check", isAuthenticated, isAuth);

export default router;
