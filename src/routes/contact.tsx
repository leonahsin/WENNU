import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { InternalPlaceholder } from "@/components/site/InternalPlaceholder";
import { Callout } from "@/components/site/Callout";
import { TaskCard } from "@/components/site/TaskCard";
import { SUPPORT_TOPICS } from "@/content/support";
import { ACTIVE_MARKET } from "@/content/market";
import { ProductImage } from "@/components/site/ProductImage";
import { CarriedContextNote } from "@/components/site/CarriedContextNote";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact PCI01 Support — United States" },
      {
        name: "description",
        content:
          "Check self-service answers, route your PCI01 topic and prepare the details needed before contacting support in the U.S.",
      },
      { property: "og:title", content: "Contact PCI01 Support" },
      {
        property: "og:description",
        content:
          "Self-service links, topic routing and a preparation checklist for PCI01 support requests.",
      },
    ],
  }),
  component: Contact,
});

const PREPARE = [
  "Your purchase channel, order number and purchase date.",
  "Proof of purchase you can upload.",
  "Whether the blue silicone cover is fitted.",
  "Which usage guide you follow: dog or cat.",
  "What happens, and when it started.",
  "The troubleshooting steps you already tried.",
  "Photos of the complete product and a close-up of the issue.",
];

function Contact() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Support Home", to: "/" }, { label: "Contact Support" }]}
        eyebrow={ACTIVE_MARKET.label}
        title="Contact Support"
        description="Most questions are answered faster through self-service. If you still need help, prepare your details first."
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 space-y-10">
        <CarriedContextNote market="us" />
        <section
          aria-label="Your product"
          className="surface-card grid gap-6 p-5 sm:grid-cols-[220px_1fr] sm:items-center"
        >
          <ProductImage
            view="front"
            priority
            alt="PCI01 Pet Thermometer, front view, showing the complete device including tip, display and buttons"
          />
          <p className="text-sm text-muted-foreground">
            Support on this page covers the PCI01 Pet Thermometer shown here. Confirm your device
            matches before you contact support.
          </p>
        </section>

        <section aria-labelledby="self-service">
          <h2 id="self-service" className="text-xl font-semibold">
            Try self-service first
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {SUPPORT_TOPICS.filter((t) => t.id !== "contact").map((topic) => (
              <TaskCard key={topic.id} {...topic} />
            ))}
          </div>
        </section>

        <section aria-labelledby="routing">
          <h2 id="routing" className="text-xl font-semibold">
            Topic routing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose the topic that best matches your situation so your request reaches the right
            queue.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Setup and first use",
              "Power and battery issues",
              "Screen and backlight",
              "Measurement consistency",
              "Silicone cover and cleaning",
              "Stored records",
              "Warranty and returns",
              "Something else",
            ].map((topic) => (
              <li key={topic} className="surface-card px-4 py-3 text-sm font-medium">
                {topic}
              </li>
            ))}
          </ul>
          <Link
            to="/support-request"
            className="tap-target mt-5 inline-flex items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Start a support request
          </Link>
        </section>

        <section aria-labelledby="prepare">
          <h2 id="prepare" className="text-xl font-semibold">
            Preparation checklist
          </h2>
          <ul className="surface-card mt-4 list-disc space-y-2 py-5 pl-9 pr-5 text-sm text-muted-foreground">
            {PREPARE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="channels" className="space-y-3">
          <h2 id="channels" className="text-xl font-semibold">
            Contact channels
          </h2>
          <InternalPlaceholder label="Support email address (U.S.)" />
          <InternalPlaceholder label="Support phone number and operating hours (U.S.)" />
          <InternalPlaceholder label="Live chat or help desk portal link" />
          <InternalPlaceholder label="Mailing address for returns and correspondence" />
          <InternalPlaceholder label="Expected response times" />
        </section>

        <Callout tone="info" title="Support scope">
          Support helps with product use and care. It does not provide diagnosis or veterinary
          advice.
        </Callout>
      </main>
    </>
  );
}
