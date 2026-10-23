import { useState } from "react";
import { BarChart3, Users, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blockStats, tasks } from "@/lib/data";

const number = (value: number) => value.toLocaleString("hi-IN");

export function BlockChart() {
  const [metric, setMetric] = useState<"members" | "coverage">("members");
  const [selected, setSelected] = useState<string | null>(null);
  const [unit, setUnit] = useState("");
  const rows = blockStats.filter((b) => !unit || b.block === unit);
  const max = metric === "members" ? Math.max(...blockStats.map((b) => b.members)) : 100;
  const active = blockStats.find((b) => b.block === selected);
  return (
    <section className="border-y py-5 min-w-0" aria-label="ब्लॉकवार आँकड़ों का चार्ट">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="text-lg flex items-center gap-2"><BarChart3 className="size-5 text-primary" />ब्लॉकवार प्रदर्शन</h2>
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex gap-1" role="group" aria-label="चार्ट के आँकड़े">
            <Button size="sm" variant={metric === "members" ? "default" : "outline"} aria-pressed={metric === "members"} onClick={() => setMetric("members")}><Users />सदस्य</Button>
            <Button size="sm" variant={metric === "coverage" ? "default" : "outline"} aria-pressed={metric === "coverage"} onClick={() => setMetric("coverage")}><CheckCheck />बूथ कवरेज</Button>
          </div>
          <select aria-label="चार्ट का ब्लॉक" className="border bg-card rounded-sm px-2 h-8 text-xs" value={unit} onChange={(e) => { setUnit(e.target.value); setSelected(e.target.value || null); }}>
            <option value="">सभी ब्लॉक</option>
            {blockStats.map((b) => <option key={b.block}>{b.block}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2 min-h-72">
        {rows.map((b) => {
          const value = metric === "members" ? b.members : Math.round(b.covered / b.booths * 100);
          const label = `${b.block}: ${number(value)}${metric === "coverage" ? "% कवरेज" : " सदस्य"}`;
          return <Button key={b.block} variant="ghost" onClick={() => setSelected(b.block)} aria-label={label} aria-pressed={selected === b.block} title={label} className={`w-full h-8 px-1 justify-start gap-3 hover:bg-muted ${selected === b.block ? "bg-muted" : ""}`}>
            <span className="w-14 shrink-0 text-left">{b.block}</span>
            <span className="flex-1 h-5 bg-muted relative overflow-hidden rounded-sm"><span className={`block h-full ${metric === "members" ? "bg-primary" : "bg-success"}`} style={{ width: `${value / max * 100}%` }} /></span>
            <span className="w-16 shrink-0 text-right tabular-nums">{number(value)}{metric === "coverage" && "%"}</span>
          </Button>;
        })}
      </div>
      <div className="mt-3 border-t pt-3 text-sm text-muted-foreground min-h-14" aria-live="polite">
        {active ? <><strong className="text-foreground">{active.block}</strong> · {number(active.members)} सदस्य · {active.covered}/{active.booths} बूथ · {Math.round(active.covered / active.booths * 100)}% कवरेज</> : <>कुल {number(blockStats.reduce((n, b) => n + b.members, 0))} सदस्य · {blockStats.length} ब्लॉक</>}
      </div>
    </section>
  );
}

const statuses = [
  { name: "करना है", color: "var(--primary)" },
  { name: "प्रगति में", color: "var(--accent)" },
  { name: "समय सीमा पार", color: "var(--destructive)" },
  { name: "पूर्ण", color: "var(--success)" },
];

export function TaskChart() {
  const [selected, setSelected] = useState<string | null>(null);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "पूर्ण").length;
  let offset = 0;
  return <section className="border-y py-5 min-w-0" aria-label="कार्य स्थिति का चार्ट">
    <h2 className="text-lg mb-4">कार्य की स्थिति</h2>
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative size-44 shrink-0 mx-auto">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" role="img" aria-label={`${total} कार्य, ${completed} पूर्ण`}>
          {statuses.map((s) => {
            const count = tasks.filter((t) => t.status === s.name).length;
            const arc = count / total * 100;
            const start = offset; offset += arc;
            return <circle key={s.name} cx="60" cy="60" r="46" fill="none" stroke={s.color} strokeWidth="12" pathLength="100" strokeDasharray={`${Math.max(0, arc - 1)} ${101 - arc}`} strokeDashoffset={-start}><title>{s.name}: {count}</title></circle>;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none"><span className="font-serif text-3xl">{Math.round(completed / total * 100)}%</span><span className="text-xs text-muted-foreground">पूर्ण कार्य</span></div>
      </div>
      <div className="flex-1 min-w-40 space-y-1">
        {statuses.map((s) => <Button key={s.name} variant="ghost" className={`w-full justify-between px-2 ${selected === s.name ? "bg-muted" : ""}`} aria-pressed={selected === s.name} onClick={() => setSelected(selected === s.name ? null : s.name)}>
          <span className="flex items-center gap-2"><svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="5" fill={s.color} /></svg>{s.name}</span><span>{tasks.filter((t) => t.status === s.name).length}</span>
        </Button>)}
      </div>
    </div>
    <div className="mt-4 border-t pt-3 min-h-14 text-sm" aria-live="polite">
      {selected ? <ul className="space-y-2">{tasks.filter((t) => t.status === selected).map((t) => <li key={t.id}>{t.title}<span className="text-muted-foreground"> · {t.unit}</span></li>)}</ul> : <p className="text-muted-foreground">कुल {total} कार्य · {completed} पूर्ण · {total - completed} शेष</p>}
    </div>
  </section>;
}