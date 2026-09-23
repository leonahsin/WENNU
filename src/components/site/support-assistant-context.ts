import { createContext, useContext } from "react";

export interface AssistantContextValue {
  openAssistant: () => void;
}

export const AssistantContext = createContext<AssistantContextValue | null>(null);

export function useSupportAssistant() {
  const context = useContext(AssistantContext);
  if (!context) throw new Error("useSupportAssistant must be used inside SupportAssistantProvider");
  return context;
}
