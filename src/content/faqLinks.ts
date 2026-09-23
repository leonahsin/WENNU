/**
 * Cross-links from an approved FAQ answer to How to Use sections and video
 * placeholders. Locale-independent: only IDs are stored here.
 */

import type { HowToSectionId } from "./howToUse";

export interface FaqLinks {
  howTo?: HowToSectionId;
  videoBaseId?: string;
}

export const FAQ_LINKS: Record<string, FaqLinks> = {
  "what-it-does": { howTo: "choose-your-mode", videoBaseId: "overview" },
  "how-to-observe": { howTo: "keep-scanning", videoBaseId: "keep-scanning" },
  "dogs-and-cats": { howTo: "position-the-thermometer", videoBaseId: "dogs" },
  "orange-backlight": { howTo: "learn-their-normal" },
  "sound-alerts": { howTo: "learn-their-normal" },
  "app-wifi": { howTo: "choose-your-mode", videoBaseId: "overview" },
  batteries: { videoBaseId: "overview" },
  "not-medical": { howTo: "learn-their-normal" },
  consistency: { howTo: "keep-scanning", videoBaseId: "keep-scanning" },
  "multiple-pets": { howTo: "learn-their-normal" },
  "after-alert": { howTo: "learn-their-normal" },
};
