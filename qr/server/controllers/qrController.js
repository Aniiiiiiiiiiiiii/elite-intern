import { createQRCode } from "../services/qrService.js";

export const generateQRCode = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const qrCode = await createQRCode(text);
    res.json({ qrCode }); // base64 QR returned
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
