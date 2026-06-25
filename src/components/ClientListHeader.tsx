import { ClientFilters } from "@/components/ClientFilters";

type ClientListHeaderProps = {
  title: string;
  description: string;
  newClientHref?: string;
  showAgentFilter?: boolean;
  agents?: { id: string; name: string }[];
};

export function ClientListHeader({
  title,
  description,
  newClientHref = "/clients/new",
  showAgentFilter = false,
  agents = [],
}: ClientListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <ClientFilters
        newClientHref={newClientHref}
        showAgentFilter={showAgentFilter}
        agents={agents}
      />
    </div>
  );
}
