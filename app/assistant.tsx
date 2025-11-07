"use client";

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

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  ThreadMessage,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";

import { A2AClient } from '@a2a-js/sdk/client';
import { v4 as uuidv4 } from 'uuid'; // For generating unique message IDs
import { TextPart } from "./a2a/schema";
import { useEffect } from "react";

async function sendMessageToAgent(client: A2AClient, messages: readonly ThreadMessage[]) {
  const parts: TextPart[] = messages.map(x => {
    const part: TextPart = {
      kind: 'text',
      text: x.content[0].text
    }
    return part
  })
  const response = await client.sendMessage({
    message: {
      messageId: uuidv4(),
      role: 'user',
      parts: parts,
      kind: 'message',
    },
  });
  return response
}

export const Assistant = () => {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [client, setClient] = useState<A2AClient | null>(null);

  const agentCardUrl = `${currentAgent?.endpoint}/.well-known/agent-card.json`; 
  useEffect (() => {
    const makeA2AClient = async () => {
      const newClient = await A2AClient.fromCardUrl(agentCardUrl);
      setClient(newClient)
    }
    makeA2AClient()
  }, [currentAgent])

  const MyModelAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
      if (client == null) {
        throw Error("No agent")
      }
      const response = await sendMessageToAgent(client, messages)
      const content = response.result.artifacts[0].parts.map((x: any) => ({
        type: "text",
        text: x.text
      }))
      return {
        content: content
      }
    },
  };
  
  const MyRuntimeProvider =({
    children,
  }: Readonly<{
    children: ReactNode;
  }>) => {
    const runtime = useLocalRuntime(MyModelAdapter);
  
    return (
      <AssistantRuntimeProvider runtime={runtime}>
        {children}
      </AssistantRuntimeProvider>
    );
  }

  return (
    <MyRuntimeProvider>
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
    </MyRuntimeProvider>
  );
};
