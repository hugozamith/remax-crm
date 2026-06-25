import { redirect } from "next/navigation";
import { createAgent, listAgents } from "@/actions/users";
import { AgentForm } from "@/components/AgentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSessionUser } from "@/lib/session";

export default async function AdminAgentsPage() {
  const user = await requireSessionUser();
  if (user.role !== "ADMIN") {
    redirect("/clients");
  }

  const agents = await listAgents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
        <p className="text-muted-foreground">
          Manage realtor accounts for your agency.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add new agent</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentForm action={createAgent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current agents</CardTitle>
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agents yet.</p>
            ) : (
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.email}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {agent._count.clients} client
                      {agent._count.clients === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
