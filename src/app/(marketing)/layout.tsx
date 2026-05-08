import Script from "next/script";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Script
        src="https://always-on-dev.altrrtech.com/widget.js"
        strategy="afterInteractive"
        data-org-id="bd8c2fca-65fe-4f40-80d8-89ddcc6b4514"
        data-api-url="https://always-on-backend-dev.altrrtech.com"
      />
    </div>
  );
}
