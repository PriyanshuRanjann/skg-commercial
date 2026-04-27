import { forwardRef } from "react";

const inputBase =
  "w-full border border-[var(--hairline-strong)] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-[var(--bg-elevated)] disabled:cursor-not-allowed";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", id, ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-foreground/85">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`${inputBase} ${error ? "border-red-500" : ""} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  children: React.ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className = "", id, children, ...rest },
  ref
) {
  const selectId = id ?? rest.name;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-foreground/85">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`${inputBase} ${error ? "border-red-500" : ""} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className = "", id, ...rest },
  ref
) {
  const textareaId = id ?? rest.name;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-foreground/85">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`${inputBase} ${error ? "border-red-500" : ""} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
});
