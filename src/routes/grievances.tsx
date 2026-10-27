import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { blocks } from "@/lib/data";
import { initialGrievances, issues, type Grievance } from "@/lib/campaign";

export const Route = createFileRoute("/grievances")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "जन समस्या – संगठन प्रबंधन" },
      { name: "description", content: "नागरिकों की समस्याएँ दर्ज करें और उनके समाधान तक अनुवर्ती करें।" },
      { property: "og:title", content: "जन समस्या – संगठन प्रबंधन" },
      { property: "og:description", content: "नागरिकों की समस्याएँ दर्ज करें और उनके समाधान तक अनुवर्ती करें।" },
    ],
  }),
  component: Grievances,
});

const flow: Grievance["status"][] = ["नई", "कार्यवाही में", "हल"];
const input = "border bg-card px-3 py-2 text-sm rounded-sm";

function Grievances() {
  const [list, setList] = useState(initialGrievances);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", citizen: "", block: blocks[0]!, issue: issues[0]! });

  const advance = (id: number) => setList(list.map((g) => g.id === id ? { ...g, status: flow[Math.min(flow.indexOf(g.status) + 1, 2)]! } : g));
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !f.citizen.trim()) return;
    setList([{ id: 500 + list.length + 1, ...f, status: "नई", days: 0 }, ...list]);
    setF({ ...f, title: "", citizen: "" }); setOpen(false);
  };
  const shown = list.filter((g) => !filter || g.status === filter);

  return (
    <>
      <PageHeader title="जन समस्या निवारण" subtitle="जनता की शिकायतें — दर्ज करने से समाधान तक" action={<button className={btn} onClick={() => setOpen(!open)}>+ समस्या दर्ज करें</button>} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {flow.map((s) => (
            <button key={s} onClick={() => setFilter(filter === s ? "" : s)} className={`panel p-4 text-left ${filter === s ? "border-primary" : ""}`}>
              <div className="text-xs text-muted-foreground">{s}</div>
              <div className="font-serif text-2xl text-primary">{list.filter((g) => g.status === s).length}</div>
            </button>
          ))}
        </div>
        {open && (
          <form onSubmit={add} className="panel p-5 grid md:grid-cols-2 gap-3">
            <input className={input} placeholder="समस्या का विवरण" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            <input className={input} placeholder="नागरिक का नाम" value={f.citizen} onChange={(e) => setF({ ...f, citizen: e.target.value })} />
            <select className={input} value={f.block} onChange={(e) => setF({ ...f, block: e.target.value })}>{blocks.map((b) => <option key={b}>{b}</option>)}</select>
            <select className={input} value={f.issue} onChange={(e) => setF({ ...f, issue: e.target.value })}>{issues.map((b) => <option key={b}>{b}</option>)}</select>
            <button className={`${btn} justify-center md:col-span-2`}>दर्ज करें</button>
          </form>
        )}
        <section className="panel">
          <ul className="divide-y text-sm">
            {shown.map((g) => (
              <li key={g.id} className="px-5 py-3 flex flex-wrap items-center gap-3 justify-between">
                <div><div className="font-medium">{g.title}</div><div className="text-xs text-muted-foreground">क्रमांक {g.id} · {g.citizen} · {g.block} · {g.issue} · {g.days} दिन पुरानी</div></div>
                <div className="flex items-center gap-3">
                  <Badge tone={g.status === "हल" ? "success" : g.status === "नई" ? "warning" : "muted"}>{g.status}</Badge>
                  {g.status !== "हल" && <button className="text-xs underline text-primary" onClick={() => advance(g.id)}>{g.status === "नई" ? "कार्यवाही शुरू करें" : "हल चिह्नित करें"}</button>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
