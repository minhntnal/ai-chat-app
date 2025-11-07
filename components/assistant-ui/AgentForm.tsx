import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AgentFormProps {
  onAddAgent: (name: string, endpoint: string) => void;
  onClose: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ onAddAgent, onClose }) => {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAgent(name, endpoint);
    setName("");
    setEndpoint("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Agent Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="url"
        placeholder="Agent Endpoint URL"
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
      />
      <Button type="submit">Add Agent</Button>
    </form>
  );
};

export default AgentForm;