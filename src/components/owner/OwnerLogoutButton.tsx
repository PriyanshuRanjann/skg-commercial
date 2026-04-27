"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OwnerLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async () => {
        setBusy(true);
        try {
          await fetch("/api/auth/owner/logout", { method: "POST" });
          router.replace("/owner/login");
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      disabled={busy}
      className="text-white/80 hover:text-white underline-offset-2 hover:underline text-sm disabled:opacity-50"
    >
      {busy ? "..." : "Sign out"}
    </button>
  );
}
