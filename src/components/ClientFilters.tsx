"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ClientFiltersProps = {
  newClientHref?: string;
  showAgentFilter?: boolean;
  agents?: { id: string; name: string }[];
};

export function ClientFilters({
  newClientHref = "/clients/new",
  showAgentFilter = false,
  agents = [],
}: ClientFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, phone, or address..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            const value = e.target.value;
            debounceRef.current = setTimeout(() => updateParam("search", value), 300);
          }}
        />
      </div>

      <Select
        defaultValue={searchParams.get("intent") ?? "all"}
        onValueChange={(value) =>
          updateParam("intent", value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Intent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All intents</SelectItem>
          <SelectItem value="SELL">Sell</SelectItem>
          <SelectItem value="RENT">Rent</SelectItem>
        </SelectContent>
      </Select>

      {showAgentFilter && (
        <Select
          defaultValue={searchParams.get("agentId") ?? "all"}
          onValueChange={(value) =>
            updateParam("agentId", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button asChild>
        <Link href={newClientHref}>
          <Plus className="h-4 w-4" />
          Add client
        </Link>
      </Button>
    </div>
  );
}
