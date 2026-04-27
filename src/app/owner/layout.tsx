import Link from "next/link";
import { FaCar, FaTachometerAlt, FaUsers, FaRoute, FaMoneyBillWave, FaGasPump, FaCommentDots, FaCog } from "react-icons/fa";
import { getSession } from "@/lib/auth";
import { BRAND_NAME } from "@/lib/config";
import { OwnerLogoutButton } from "@/components/owner/OwnerLogoutButton";

const NAV = [
  { href: "/owner", label: "Overview", icon: <FaTachometerAlt /> },
  { href: "/owner/drivers", label: "Drivers", icon: <FaUsers /> },
  { href: "/owner/shifts", label: "Shifts", icon: <FaRoute /> },
  { href: "/owner/rides", label: "Rides", icon: <FaMoneyBillWave /> },
  { href: "/owner/expenses", label: "Expenses", icon: <FaGasPump /> },
  { href: "/owner/feedback", label: "Feedback", icon: <FaCommentDots /> },
  { href: "/owner/settings", label: "Settings", icon: <FaCog /> },
];

export default async function OwnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const showShell = session?.role === "owner";

  if (!showShell) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-light-gray">
      <aside className="hidden md:flex md:flex-col w-60 bg-primary-blue text-white shrink-0">
        <Link href="/owner" className="px-6 h-16 flex items-center gap-2 font-bold text-lg border-b border-white/10">
          <FaCar className="text-primary-orange text-xl" />
          {BRAND_NAME}
        </Link>
        <nav className="flex-1 py-4">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 px-6 py-3 text-sm hover:bg-white/10"
            >
              <span className="text-primary-orange">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10 text-sm">
          <p className="text-white/70">{session?.username}</p>
          <OwnerLogoutButton />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-primary-blue text-white px-4 h-14 flex items-center justify-between">
          <Link href="/owner" className="flex items-center gap-2 font-bold">
            <FaCar className="text-primary-orange text-xl" /> {BRAND_NAME}
          </Link>
          <OwnerLogoutButton />
        </header>

        <nav className="md:hidden bg-white border-b border-gray-200 overflow-x-auto whitespace-nowrap px-2 py-2 flex gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-xs text-primary-blue px-3 py-1.5 rounded-md hover:bg-light-gray"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
