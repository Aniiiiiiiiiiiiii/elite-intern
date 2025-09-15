import express from "express";
import morgan from "morgan";
import qrRoutes from "./routes/qrRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(morgan("dev"));  // Logger

// Static folder to serve generated QR codes
app.use("/qrcodes", express.static("public/qrcodes"));

// Routes
app.use("/api/qr", qrRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});