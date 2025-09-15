"use client"

import { useCallback, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GenerateResponse = {
  qrCode: string // base64 PNG without data URL prefix
}

export function QrGenerator() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrBase64, setQrBase64] = useState<string | null>(null)

  const dataUrl = useMemo(() => {
    if (!qrBase64) return null
    return `data:image/png;base64,${qrBase64}`
  }, [qrBase64])

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setQrBase64(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to generate QR code.")
        throw new Error(msg || "Failed to generate QR code.")
      }
      const json = (await res.json()) as GenerateResponse
      if (!json?.qrCode) throw new Error("Invalid response from server.")
      setQrBase64(json.qrCode)
    } catch (e: any) {
      setError(e?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }, [text])

  const handleDownload = useCallback(() => {
    if (!dataUrl) return
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = "qr-code.png"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, [dataUrl])

  const disabled = loading || !text.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <div className="rounded-2xl bg-gradient-to-r from-sky-200/60 via-teal-200/60 to-sky-200/60 p-[1px] dark:from-sky-900/40 dark:via-teal-900/40 dark:to-sky-900/40">
        <Card
          className={cn(
            "rounded-2xl border-white/20 bg-white/10 shadow-lg backdrop-blur-md",
            "dark:border-white/10 dark:bg-white/5",
          )}
        >
          <CardContent className="p-4 sm:p-6">
            <form
              className="flex flex-col gap-3 sm:gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                if (!disabled) void handleGenerate()
              }}
              aria-label="QR Code Generator"
            >
              <label htmlFor="qr-input" className="sr-only">
                {"Text or URL"}
              </label>
              <Input
                id="qr-input"
                placeholder="Enter text or URL"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
                className="rounded-xl"
              />
              <motion.div whileTap={{ scale: 0.98 }} className="flex">
                <Button
                  type="submit"
                  variant="secondary"
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-md hover:from-sky-700 hover:to-teal-600"
                  disabled={disabled}
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </Button>
              </motion.div>
              {error ? (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {dataUrl && (
          <motion.div
            key="qr-result"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-6"
          >
            <div className="rounded-2xl bg-gradient-to-r from-sky-200/60 via-teal-200/60 to-sky-200/60 p-[1px] dark:from-sky-900/40 dark:via-teal-900/40 dark:to-sky-900/40">
              <Card
                className={cn(
                  "rounded-2xl border-white/20 bg-white/10 shadow-xl backdrop-blur-md",
                  "dark:border-white/10 dark:bg-white/5",
                )}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/50 p-3 shadow-sm dark:border-white/10 dark:bg-white/10">
                      <Image
                        src={dataUrl || "/placeholder.svg?height=256&width=256&query=qr%20code%20placeholder"}
                        alt="Generated QR code"
                        width={256}
                        height={256}
                        className="h-64 w-64 rounded-xl"
                        priority
                      />
                    </div>
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="rounded-xl border-0 bg-gradient-to-r from-sky-50 to-teal-50 text-foreground shadow-sm dark:from-slate-800 dark:to-slate-800"
                        onClick={handleDownload}
                      >
                        {"Download QR Code"}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
