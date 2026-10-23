import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { initialVisits, issues, issueCounts, type Sentiment, type Visit } from "@/lib/campaign";

export const Route = createFileRoute("/canvassing")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "जनसंपर्क – कांग्रेस जनता पार्टी सागर" },
      { name: "description", content: "घर-घर संपर्क दर्ज करें, जनता के मुद्दे और जनमत समझें।" },
      { property: "og:title", content: "जनसंपर्क – कांग्रेस जनता पार्टी सागर" },
      { property: "og:description", content: "घर-घर संपर्क दर्ज करें, जनता के मुद्दे और जनमत समझें।" },
    ],
  }),
  component: Canvassing,
});

const input = "border bg-card px-3 py-2 text-sm rounded-sm w-full";

function Canvassing() {
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [counts, setCounts] = useState(issueCounts);
  const [form, setForm] = useState({ household: "", booth: "बूथ 114", issue: "पानी", sentiment: "समर्थक" as Sentiment });
  const max = Math.max(...Object.values(counts));
  const sCount = (s: Sentiment) => visits.filter((v) => v.sentiment === s).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.household.trim()) return;
    setVisits([{ id: Date.now(), ...form, by: "जिला प्रशासक", time: "अभी" }, ...visits]);
    setCounts({ ...counts, [form.issue]: (counts[form.issue] ?? 0) + 1 });
    setForm({ ...form, household: "" });
  };

  return (
    <>
      <PageHeader title="घर-घर जनसंपर्क" subtitle="मैदानी कार्यकर्ताओं द्वारा दर्ज संपर्क, मुद्दे और जनमत" />
      <div className="p-6 grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">
        <form onSubmit={submit} className="panel p-5 space-y-3 h-fit">
          <h2 className="text-base">नया संपर्क दर्ज करें</h2>
          <label className="block text-xs">परिवार का नाम<input className={input} value={form.household} onChange={(e) => setForm({ ...form, household: e.target.value })} placeholder="जैसे: रामलाल पटेल परिवार" /></label>
          <label className="block text-xs">बूथ<select className={input} value={form.booth} onChange={(e) => setForm({ ...form, booth: e.target.value })}>{[102, 114, 131, 145, 160, 177].map((b) => <option key={b}>बूथ {b}</option>)}</select></label>
          <div className="text-xs">मुख्य मुद्दा</div>
          <div className="flex flex-wrap gap-2">{issues.map((i) => <button type="button" key={i} onClick={() => setForm({ ...form, issue: i })} className={`px-3 py-1 text-xs rounded-sm border ${form.issue === i ? "bg-primary text-primary-foreground" : "bg-card"}`}>{i}</button>)}</div>
          <div className="text-xs">परिवार का रुख</div>
          <div className="flex gap-2">{(["समर्थक", "तटस्थ", "विरोधी"] as Sentiment[]).map((s) => <button type="button" key={s} onClick={() => setForm({ ...form, sentiment: s })} className={`flex-1 px-3 py-2 text-sm rounded-sm border ${form.sentiment === s ? "bg-accent text-accent-foreground border-accent" : "bg-card"}`}>{s}</button>)}</div>
          <button className={`${btn} w-full justify-center`}>संपर्क सहेजें</button>
        </form>

        <div className="space-y-6">
          <section className="panel p-5">
            <h2 className="text-base mb-4">जनता के प्रमुख मुद्दे</h2>
            <div className="space-y-2">
              {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 text-sm">
                  <div className="w-20">{k}</div>
                  <div className="flex-1 h-3 bg-muted rounded-sm"><div className="h-3 bg-primary rounded-sm transition-all" style={{ width: `${(v / max) * 100}%` }} /></div>
                  <div className="w-12 text-right">{v}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="px-5 py-3 border-b flex justify-between text-sm"><h2 className="text-base">आज के संपर्क ({visits.length})</h2><span className="text-muted-foreground">समर्थक {sCount("समर्थक")} · तटस्थ {sCount("तटस्थ")} · विरोधी {sCount("विरोधी")}</span></div>
            <ul className="divide-y text-sm">
              {visits.map((v) => (
                <li key={v.id} className="px-5 py-3 flex justify-between gap-3">
                  <div><div className="font-medium">{v.household}</div><div className="text-xs text-muted-foreground">{v.booth} · मुद्दा: {v.issue} · {v.by} · {v.time}</div></div>
                  <Badge tone={v.sentiment === "समर्थक" ? "success" : v.sentiment === "विरोधी" ? "destructive" : "muted"}>{v.sentiment}</Badge>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
