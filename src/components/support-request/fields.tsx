import type { ReactNode } from "react";

interface BaseProps {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}

export function Field({ id, label, error, hint, required, children }: BaseProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-warning" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
        )}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-warning">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const controlClass =
  "tap-target w-full rounded-lg border border-input bg-card px-3 py-3 text-base text-foreground";

interface FieldsetProps {
  legend: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}

export function RadioFieldset({ legend, error, hint, children }: FieldsetProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-foreground">{legend}</legend>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      <div className="space-y-2">{children}</div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-warning">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

interface OptionProps {
  name: string;
  value: string;
  label: string;
  description?: string | undefined;
  checked: boolean;
  onChange: (value: string) => void;
  type?: "radio" | "checkbox" | undefined;
}

export function OptionRow({
  name,
  value,
  label,
  description,
  checked,
  onChange,
  type = "radio",
}: OptionProps) {
  const id = `${name}-${value}`.replace(/\s+/g, "-").toLowerCase();
  return (
    <label
      htmlFor={id}
      className="tap-target flex cursor-pointer items-start gap-3 rounded-lg border border-input bg-card px-4 py-3"
    >
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 size-5 accent-[var(--primary)]"
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="block text-sm text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
