import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "मुख्य पटल" },
  { to: "/organization", label: "संगठन" },
  { to: "/members", label: "सदस्य" },
  { to: "/tasks", label: "कार्य" },
  { to: "/events", label: "आयोजन" },
  { to: "/reports", label: "प्रतिवेदन" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground md:w-64 md:min-h-screen shrink-0 border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <div className="font-serif text-lg leading-tight">कांग्रेस जनता पार्टी</div>
          <div className="text-xs uppercase tracking-[0.2em] opacity-70 mt-1">सागर जिला</div>
        </div>
        <div className="tricolor-rule" />
        <nav className="flex md:flex-col overflow-x-auto p-2 gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="px-3 py-2 text-sm rounded-sm whitespace-nowrap hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent border-l-2 border-accent font-medium" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block p-5 text-xs opacity-60 mt-auto">जिला प्रशासक के रूप में प्रवेश किया है (नमूना)</div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="border-b bg-card px-6 py-5 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Badge({ tone, children }: { tone: "success" | "warning" | "destructive" | "muted"; children: ReactNode }) {
  const map = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-foreground",
    destructive: "bg-destructive/15 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };
  return <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-sm ${map[tone]}`}>{children}</span>;
}

export const btn = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-sm bg-primary text-primary-foreground hover:bg-primary/90";
