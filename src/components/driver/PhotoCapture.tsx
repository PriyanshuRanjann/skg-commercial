"use client";

import { useRef, useState } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";

type Props = {
  label: string;
  hint?: string;
  required?: boolean;
  onChange: (file: File | null) => void;
};

export function PhotoCapture({ label, hint, required, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground/85">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-muted">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={label}
            className="w-full rounded-lg border border-[var(--hairline)] max-h-64 object-cover"
          />
          <button
            type="button"
            onClick={() => {
              handleFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-red-600 text-foreground rounded-full p-2 shadow-md hover:bg-red-700"
            aria-label="Remove photo"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-[var(--hairline-strong)] rounded-lg py-10 flex flex-col items-center justify-center gap-2 text-muted hover:border-primary-orange hover:text-accent transition-colors"
        >
          <FaCamera className="text-3xl" />
          <span className="font-semibold">Take photo</span>
        </button>
      )}
    </div>
  );
}
