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
    <section className="py-12 md:py-20 bg-light-gray min-h-screen print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary-blue hover:text-primary-orange"
          >
            <FaArrowLeft /> Back to site
          </Link>
          <PrintButton />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 print:shadow-none print:rounded-none print:p-12">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary-orange">
              Enjoyed your ride?
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-black text-primary-blue tracking-tight">
              Scan & rate us
            </h1>
            <p className="mt-3 text-muted">
              30-second feedback. Helps us serve you better next time.
            </p>

            <div className="mt-8 inline-flex p-6 bg-light-gray rounded-3xl print:bg-white print:border print:border-gray-200">
              <Image
                src="/qr-feedback.png"
                alt="Scan to leave feedback"
                width={320}
                height={320}
                className="rounded-2xl"
                priority
              />
            </div>

            <p className="mt-6 text-sm text-muted break-all">
              Or visit:{" "}
              <span className="font-mono text-primary-blue">{target}</span>
            </p>

            <div className="mt-10 pt-6 border-t border-[var(--hairline)]">
              <p className="text-2xl font-black text-primary-blue">{BRAND_NAME}</p>
              <p className="text-sm text-primary-orange font-semibold mt-1">
                {BRAND_TAGLINE}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted mt-6 print:hidden">
          Tip: print on A5 or larger. Mount on the back of the front passenger seat
          where it&apos;s easily scannable.
        </p>
      </div>
    </section>
  );
}
