import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AgentForm from "./AgentForm";
import { Agent, getAgents, addAgent } from "@/lib/agents";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface AgentSelectorProps {
  onAgentSelect: (agent: Agent | null) => void;
  currentAgent: Agent | null;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  onAgentSelect,
  currentAgent,
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const loadedAgents = getAgents();
    setAgents(loadedAgents);
    if (loadedAgents.length > 0 && !currentAgent) {
      onAgentSelect(loadedAgents[0]);
    } else if (loadedAgents.length === 0) {
      onAgentSelect(null);
    }
  }, []);

  const handleAddAgent = (name: string, endpoint: string) => {
    const newAgent: Agent = {
      id: crypto.randomUUID(), // Generate a unique ID
      name,
      endpoint,
      model: "default-model", // Provide a default model
      description: "Default description",
    };
    addAgent(newAgent);
    setAgents([...agents, newAgent]);
    onAgentSelect(newAgent);
    setIsFormOpen(false);
  };
 
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
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>
            Add Agent
          </Button>
        </DialogTrigger>
        <DialogContent>
          <AgentForm onAddAgent={handleAddAgent} onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentSelector;