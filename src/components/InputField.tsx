import React, { forwardRef, useId, useState } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";

export type InputFieldProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "text" | "password" | "email" | "number";
  clearable?: boolean;
  passwordToggle?: boolean;
  id?: string;
  className?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled = false,
      invalid = false,
      loading = false,
      variant = "outlined",
      size = "md",
      type = "text",
      clearable = false,
      passwordToggle = false,
      id,
      className
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `input-${autoId}`;
    const describedById = `${inputId}-desc`;
    const errorId = `${inputId}-err`;

    const [internalType, setInternalType] = useState(type);

    const base = clsx(
  "field-base",
  { "field-sm": size === "sm", "field-md": size === "md", "field-lg": size === "lg" },
  { "field-filled": variant === "filled", "field-outlined": variant === "outlined", "field-ghost": variant === "ghost" },
  invalid && "field-invalid",
  disabled && "opacity-60 cursor-not-allowed",
  className
);

    const rightPadding = clsx({ "pr-10": clearable || passwordToggle || loading });
    const showPasswordToggle = passwordToggle && type === "password";
    const isInvalid = invalid || !!errorMessage;

    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label text-zinc-800">{label}</label>}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={clsx(base, rightPadding)}
            placeholder={placeholder}
            aria-invalid={isInvalid || undefined}
            aria-describedby={clsx(helperText && describedById, errorMessage && errorId)}
            disabled={disabled}
            value={value}
            onChange={onChange}
            type={internalType}
          />

          {loading && (
            <span className="absolute inset-y-0 right-2 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" aria-hidden />
            </span>
          )}

          {clearable && !loading && value && value.length > 0 && (
            <button
              type="button"
              aria-label="Clear input"
              className="absolute inset-y-0 right-2 flex items-center rounded-md p-1 hover:bg-zinc-100"
              onClick={(e) => {
                if (onChange) {
                  const ev = new Event("input", { bubbles: true }) as any;
                  Object.defineProperty(ev, "target", { value: { value: "" } });
                  onChange(ev);
                }
              }}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}

          {showPasswordToggle && !loading && (
            <button
              type="button"
              aria-label={internalType === "password" ? "Show password" : "Hide password"}
              className="absolute inset-y-0 right-2 flex items-center rounded-md p-1 hover:bg-zinc-100"
              onClick={() => setInternalType(t => (t === "password" ? "text" : "password"))}
            >
              {internalType === "password" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          )}
        </div>

        {helperText && !errorMessage && <p id={describedById} className="helper text-zinc-500">{helperText}</p>}
        {errorMessage && <p id={errorId} role="alert" className="error">{errorMessage}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
