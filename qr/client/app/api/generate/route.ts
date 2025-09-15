import { NextResponse } from "next/server"
import QRCode from "qrcode"

type Body = {
  text?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const text = (body?.text || "").toString().trim()

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 })
    }

    // Generate a PNG Data URL, e.g. "data:image/png;base64,AAA..."
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 2,
      scale: 8,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })

    // Return only the base64 payload to match the contract
    const base64 = dataUrl.split(",")[1] || ""
    return NextResponse.json({ qrCode: base64 })
  } catch (err) {
    console.error("[qr] generation error:", err)
    return NextResponse.json({ error: "Failed to generate QR code." }, { status: 500 })
  }
}
