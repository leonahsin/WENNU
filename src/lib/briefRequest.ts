import { isValidEmail } from "./caseIntake";

export interface BriefRequest {
  topic: string;
  order: string;
  date: string;
  details: string;
  email: string;
  privacy: boolean;
}
export type RequestField = keyof BriefRequest;
export type RequestError = "topic" | "order" | "date" | "details" | "email" | "privacy";
export type RequestErrors = Partial<Record<RequestField, RequestError>>;

export function validateBriefRequest(form: BriefRequest, warranty: boolean): RequestErrors {
  const errors: RequestErrors = {};
  if (!form.topic.trim()) errors.topic = "topic";
  if (warranty) {
    if (!form.order.trim() || form.order.trim().length > 60) errors.order = "order";
    const parsed = new Date(`${form.date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(form.date) ||
      !Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== form.date
    )
      errors.date = "date";
  }
  if (form.details.trim().length < 10 || form.details.trim().length > 1500)
    errors.details = "details";
  if (!isValidEmail(form.email)) errors.email = "email";
  if (!form.privacy) errors.privacy = "privacy";
  return errors;
}

// Keep a request's key across retries, including a lost response after saving.
// Editing the payload starts a distinct request.
export function requestAttempt(
  previous: { payload: string; key: string } | null,
  payload: string,
  newKey: () => string,
) {
  return previous?.payload === payload ? previous : { payload, key: newKey() };
}
