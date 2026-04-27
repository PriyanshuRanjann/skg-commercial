"use client";

import { FaPrint } from "react-icons/fa";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="hidden md:inline-flex items-center gap-2 bg-primary-orange text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-primary-orange-light btn-glow"
    >
      <FaPrint /> Print sticker
    </button>
  );
}
