import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/config";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background photo with heavy darkening */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero/ertiga.jpg"
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover object-center scale-110 blur-sm"
        />
        <div className="absolute inset-0 bg-[var(--bg-deep)]/85" />
      </div>
      <div className="absolute inset-0 -z-10 bg-mesh opacity-95" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="absolute -top-40 right-0 w-[28rem] h-[28rem] bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <header className="relative px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <Image
            src="/images/brand/logo.png"
            alt={BRAND_NAME}
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="hidden sm:block text-foreground font-light tracking-[0.2em] uppercase text-sm">
            {BRAND_NAME}
          </span>
        </Link>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-4 sm:px-6 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold tracking-[0.3em] uppercase">
              {eyebrow}
            </span>
            <h1 className="mt-5 heading-display text-3xl md:text-4xl text-foreground">
              {title}
            </h1>
            {subtitle && <p className="mt-3 text-muted text-sm">{subtitle}</p>}
          </div>

          <div className="card-luxe p-8 md:p-10">{children}</div>

          {footer && (
            <div className="mt-6 text-center text-xs text-muted">{footer}</div>
          )}
        </div>
      </main>

      <footer className="relative text-center pb-8 text-[10px] tracking-[0.3em] uppercase text-muted">
        {BRAND_TAGLINE}
      </footer>
    </div>
  );
}
