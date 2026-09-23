import { cn } from "@/lib/utils";

/** Official WENNU PetiMeti Series brand logo. Never recolored, stretched or cropped. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src="/images/ennu-logo.jpg"
      alt="WENNU PetiMeti Series — Know Them. Care Better."
      className={cn("h-9 w-auto object-contain", className)}
      decoding="async"
    />
  );
}
