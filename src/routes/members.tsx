import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { blocks, members } from "@/lib/data";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members – CJP Sagar" },
      { name: "description", content: "Searchable directory of party members and office bearers." },
      { property: "og:title", content: "Members – CJP Sagar" },
      { property: "og:description", content: "Searchable directory of party members and office bearers." },
    ],
  }),
  component: Members,
});

function Members() {
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState("");
  const list = members.filter((m) => (!unit || m.unit === unit) && `${m.name} ${m.id} ${m.designation}`.toLowerCase().includes(q.toLowerCase()));
  const input = "border bg-card px-3 py-2 text-sm rounded-sm";
  return (
    <>
      <PageHeader title="Member Directory" subtitle={`${list.length} of ${members.length} records`} action={<button className={btn} onClick={() => alert("Prototype: add member form")}>+ Add member</button>} />
      <div className="p-6 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <input className={`${input} flex-1 min-w-48`} placeholder="Search by name, ID or designation" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className={input} value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="">All blocks</option>
            {blocks.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>{["ID", "Name", "Designation", "Block", "Phone", "Status"].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {list.map((m) => (
                <tr key={m.id} className="hover:bg-muted/50">
                  <td className="px-4 py-2.5 font-mono text-xs">{m.id}</td>
                  <td className="px-4 py-2.5 font-medium">{m.name}</td>
                  <td className="px-4 py-2.5">{m.designation}</td>
                  <td className="px-4 py-2.5">{m.unit}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.phone}</td>
                  <td className="px-4 py-2.5"><Badge tone={m.status === "Active" ? "success" : m.status === "Pending" ? "warning" : "muted"}>{m.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
