/**
 * Browser-side helpers that turn selected files into the payload accepted by
 * the intake server action. Files are only read when the customer submits.
 */
import {
  MAX_FILE_BYTES,
  validateUpload,
  type AttachmentType,
  type FileRejection,
} from "@/lib/caseIntake";

export interface PendingAttachment {
  attachmentType: AttachmentType;
  file: File;
}

export interface EncodedAttachment {
  attachmentType: AttachmentType;
  filename: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
  sizeBytes: number;
  dataBase64: string;
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < buffer.length; i += chunk) {
    binary += String.fromCharCode(...buffer.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export class AttachmentError extends Error {
  constructor(
    readonly reason: FileRejection,
    readonly filename: string,
  ) {
    super(`Attachment rejected: ${reason}`);
  }
}

export async function encodeAttachments(
  pending: PendingAttachment[],
): Promise<EncodedAttachment[]> {
  const out: EncodedAttachment[] = [];
  for (const item of pending) {
    const rejection = validateUpload(item.file);
    if (rejection) throw new AttachmentError(rejection, item.file.name);
    if (item.file.size > MAX_FILE_BYTES) throw new AttachmentError("size", item.file.name);
    out.push({
      attachmentType: item.attachmentType,
      filename: item.file.name,
      mimeType: item.file.type as EncodedAttachment["mimeType"],
      sizeBytes: item.file.size,
      dataBase64: await fileToBase64(item.file),
    });
  }
  return out;
}
