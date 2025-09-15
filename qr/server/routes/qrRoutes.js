import express from "express";
import { generateQRCode } from "../controllers/qrController.js";

const router = express.Router();

// @route   POST /api/qr/generate
// @desc    Generate a QR code for given text/URL
router.post("/generate", generateQRCode);

export default router;