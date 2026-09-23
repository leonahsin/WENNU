export interface SupportTopic {
  id: string;
  title: string;
  description: string;
  to: string;
  keywords: string[];
}

/** Task cards shown on Support Home and reused for routing on Contact Support. */
export const SUPPORT_TOPICS: SupportTopic[] = [
  {
    id: "product-support",
    title: "PCI01 Product Support",
    description:
      "Setup, dog and cat usage guides, and how to use the device with or without the blue silicone cover.",
    to: "/product/pci01",
    keywords: ["pci01", "product", "setup", "dog", "cat", "guide", "silicone", "cover", "battery"],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Insert two AAA 1.5V batteries, choose your usage guide and take your first scan correctly.",
    to: "/getting-started",
    keywords: ["start", "first", "battery", "aaa", "scan", "records", "quick guide"],
  },
  {
    id: "troubleshooting",
    title: "FAQ & Troubleshooting",
    description:
      "Step-by-step help for power, screen and backlight, measurement consistency, cover, cleaning and stored records.",
    to: "/faq#troubleshooting",
    keywords: [
      "troubleshoot",
      "won't turn on",
      "backlight",
      "screen",
      "inconsistent",
      "records",
      "orange",
    ],
  },
  {
    id: "contact",
    title: "Contact Support",
    description:
      "Check self-service answers first, then route your topic and prepare the details we need.",
    to: "/contact",
    keywords: ["contact", "email", "phone", "chat", "help", "agent"],
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Searchable answers to the most common PCI01 questions in the U.S. market.",
    to: "/faq",
    keywords: ["faq", "questions", "answers", "how many", "how long"],
  },
];

export interface TroubleshootingCategory {
  id: string;
  title: string;
  description: string;
  symptoms: string[];
  to?: string;
  steps?: string[];
}

export const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategory[] = [
  {
    id: "wont-turn-on",
    title: "Device won't turn on",
    description: "Nothing happens when you press the power button.",
    symptoms: ["no power", "dead", "blank", "won't start", "not turning on", "button"],
    to: "/troubleshooting/wont-turn-on",
  },
  {
    id: "screen-backlight",
    title: "Screen and backlight",
    description:
      "The display is dim or hard to read, or the backlight color changed while you were scanning.",
    symptoms: ["screen", "display", "backlight", "orange", "dim", "colour", "color"],
    steps: [
      "Check the display isn't covered by the edge of the blue silicone cover.",
      "Read the display straight on in even light — a dim screen often means low batteries.",
      "Replace both AAA 1.5V batteries with fresh matching ones if the screen stays faint.",
      "An orange backlight is a high-temperature alert. It draws attention to the reading; it isn't a diagnosis. Take a few scans and check with your veterinarian for medical advice.",
    ],
  },
  {
    id: "inconsistent-measurements",
    title: "Inconsistent measurements",
    description: "Readings change a lot between scans.",
    symptoms: ["inconsistent", "different", "varies", "reading", "measurement", "accuracy"],
    steps: [
      "Keep scanning for the full scan each time, without lifting away early.",
      "Take several scans instead of trusting just one — more scans are more reliable.",
      "Keep the same position and distance from your dog or cat guide for every scan.",
      "Let PCI01 and your pet settle in a stable indoor spot before scanning again.",
      "Make sure the silicone end and comb teeth are clean and dry, and the cover is seated right.",
    ],
  },
  {
    id: "silicone-cover",
    title: "Blue silicone cover",
    description: "The cover is loose, hard to refit, or in the way of the back cover.",
    symptoms: ["silicone", "cover", "blue", "loose", "fit", "back cover"],
    steps: [
      "Always take the blue silicone cover off before opening the back cover.",
      "Peel it off gradually from one edge instead of pulling from the middle.",
      "Refit it by lining up the tip opening first, then easing it over the body.",
      "Make sure it doesn't overlap the display or the power button.",
    ],
  },
  {
    id: "cleaning",
    title: "Cleaning",
    description: "You're not sure what can be washed and what has to stay dry.",
    symptoms: ["clean", "wash", "water", "wipe", "hygiene", "dirty"],
    to: "/faq#cleaning-care",
  },
  {
    id: "stored-records",
    title: "Stored records",
    description: "Records are missing, or you've hit the storage limit.",
    symptoms: ["records", "history", "memory", "stored", "30", "saved"],
    steps: [
      "PCI01 stores up to 30 records on-device. Older records may be overwritten once it's full.",
      "Write down any reading you want to keep long term — the device isn't a permanent archive.",
      "Removing batteries can affect stored records, so change batteries deliberately rather than mid-session.",
    ],
  },
];

export interface WontTurnOnStep {
  index: number;
  title: string;
  instruction: string;
  detail: string;
  warning?: string;
}

export const WONT_TURN_ON_STEPS: WontTurnOnStep[] = [
  {
    index: 1,
    title: "Check the batteries are in",
    instruction: "Make sure two AAA 1.5V batteries are actually inside.",
    detail:
      "If it shipped or was stored without batteries, pressing the power button does nothing.",
  },
  {
    index: 2,
    title: "Check the battery direction",
    instruction:
      "Make sure each battery matches the + and − markings inside the compartment.",
    detail:
      "One battery in backward is enough to stop it from turning on, even with new batteries.",
  },
  {
    index: 3,
    title: "Take the blue cover off first",
    instruction: "Remove the blue silicone cover before you open the back cover.",
    detail:
      "Opening the back cover with the silicone cover still on can strain both parts and make the compartment hard to close.",
    warning: "Never force the back cover while the silicone cover is still on.",
  },
  {
    index: 4,
    title: "Fit fresh matching batteries",
    instruction: "Put in two fresh AAA 1.5V batteries of the same type and brand.",
    detail:
      "Don't mix old and new, or different types. If a battery looks damaged, swollen, or is leaking, stop and don't handle it.",
    warning:
      "If a battery is damaged or leaking, don't continue — mention it in your support request.",
  },
  {
    index: 5,
    title: "Close up and power on",
    instruction:
      "Close the back cover, refit the silicone cover if you use one, then press the power button.",
    detail: "If it turns on, run a full scan to confirm it's working normally.",
  },
];

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords?: string[];
}

/**
 * FAQ taxonomy, in customer-facing priority order.
 * "My Reading Looks Wrong" is the high-priority category.
 */
export const FAQ_CATEGORIES = [
  "Getting Started",
  "Measurement & Scanning",
  "My Reading Looks Wrong",
  "Understanding Temperature",
  "Dogs & Cats",
  "Product & Care",
  "Troubleshooting",
] as const;

/** Category rendered with extra visual priority. */
export const FAQ_PRIORITY_CATEGORY = "My Reading Looks Wrong";

/** Compact customer-facing principles shown under the FAQ list. */
export const FAQ_PRINCIPLES: string[] = [
  "Use PCI01 at similar times, in similar places, and the same way each time, so you can build your pet's own everyday baseline.",
  "Treat readings as temperature-trend references. Don't judge your pet's health from a single reading.",
  "A high-temperature alert is a signal to pay attention, not a diagnosis.",
  "Check with a veterinarian whenever you're concerned about your pet.",
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-it-does",
    category: "Getting Started",
    question: "What can PCI01 do?",
    answer:
      "PCI01 is a non-contact infrared pet thermometer with built-in comb teeth that helps you track temperature trends in dogs and cats. Reading regularly helps you learn what's normal for your pet, and a high-temperature alert flags a reading that's run high. PCI01 isn't a diagnostic tool and doesn't replace advice from your veterinarian.",
    keywords: ["what", "purpose", "trend", "observation", "comb", "alert", "everyday care"],
  },
  {
    id: "how-to-observe",
    category: "Measurement & Scanning",
    question: "How do I track my pet's temperature trend?",
    answer:
      "Turn PCI01 on, pick the dog or cat setting, bring it near your pet, and take the reading. For a trend you can trust, try to measure at the same time of day, in the same kind of place, and the same way each time — that's what keeps the readings comparable.",
    keywords: ["how", "use", "setting", "reading", "trend", "steps"],
  },
  {
    id: "dogs-and-cats",
    category: "Dogs & Cats",
    question: "Can dogs and cats both use it?",
    answer:
      "Yes. Pick the dog or cat setting before each use. Keep a separate history for each pet, and don't compare one pet's reading against another's.",
    keywords: ["dog", "cat", "pet", "setting", "both"],
  },
  {
    id: "orange-backlight",
    category: "Understanding Temperature",
    question: "What do the ice-blue and orange backlights mean?",
    answer:
      "Ice-blue means the reading is within the everyday range. Orange means a higher reading was detected — keep an eye on your pet and check with a veterinarian if it seems warranted. The colors are prompts to pay attention, not diagnoses.",
    keywords: ["orange", "blue", "backlight", "color", "light", "alert"],
  },
  {
    id: "sound-alerts",
    category: "Understanding Temperature",
    question: "What do the sound alerts mean?",
    answer:
      "The sounds either guide you while you measure or flag a high reading. Always check the display and backlight too, along with your pet's energy, activity, and anything else that seems off. The sounds are a nudge to pay attention, not a diagnosis.",
    keywords: ["sound", "beep", "audio", "alert", "tone"],
  },
  {
    id: "app-wifi",
    category: "Getting Started",
    question: "Does it need an app or Wi-Fi?",
    answer:
      "No. PCI01 works on its own to take a reading — no app or Wi-Fi needed.",
    keywords: ["app", "wifi", "wi-fi", "phone", "connect", "offline"],
  },
  {
    id: "batteries",
    category: "Product & Care",
    question: "What batteries does PCI01 use?",
    answer:
      "Two AAA batteries. Follow the + and − markings inside the compartment when you put them in.",
    keywords: ["battery", "batteries", "aaa", "power", "replace"],
  },
  {
    id: "not-medical",
    category: "Understanding Temperature",
    question: "Is PCI01 a medical thermometer?",
    answer:
      "No. It's made for everyday care — temperature-trend tracking and high-temperature alerts. It doesn't diagnose illness and doesn't replace a veterinarian or medical equipment.",
    keywords: ["medical", "thermometer", "vet", "veterinarian", "diagnose", "device"],
  },
  {
    id: "consistency",
    category: "My Reading Looks Wrong",
    question: "Why should I use it the same way each time?",
    answer:
      "The surroundings, how active your pet has been, and how you use PCI01 can all change a reading. Measuring under similar conditions is how you build your pet's everyday baseline. Look at the trend over time rather than any single reading. (For step-by-step fixes, see Troubleshooting → Inconsistent measurements.)",
    keywords: ["consistent", "baseline", "trend", "environment", "routine"],
  },
  {
    id: "multiple-pets",
    category: "Dogs & Cats",
    question: "Can several pets share one PCI01?",
    answer:
      "We recommend one comb per pet. That keeps each pet's baseline — and your records — clean over time.",
    keywords: ["multiple", "share", "pets", "baseline", "records"],
  },
  {
    id: "after-alert",
    category: "Understanding Temperature",
    question: "What should I do after a high-temperature alert?",
    answer:
      "Take it as a cue to keep an eye on your pet — not a diagnosis. Watch their energy, activity, and eating, and check with a veterinarian if you're concerned.",
    keywords: ["high", "alert", "temperature", "what to do", "next", "observe"],
  },
];
