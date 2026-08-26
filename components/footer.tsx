import { ArrowUpRight } from "lucide-react";

type FooterProps = { siteName?: string; socialLinks?: string[] };

function getLinkLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

export default function Footer({ siteName = "Portfolio", socialLinks = [] }: FooterProps) {
  return (
    <footer className="mx-auto mt-10 max-w-6xl border-t border-white/10 py-8 text-sm sm:mt-12 sm:flex sm:items-center sm:justify-between sm:gap-8">
      <div>
        <p className="font-semibold tracking-tight text-white">{siteName}</p>
        <p className="mt-1 text-xs text-slate-500">© {new Date().getFullYear()} · Designed and built with care.</p>
      </div>

      {socialLinks.length > 0 ? (
        <nav aria-label="Social links" className="mt-5 flex flex-wrap gap-x-5 gap-y-3 sm:mt-0 sm:justify-end">
          {socialLinks.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-cyan-200">
              {getLinkLabel(url)}
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          ))}
        </nav>
      ) : null}
    </footer>
  );
}
