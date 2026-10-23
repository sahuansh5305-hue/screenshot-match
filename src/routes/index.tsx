import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Badge } from "@/components/AppShell";
import { formatDate, activity, events, members, tasks, blockStats } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "मुख्य पटल – कांग्रेस जनता पार्टी सागर" },
      { name: "description", content: "जिले के सदस्यों, कार्यों, आयोजनों और बूथ कवरेज का अवलोकन।" },
      { property: "og:title", content: "मुख्य पटल – कांग्रेस जनता पार्टी सागर" },
      { property: "og:description", content: "जिले के सदस्यों, कार्यों, आयोजनों और बूथ कवरेज का अवलोकन।" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const booths = blockStats.reduce((a, b) => a + b.booths, 0);
  const covered = blockStats.reduce((a, b) => a + b.covered, 0);
  const stats = [
    { label: "पंजीकृत सदस्य", value: blockStats.reduce((a, b) => a + b.members, 0).toLocaleString("en-IN"), to: "/members" },
    { label: "सक्रिय पदाधिकारी", value: members.filter((m) => m.status === "सक्रिय").length, to: "/members" },
    { label: "समय सीमा पार कार्य", value: tasks.filter((t) => t.status === "समय सीमा पार").length, to: "/tasks" },
    { label: "बूथ कवरेज", value: `${Math.round((covered / booths) * 100)}%`, to: "/organization" },
  ] as const;
  return (
    <>
      <PageHeader title="जिला मुख्य पटल" subtitle="सागर जिला · सभी 8 ब्लॉक · 19 अक्टूबर 2026 का सप्ताह" />
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
            <h2 className="px-5 py-3 border-b text-base">ध्यान देने योग्य कार्य</h2>
            <ul className="divide-y">
              {tasks.filter((t) => t.status !== "पूर्ण").slice(0, 5).map((t) => (
                <li key={t.id} className="px-5 py-3 flex justify-between gap-3 text-sm">
                  <div><div className="font-medium">{t.title}</div><div className="text-muted-foreground text-xs">{t.unit} · {t.owner}</div></div>
                  <div className="text-right shrink-0"><Badge tone={t.status === "समय सीमा पार" ? "destructive" : "muted"}>{t.status}</Badge><div className="text-xs text-muted-foreground mt-1">{formatDate(t.due)}</div></div>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h2 className="px-5 py-3 border-b text-base">आगामी आयोजन</h2>
            <ul className="divide-y">
              {events.map((e) => (
                <li key={e.id} className="px-5 py-3 text-sm">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(e.date)} · {e.place}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section className="panel">
          <h2 className="px-5 py-3 border-b text-base">हाल की गतिविधियाँ</h2>
          <ul className="divide-y text-sm">{activity.map((a) => <li key={a} className="px-5 py-2.5">{a}</li>)}</ul>
        </section>
      </div>
    </>
  );
}
