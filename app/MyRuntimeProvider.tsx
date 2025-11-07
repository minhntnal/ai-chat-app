"use client";

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

const agentCardUrl = 'http://localhost:10001/.well-known/agent-card.json'; // Replace with the actual agent card URL
const client = await A2AClient.fromCardUrl(agentCardUrl);

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


const MyModelAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
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

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const runtime = useLocalRuntime(MyModelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}