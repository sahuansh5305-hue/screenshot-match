import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Badge } from "@/components/AppShell";
import { activity, events, members, tasks, blockStats } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard – CJP Sagar" },
      { name: "description", content: "District overview of members, tasks, events and booth coverage." },
      { property: "og:title", content: "Dashboard – CJP Sagar" },
      { property: "og:description", content: "District overview of members, tasks, events and booth coverage." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const booths = blockStats.reduce((a, b) => a + b.booths, 0);
  const covered = blockStats.reduce((a, b) => a + b.covered, 0);
  const stats = [
    { label: "Registered members", value: blockStats.reduce((a, b) => a + b.members, 0).toLocaleString("en-IN"), to: "/members" },
    { label: "Active office bearers", value: members.filter((m) => m.status === "Active").length, to: "/members" },
    { label: "Tasks overdue", value: tasks.filter((t) => t.status === "Overdue").length, to: "/tasks" },
    { label: "Booth coverage", value: `${Math.round((covered / booths) * 100)}%`, to: "/organization" },
  ] as const;
  return (
    <>
      <PageHeader title="District Dashboard" subtitle="Sagar District · All 8 blocks · Week of 19 Oct 2026" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.label} to={s.to} className="panel p-5 hover:border-primary transition-colors">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="font-serif text-3xl text-primary mt-2">{s.value}</div>
            </Link>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="panel lg:col-span-2">
            <h2 className="px-5 py-3 border-b text-base">Tasks requiring attention</h2>
            <ul className="divide-y">
              {tasks.filter((t) => t.status !== "Done").slice(0, 5).map((t) => (
                <li key={t.id} className="px-5 py-3 flex justify-between gap-3 text-sm">
                  <div><div className="font-medium">{t.title}</div><div className="text-muted-foreground text-xs">{t.unit} · {t.owner}</div></div>
                  <div className="text-right shrink-0"><Badge tone={t.status === "Overdue" ? "destructive" : "muted"}>{t.status}</Badge><div className="text-xs text-muted-foreground mt-1">{t.due}</div></div>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h2 className="px-5 py-3 border-b text-base">Upcoming events</h2>
            <ul className="divide-y">
              {events.map((e) => (
                <li key={e.id} className="px-5 py-3 text-sm">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.date} · {e.place}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section className="panel">
          <h2 className="px-5 py-3 border-b text-base">Recent activity</h2>
          <ul className="divide-y text-sm">{activity.map((a) => <li key={a} className="px-5 py-2.5">{a}</li>)}</ul>
        </section>
      </div>
    </>
  );
}
