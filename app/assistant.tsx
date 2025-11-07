"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import AgentSelector from "@/components/assistant-ui/AgentSelector";
import { Agent } from "@/lib/agents";
import React, { useState } from "react";

export const Assistant = () => {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: currentAgent ? currentAgent.endpoint : "/api/chat",
    }),
    key: currentAgent?.name || "default",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime} key={currentAgent?.name || "default"}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <AgentSelector
                onAgentSelect={setCurrentAgent}
                currentAgent={currentAgent}
              />
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
