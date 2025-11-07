import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Agent, getAgents } from "@/lib/agents";

interface AgentSelectorProps {
  onAgentSelect: (agent: Agent | null) => void;
  currentAgent: Agent | null;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  onAgentSelect,
  currentAgent,
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const loadedAgents = getAgents();
    setAgents(loadedAgents);
    if (loadedAgents.length > 0 && !currentAgent) {
      onAgentSelect(loadedAgents[0]);
    } else if (loadedAgents.length === 0) {
      onAgentSelect(null);
    }
  }, []);
 
  return (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={(value) => {
          const agent = agents.find((a) => a.name === value) || null;
          onAgentSelect(agent);
        }}
        value={currentAgent?.name || ""}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select an agent" />
        </SelectTrigger>
        <SelectContent>
          {agents.map((agent) => (
            <SelectItem
              key={agent.name}
              value={agent.name}
              onSelect={() => onAgentSelect(agent)}
            >
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgentSelector;