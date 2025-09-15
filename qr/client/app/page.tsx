import { QrGenerator } from "@/components/qr-generator"

export default function Page() {
  return (
    <main className="min-h-dvh w-full bg-gradient-to-br from-slate-50 via-sky-50 to-teal-50 dark:from-slate-950 dark:via-sky-950 dark:to-teal-950">
      <section className="mx-auto flex max-w-xl flex-col items-center gap-8 px-4 py-16">
        <header className="text-center space-y-2">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl bg-gradient-to-r from-sky-600 to-teal-500 dark:from-sky-400 dark:to-teal-300 bg-clip-text text-transparent">
            {"QR Code Generator"}
          </h1>
          <p className="text-muted-foreground">{"Enter any text or URL to generate a downloadable QR code."}</p>
        </header>

        <QrGenerator />

        <footer className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">{"Powered by QR API"}</p>
        </footer>
      </section>
    </main>
  )
}
