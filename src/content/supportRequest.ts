import { isValidEmail } from "@/lib/caseIntake";

export type StepId = "purchase" | "product" | "issue" | "photos" | "review";

export interface StepDef {
  id: StepId;
  title: string;
  shortTitle: string;
  description: string;
}

export const REQUEST_STEPS: StepDef[] = [
  {
    id: "purchase",
    title: "Purchase details",
    shortTitle: "Purchase",
    description: "Where and when you bought the PCI01, plus proof of purchase.",
  },
  {
    id: "product",
    title: "Product details",
    shortTitle: "Product",
    description: "Your product is the PCI01 Pet Thermometer. Tell us how you use it.",
  },
  {
    id: "issue",
    title: "Issue details",
    shortTitle: "Issue",
    description: "What is happening, when it started and what you already tried.",
  },
  {
    id: "photos",
    title: "Photos",
    shortTitle: "Photos",
    description: "Clear photos help the review move forward without extra rounds of questions.",
  },
  {
    id: "review",
    title: "Review and submit",
    shortTitle: "Review",
    description: "Check every section, then acknowledge the privacy notice and submit.",
  },
];

export const PURCHASE_CHANNELS = [
  "Official WENNU online store",
  "Online marketplace",
  "Physical retail store",
  "Received as a gift",
  "Other",
];

export const ISSUE_TOPICS = [
  "Setup and first use",
  "Power and battery issues",
  "Screen and backlight",
  "Measurement consistency",
  "Silicone cover and cleaning",
  "Stored records",
  "Warranty and returns",
  "Something else",
];

export const STEPS_TRIED = [
  "Checked that two AAA 1.5V batteries are installed",
  "Checked battery polarity",
  "Removed the blue silicone cover before opening the back cover",
  "Fitted fresh matching batteries",
  "Completed the won't-turn-on five-step flow",
  "Kept scanning continuously without lifting away early",
  "Took multiple scans and compared them",
  "Cleaned the silicone measuring end and comb teeth",
];

export interface RequestFormData {
  purchaseChannel: string;
  orderNumber: string;
  purchaseDate: string;
  proofFileName: string;
  productId: string;
  coverState: string;
  guide: string;
  identifier: string;
  issueTopic: string;
  issueTitle: string;
  issueDescription: string;
  issueStartDate: string;
  stepsTried: string[];
  batterySafety: string;
  photoComplete: string;
  photoCloseUp: string;
  photoOptional: string;
  customerEmail: string;
  privacyAcknowledged: boolean;
}

export const EMPTY_FORM: RequestFormData = {
  purchaseChannel: "",
  orderNumber: "",
  purchaseDate: "",
  proofFileName: "",
  productId: "pci01",
  coverState: "",
  guide: "",
  identifier: "",
  issueTopic: "",
  issueTitle: "",
  issueDescription: "",
  issueStartDate: "",
  stepsTried: [],
  batterySafety: "",
  photoComplete: "",
  photoCloseUp: "",
  photoOptional: "",
  customerEmail: "",
  privacyAcknowledged: false,
};

export const STORAGE_KEY = "pci01-support-request-us-v1";

export function validateStep(step: StepId, data: RequestFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === "purchase") {
    if (!data.purchaseChannel) errors["purchaseChannel"] = "Select where you bought the device.";
    if (!data.orderNumber.trim())
      errors["orderNumber"] = "Enter your order number or receipt reference.";
    else if (data.orderNumber.trim().length > 60)
      errors["orderNumber"] = "Order number must be 60 characters or fewer.";
    if (!data.purchaseDate) errors["purchaseDate"] = "Enter the purchase date.";
    if (!data.proofFileName) errors["proofFileName"] = "Attach a proof of purchase file.";
  }
  if (step === "product") {
    if (!data.coverState) errors["coverState"] = "Tell us whether the silicone cover is fitted.";
    if (!data.guide) errors["guide"] = "Select the dog guide or the cat guide.";
    if (data.identifier.length > 60)
      errors["identifier"] = "Identifier must be 60 characters or fewer.";
  }
  if (step === "issue") {
    if (!data.issueTopic) errors["issueTopic"] = "Select an issue topic.";
    if (!data.issueTitle.trim()) errors["issueTitle"] = "Enter a short title for the issue.";
    else if (data.issueTitle.trim().length > 100)
      errors["issueTitle"] = "Title must be 100 characters or fewer.";
    if (data.issueDescription.trim().length < 20)
      errors["issueDescription"] = "Describe the issue in at least 20 characters.";
    else if (data.issueDescription.trim().length > 1500)
      errors["issueDescription"] = "Description must be 1500 characters or fewer.";
    if (!data.issueStartDate) errors["issueStartDate"] = "Enter when the issue started.";
    if (!data.batterySafety)
      errors["batterySafety"] = "Answer the damaged or leaking battery safety question.";
  }
  if (step === "photos") {
    if (!data.photoComplete) errors["photoComplete"] = "Add a photo of the complete product.";
    if (!data.photoCloseUp) errors["photoCloseUp"] = "Add a close-up photo of the issue.";
  }
  if (step === "review") {
    if (!data.customerEmail.trim())
      errors["customerEmail"] = "Enter the email address we can reply to.";
    else if (!isValidEmail(data.customerEmail))
      errors["customerEmail"] = "Enter a valid email address, for example name@example.com.";
    if (!data.privacyAcknowledged)
      errors["privacyAcknowledged"] = "Acknowledge the privacy notice before submitting.";
  }
  return errors;
}
