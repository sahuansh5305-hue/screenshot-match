import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { blockStats, members } from "@/lib/data";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "संगठन – कांग्रेस जनता पार्टी सागर" },
      { name: "description", content: "Hierarchy में से blocks, mandals and booths in Sagar district." },
      { property: "og:title", content: "संगठन – कांग्रेस जनता पार्टी सागर" },
      { property: "og:description", content: "Hierarchy में से blocks, mandals and booths in Sagar district." },
    ],
  }),
  component: Org,
});

function Org() {
  const [open, setOpen] = useState<string | null>("सागर");
  return (
    <>
      <PageHeader title="संगठन संरचना" subtitle="मध्य प्रदेश › सागर जिला › ब्लॉक › मंडल › बूथ" />
      <div className="p-6">
        <div className="panel divide-y">
          {blockStats.map((b) => {
            const leaders = members.filter((m) => m.unit === b.block).slice(0, 3);
            const pct = Math.round((b.covered / b.booths) * 100);
            return (
              <div key={b.block}>
                <button onClick={() => setOpen(open === b.block ? null : b.block)} className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-muted">
                  <span className="text-muted-foreground w-4">{open === b.block ? "▾" : "▸"}</span>
                  <span className="font-serif text-lg flex-1">{b.block} ब्लॉक</span>
                  <span className="text-sm text-muted-foreground hidden sm:inline">{b.booths} बूथ · {b.members.toLocaleString("en-IN")} सदस्य</span>
                  <span className="w-28"><span className="block h-1.5 bg-muted rounded-sm"><span className="block h-full bg-success rounded-sm" style={{ width: `${pct}%` }} /></span><span className="text-xs">{pct}% कवरेज</span></span>
                </button>
                {open === b.block && (
                  <div className="px-12 pb-4 grid sm:grid-cols-3 gap-3">
                    {leaders.map((l) => (
                      <div key={l.id} className="border rounded-sm p-3 bg-background">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{l.designation}</div>
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">{l.phone}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
