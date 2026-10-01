import { Link } from "@tanstack/react-router";
import { BookOpen, PlayCircle, HelpCircle, HeadphonesIcon } from "lucide-react";

interface PrimaryCardLinkProps {
  title: string;
  description: string;
  to: string;
  lang?: string;
  emphasis?: "primary" | "secondary";
  image?: string;
}

/** Large, low-noise homepage choice. One per key task. */
export function PrimaryCardLink({ to, title, description, emphasis, image }: PrimaryCardLinkProps) {
  let Icon = BookOpen; 
  if (title.includes("Video")) Icon = PlayCircle;
  if (title.includes("FAQ")) Icon = HelpCircle;
  if (title.includes("Support")) Icon = HeadphonesIcon;

  return (
    <Link
      to={to}
      className="group flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-4 sm:gap-4 rounded-2xl bg-card p-4 sm:p-6 ring-1 ring-border/60 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
    >
      {image ? (
        <div className="relative w-28 sm:w-full shrink-0 aspect-[4/3] overflow-hidden rounded-xl bg-secondary/20">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col justify-center sm:justify-between gap-1 sm:gap-3 w-full py-1 sm:py-0">
        <div>
          <div className="flex items-center gap-3 sm:mb-2">
            <div className="hidden sm:inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground">
              <Icon className="size-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h3>
          </div>
          
          <p className="mt-1 sm:mt-0 text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground/90">
            {description}
          </p>
        </div>

        <div className="mt-2 sm:mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}