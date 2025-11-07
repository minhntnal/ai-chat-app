'use client';
import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteAgent, getAgents, addAgent, Agent } from '@/lib/agents';
import AgentForm from '@/components/assistant-ui/AgentForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const fetchedAgents = await getAgents();
        setAgents(fetchedAgents);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError('Failed to load agents.');
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
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
    setIsFormOpen(false);
  };

  const handleDeleteAgent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await deleteAgent(id);
        setAgents(agents.filter((agent) => agent.id !== id));
      } catch (err) {
        console.error('Failed to delete agent:', err);
        alert('Failed to delete agent.');
      }
    }
  };

  if (loading) {
    return <div>Loading agents...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agents</h1>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <MessagesSquare className="h-6 w-6" />
          <span>Chat</span>
        </Link>

      <div className="mb-4 flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AgentForm onAddAgent={handleAddAgent} onClose={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No agents found.
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.model}</TableCell>
                <TableCell>{agent.endpoint}</TableCell>
                <TableCell>{agent.description}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}