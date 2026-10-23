import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, btn } from "@/components/AppShell";
import { blockStats } from "@/lib/data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports – CJP Sagar" },
      { name: "description", content: "Block-wise coverage and membership reports." },
      { property: "og:title", content: "Reports – CJP Sagar" },
      { property: "og:description", content: "Block-wise coverage and membership reports." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const max = Math.max(...blockStats.map((b) => b.members));
  return (
    <>
      <PageHeader title="Reports" subtitle="Block-wise performance, Sagar District" action={<button className={btn} onClick={() => alert("Prototype: export to Excel")}>Export</button>} />
      <div className="p-6 grid lg:grid-cols-2 gap-6">
        <section className="panel p-5">
          <h2 className="text-base mb-4">Members by block</h2>
          <div className="space-y-2.5">
            {blockStats.map((b) => (
              <div key={b.block} className="flex items-center gap-3 text-sm">
                <span className="w-20">{b.block}</span>
                <div className="flex-1 h-5 bg-muted rounded-sm"><div className="h-full bg-primary rounded-sm" style={{ width: `${(b.members / max) * 100}%` }} /></div>
                <span className="w-14 text-right tabular-nums">{b.members.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2.5">Block</th><th className="px-4 py-2.5">Booths</th><th className="px-4 py-2.5">Covered</th><th className="px-4 py-2.5">Coverage</th></tr>
            </thead>
            <tbody className="divide-y">
              {blockStats.map((b) => (
                <tr key={b.block}><td className="px-4 py-2.5 font-medium">{b.block}</td><td className="px-4 py-2.5">{b.booths}</td><td className="px-4 py-2.5">{b.covered}</td><td className="px-4 py-2.5">{Math.round((b.covered / b.booths) * 100)}%</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
