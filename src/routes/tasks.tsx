import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { tasks } from "@/lib/data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks – CJP Sagar" },
      { name: "description", content: "Assignments and follow-ups across district units." },
      { property: "og:title", content: "Tasks – CJP Sagar" },
      { property: "og:description", content: "Assignments and follow-ups across district units." },
    ],
  }),
  component: Tasks,
});

const cols = ["To do", "In progress", "Overdue", "Done"];

function Tasks() {
  return (
    <>
      <PageHeader title="Tasks & Assignments" subtitle="Track work across blocks" action={<button className={btn} onClick={() => alert("Prototype: assign task form")}>+ Assign task</button>} />
      <div className="p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cols.map((c) => (
          <section key={c} className="bg-muted rounded-sm p-3">
            <h2 className="text-sm font-sans font-semibold uppercase tracking-wider mb-3 px-1">{c} <span className="text-muted-foreground">({tasks.filter((t) => t.status === c).length})</span></h2>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === c).map((t) => (
                <div key={t.id} className="panel p-3 text-sm">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.unit} · {t.owner}</div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge tone={t.priority === "High" ? "destructive" : t.priority === "Medium" ? "warning" : "muted"}>{t.priority}</Badge>
                    <span className="text-xs text-muted-foreground">Due {t.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
