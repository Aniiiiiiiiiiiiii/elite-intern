import QRCode from "qrcode";

/**
 * Generate QR Code as a base64 PNG string
 * @param {string} text - Text or URL to encode
 * @returns {Promise<string>} - Base64 QR Code string
 */
export const createQRCode = async (text) => {
  if (!text || text.trim() === "") {
    throw new Error("Text is required to generate QR Code");
  }

  try {
    // Generate base64 QR code (PNG)
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.92,
      margin: 2,
      color: {
        dark: "#000000", // QR Code dots
        light: "#ffffff" // Background
      }
    });

    return qrDataUrl;
  } catch (error) {
    console.error("QR Service Error:", error.message);
    throw new Error("Failed to create QR code");
  }
};
