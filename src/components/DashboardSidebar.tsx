"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Users, UserCircle } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";

const navItems = [
  { href: "/clients", label: "My Clients", icon: Users },
];

const adminItems = [
  { href: "/admin", label: "All Clients", icon: LayoutDashboard },
  { href: "/admin/agents", label: "Agents", icon: UserCircle },
];

type DashboardSidebarProps = {
  user: {
    name: string;
    email: string;
    role: Role;
  };
};

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex w-full flex-col border-b bg-card md:fixed md:inset-y-0 md:left-0 md:z-30 md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 border-b px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-none">RE/MAX CRM</p>
          <p className="mt-1 text-xs text-muted-foreground">Client database</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
              isActive(item.href)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </p>
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs capitalize text-muted-foreground">
            {user.role.toLowerCase()}
          </p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline" className="w-full" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
