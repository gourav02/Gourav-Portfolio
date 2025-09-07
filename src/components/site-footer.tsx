export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Gourav Mukherjee. Built with Next.js, Tailwind, GSAP, and shadcn/ui.
          </p>
          <p>Open to roles in React/Next.js and full‑stack.</p>
        </div>
      </div>
    </footer>
  )
}
