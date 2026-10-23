import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { blocks } from "@/lib/data";
import { booths, boothLean, type Booth } from "@/lib/campaign";

export const Route = createFileRoute("/war-room")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "वॉर रूम – संगठन सेतु" },
      { name: "description", content: "बूथवार जनमत, कांटे की टक्कर वाले बूथ और मतदान दिवस की सीधी निगरानी।" },
      { property: "og:title", content: "वॉर रूम – संगठन सेतु" },
      { property: "og:description", content: "बूथवार जनमत, कांटे की टक्कर वाले बूथ और मतदान दिवस की सीधी निगरानी।" },
    ],
  }),
  component: WarRoom,
});

const tone = { "मजबूत": "bg-success", "कांटे की टक्कर": "bg-warning", "कमजोर": "bg-destructive" } as const;

function WarRoom() {
  const [block, setBlock] = useState("");
  const [sel, setSel] = useState<Booth | null>(null);
  const [live, setLive] = useState(false);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setExtra((e) => Math.min(e + 1, 40)), 1200);
    return () => clearInterval(t);
  }, [live]);

  const list = useMemo(() => booths.filter((b) => !block || b.block === block), [block]);
  const counts: Record<"मजबूत" | "कांटे की टक्कर" | "कमजोर", number> = { "मजबूत": 0, "कांटे की टक्कर": 0, "कमजोर": 0 };
  list.forEach((b) => { counts[boothLean(b)] += 1; });
  const voters = list.reduce((a, b) => a + b.voters, 0);
  const turnoutOf = (b: Booth) => Math.min(95, b.turnout + extra);
  const voted = list.reduce((a, b) => a + Math.round((b.voters * turnoutOf(b)) / 100), 0);
  const lagging = [...list].filter((b) => boothLean(b) !== "कमजोर").sort((a, b) => turnoutOf(a) - turnoutOf(b)).slice(0, 5);

  return (
    <>
      <PageHeader title="चुनावी वॉर रूम" subtitle="बूथवार जनमत और मतदान दिवस की सीधी निगरानी" action={
        <button className={btn} onClick={() => setLive((l) => !l)}>{live ? "⏸ सीधी निगरानी रोकें" : "▶ मतदान दिवस सीधा प्रसारण"}</button>
      } />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="कुल मतदाता" value={voters.toLocaleString("en-IN")} />
          <Stat label="मतदान हो चुका" value={`${voted.toLocaleString("en-IN")} (${Math.round((voted / voters) * 100)}%)`} pulse={live} />
          <Stat label="मजबूत बूथ" value={counts["मजबूत"]} />
          <Stat label="कांटे की टक्कर वाले बूथ" value={counts["कांटे की टक्कर"]} />
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
          <section className="panel">
            <div className="px-5 py-3 border-b flex flex-wrap justify-between items-center gap-3">
              <h2 className="text-base">बूथ मानचित्र ({list.length} बूथ)</h2>
              <div className="flex items-center gap-3 text-xs">
                {Object.entries(tone).map(([k, c]) => <span key={k} className="flex items-center gap-1"><span className={`w-3 h-3 rounded-sm ${c}`} />{k} ({counts[k as keyof typeof counts]})</span>)}
                <select className="border bg-card px-2 py-1 rounded-sm" value={block} onChange={(e) => { setBlock(e.target.value); setSel(null); }}>
                  <option value="">सभी ब्लॉक</option>
                  {blocks.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {blocks.filter((b) => !block || b === block).map((bl) => (
                <div key={bl} className="flex items-center gap-3">
                  <div className="w-16 text-sm shrink-0">{bl}</div>
                  <div className="grid grid-cols-12 gap-1 flex-1">
                    {list.filter((b) => b.block === bl).map((b) => (
                      <button key={b.id} aria-label={`${b.name}, ${boothLean(b)}`} onClick={() => setSel(b)}
                        className={`aspect-square rounded-sm ${tone[boothLean(b)]} hover:opacity-80 ${sel?.id === b.id ? "ring-2 ring-primary ring-offset-1" : ""}`}
                        style={{ opacity: 0.45 + b.visited / 180 }} />
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">रंग की गहराई = घर-घर संपर्क का प्रतिशत। किसी बूथ पर क्लिक करें।</p>
            </div>
          </section>

          <section className="panel p-5">
            {sel ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div><h2 className="text-lg">{sel.name}</h2><div className="text-xs text-muted-foreground">{sel.block} ब्लॉक · {sel.voters} मतदाता</div></div>
                  <Badge tone={boothLean(sel) === "मजबूत" ? "success" : boothLean(sel) === "कमजोर" ? "destructive" : "warning"}>{boothLean(sel)}</Badge>
                </div>
                <div>
                  <div className="text-xs mb-1">जनमत</div>
                  <div className="flex h-4 rounded-sm overflow-hidden">
                    <div className="bg-success" style={{ width: `${sel.support}%` }} />
                    <div className="bg-muted-foreground/40" style={{ width: `${sel.neutral}%` }} />
                    <div className="bg-destructive" style={{ width: `${sel.oppose}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1"><span>समर्थक {sel.support}%</span><span>तटस्थ {sel.neutral}%</span><span>विरोधी {sel.oppose}%</span></div>
                </div>
                <Bar label="घर-घर संपर्क" v={sel.visited} />
                <Bar label="मतदान" v={turnoutOf(sel)} />
                <button className={btn} onClick={() => alert(`${sel.name} के कार्यकर्ताओं को सूचना भेजी गई (नमूना)।`)}>कार्यकर्ताओं को सचेत करें</button>
              </div>
            ) : <p className="text-sm text-muted-foreground">बूथ का विवरण देखने के लिए मानचित्र में किसी बूथ को चुनें।</p>}
          </section>
        </div>

        <section className="panel">
          <h2 className="px-5 py-3 border-b text-base">कम मतदान वाले समर्थक बूथ — तुरंत मतदाता जुटाएँ</h2>
          <ul className="divide-y text-sm">
            {lagging.map((b) => (
              <li key={b.id} className="px-5 py-3 flex items-center gap-4">
                <div className="w-28 font-medium">{b.name}</div><div className="w-16 text-muted-foreground">{b.block}</div>
                <div className="flex-1"><div className="h-2 bg-muted rounded-sm"><div className="h-2 bg-accent rounded-sm transition-all" style={{ width: `${turnoutOf(b)}%` }} /></div></div>
                <div className="w-12 text-right">{turnoutOf(b)}%</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function Stat({ label, value, pulse }: { label: string; value: string | number; pulse?: boolean }) {
  return <div className="panel p-5"><div className="text-xs text-muted-foreground flex items-center gap-2">{pulse && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}{label}</div><div className="font-serif text-2xl text-primary mt-2">{value}</div></div>;
}
function Bar({ label, v }: { label: string; v: number }) {
  return <div><div className="flex justify-between text-xs mb-1"><span>{label}</span><span>{v}%</span></div><div className="h-2 bg-muted rounded-sm"><div className="h-2 bg-primary rounded-sm transition-all" style={{ width: `${v}%` }} /></div></div>;
}
