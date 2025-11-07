export interface Agent {
  name: string;
  endpoint: string;
}

const LOCAL_STORAGE_KEY = "ai-chat-agents";

export const getAgents = (): Agent[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const agentsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  return agentsJson ? JSON.parse(agentsJson) : [];
};

export const addAgent = (agent: Agent): void => {
  if (typeof window === "undefined") {
    return;
  }
  const agents = getAgents();
  const updatedAgents = [...agents, agent];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAgents));
};

export const removeAgent = (name: string): void => {
  if (typeof window === "undefined") {
    return;
  }
  const agents = getAgents();
  const updatedAgents = agents.filter((agent) => agent.name !== name);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAgents));
};