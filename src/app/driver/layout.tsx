import Link from "next/link";
import { FaCar } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import { BRAND_NAME } from "@/lib/config";
import { LogoutButton } from "@/components/driver/LogoutButton";

export default async function DriverLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const showHeader = session?.role === "driver";

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      {showHeader && (
        <header className="bg-primary-blue text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/driver" className="flex items-center gap-2 font-bold">
              <FaCar className="text-primary-orange text-xl" />
              <span>{BRAND_NAME} Driver</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline opacity-90">{session?.name}</span>
              <LogoutButton />
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
