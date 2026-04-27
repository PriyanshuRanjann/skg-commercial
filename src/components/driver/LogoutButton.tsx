"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      await fetch("/api/auth/driver/logout", { method: "POST" });
      router.replace("/driver/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="text-sm text-foreground/90 hover:text-foreground underline-offset-2 hover:underline disabled:opacity-50"
    >
      {busy ? "..." : "Sign out"}
    </button>
  );
}
