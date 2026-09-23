import { Search } from "lucide-react";

interface SearchFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  hint,
}: SearchFieldProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative mt-2">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="tap-target w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {hint ? (
        <p
          id={`${id}-hint`}
          role="status"
          aria-live="polite"
          className="mt-2 text-sm text-muted-foreground"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
