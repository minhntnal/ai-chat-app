export interface Agent {
  id: string;
  name: string;
  endpoint: string;
  model: string;
  description: string;
}

const LOCAL_STORAGE_KEY = "ai-chat-agents";

export const getAgents = (): Agent[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const agentsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  // Ensure each agent has an ID, generating one if it doesn't exist
  const agents: Agent[] = agentsJson ? JSON.parse(agentsJson) : [];
  return agents.map(agent => ({
    ...agent,
    id: agent.id || crypto.randomUUID(), // Generate ID if missing
    model: agent.model || 'default-model' // Provide a default model if missing
  }));
};

export const addAgent = (agent: Agent): void => {
  if (typeof window === "undefined") {
    return;
  }
  const agents = getAgents();
  const updatedAgents = [...agents, agent];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAgents));
};

export const deleteAgent = (id: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  const agents = getAgents();
  const updatedAgents = agents.filter((agent) => agent.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAgents));
};