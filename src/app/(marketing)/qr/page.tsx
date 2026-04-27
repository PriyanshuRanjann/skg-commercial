import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/config";
import { PrintButton } from "./PrintButton";

export const metadata = { title: "Print QR sticker" };

export default function QrPage() {
  const target = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/feedback`
    : "/feedback";

  return (
    <section className="py-20 md:py-28 min-h-screen print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-accent-light"
          >
            <FaArrowLeft /> Back to site
          </Link>
          <PrintButton />
        </div>

        <div className="card-luxe p-10 md:p-16 print:bg-white print:border-2 print:border-black print:p-12 print:rounded-none">
          <div className="text-center max-w-lg mx-auto">
            <Image
              src="/images/brand/logo.png"
              alt={BRAND_NAME}
              width={80}
              height={80}
              className="mx-auto rounded-xl print:hidden"
            />
            <p className="mt-6 text-[10px] font-semibold tracking-[0.3em] uppercase text-accent print:text-black">
              Enjoyed your ride?
            </p>
            <h1 className="mt-3 heading-display text-3xl md:text-5xl text-foreground print:text-black">
              Scan &amp; rate <span className="gold-text print:!text-black print:!bg-none">us</span>
            </h1>
            <p className="mt-3 text-muted print:text-black">
              30-second feedback. Helps us serve you better next time.
            </p>

            <div className="mt-10 inline-flex p-6 bg-white rounded-3xl border border-[var(--hairline-strong)] print:border-2 print:border-black">
              <Image
                src="/qr-feedback.png"
                alt="Scan to leave feedback"
                width={320}
                height={320}
                className="rounded-2xl print:rounded-none"
                priority
              />
            </div>

            <p className="mt-6 text-xs text-muted break-all print:text-black">
              Or visit:{" "}
              <span className="font-mono text-foreground print:text-black">{target}</span>
            </p>

            <div className="mt-10 pt-6 border-t border-[var(--hairline)] print:border-black">
              <p className="text-xl font-light tracking-[0.3em] uppercase text-foreground print:text-black">
                {BRAND_NAME}
              </p>
              <p className="text-xs text-accent tracking-[0.25em] uppercase mt-2 print:text-black">
                {BRAND_TAGLINE}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted mt-6 print:hidden">
          Tip: print on A5 or larger. Mount on the back of the front passenger
          seat where it&apos;s easily scannable.
        </p>
      </div>
    </section>
  );
}
