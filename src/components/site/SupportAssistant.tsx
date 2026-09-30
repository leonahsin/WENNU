import type { ReactNode } from "react";
import { AssistantContext } from "@/components/site/support-assistant-context";

/** 已停用：根據需求移除右下角的 ASK WENNU 支援助理 */
export function SupportAssistantProvider({ children }: { children: ReactNode }) {
  return (
    <AssistantContext.Provider value={{ openAssistant: () => {} }}>
      {children}
    </AssistantContext.Provider>
  );
}