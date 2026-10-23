import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { blockStats, members } from "@/lib/data";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [
      { title: "Organisation – CJP Sagar" },
      { name: "description", content: "Hierarchy of blocks, mandals and booths in Sagar district." },
      { property: "og:title", content: "Organisation – CJP Sagar" },
      { property: "og:description", content: "Hierarchy of blocks, mandals and booths in Sagar district." },
    ],
  }),
  component: Org,
});

function Org() {
  const [open, setOpen] = useState<string | null>("Sagar");
  return (
    <>
      <PageHeader title="Organisational Structure" subtitle="Madhya Pradesh › Sagar District › Blocks › Mandals › Booths" />
      <div className="p-6">
        <div className="panel divide-y">
          {blockStats.map((b) => {
            const leaders = members.filter((m) => m.unit === b.block).slice(0, 3);
            const pct = Math.round((b.covered / b.booths) * 100);
            return (
              <div key={b.block}>
                <button onClick={() => setOpen(open === b.block ? null : b.block)} className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-muted">
                  <span className="text-muted-foreground w-4">{open === b.block ? "▾" : "▸"}</span>
                  <span className="font-serif text-lg flex-1">{b.block} Block</span>
                  <span className="text-sm text-muted-foreground hidden sm:inline">{b.booths} booths · {b.members.toLocaleString("en-IN")} members</span>
                  <span className="w-28"><span className="block h-1.5 bg-muted rounded-sm"><span className="block h-full bg-success rounded-sm" style={{ width: `${pct}%` }} /></span><span className="text-xs">{pct}% covered</span></span>
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
