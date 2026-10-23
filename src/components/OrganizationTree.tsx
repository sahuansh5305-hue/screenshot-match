import { useState } from "react";
import { ChevronDown, ChevronRight, Network, UserRound, ChevronsDown, ChevronsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blockStats, members, type Member } from "@/lib/data";
import { Badge } from "@/components/AppShell";

export function OrganizationTree() {
  const [open, setOpen] = useState<string[]>(["सागर"]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const visible = blockStats.filter((b) => b.block.includes(query) || members.some((m) => m.unit === b.block && `${m.name} ${m.designation}`.includes(query)));
  return <div className="grid xl:grid-cols-[1fr_280px] gap-6">
    <section className="min-w-0" aria-label="संगठन वृक्ष">
      <div className="flex flex-wrap gap-2 mb-5">
        <input aria-label="संगठन में खोजें" placeholder="ब्लॉक, नाम या पद खोजें" className="border bg-card rounded-sm px-3 py-2 text-sm flex-1 min-w-40" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button variant="outline" size="icon" title="सभी शाखाएँ खोलें" aria-label="सभी शाखाएँ खोलें" onClick={() => setOpen(blockStats.map((b) => b.block))}><ChevronsDown /></Button>
        <Button variant="outline" size="icon" title="सभी शाखाएँ बंद करें" aria-label="सभी शाखाएँ बंद करें" onClick={() => { setOpen([]); setQuery(""); }}><ChevronsUp /></Button>
      </div>
      <div className="flex items-center gap-3 border-b pb-4 text-primary"><Network className="size-7" /><div><h2 className="text-xl">सागर जिला</h2><p className="text-xs text-muted-foreground">मध्य प्रदेश · {blockStats.length} ब्लॉक · नमूना संगठन</p></div></div>
      <ul className="ml-3 border-l pl-5 mt-4 space-y-3">
        {visible.map((b) => {
          const expanded = open.includes(b.block) || Boolean(query);
          const leaders = members.filter((m) => m.unit === b.block && (!query || b.block.includes(query) || `${m.name} ${m.designation}`.includes(query)));
          return <li key={b.block} className="relative before:absolute before:w-5 before:border-t before:-left-5 before:top-5">
            <Button variant="outline" aria-expanded={expanded} aria-controls={`branch-${b.block}`} onClick={() => setOpen((prev) => prev.includes(b.block) ? prev.filter((v) => v !== b.block) : [...prev, b.block])} className="w-full h-auto min-h-12 py-3 px-3 justify-start whitespace-normal text-left">
              {expanded ? <ChevronDown /> : <ChevronRight />}<span className="flex-1">{b.block} ब्लॉक</span><span className="text-xs text-muted-foreground">{b.members.toLocaleString("hi-IN")} सदस्य</span>
            </Button>
            {expanded && <div id={`branch-${b.block}`} className="ml-5 border-l pl-4 py-3">
              <p className="text-xs text-muted-foreground mb-3">{b.covered}/{b.booths} बूथ कवरेज · {Math.round(b.covered / b.booths * 100)}%</p>
              <ul className="space-y-2">{leaders.map((m) => <li key={m.id}><Button variant="ghost" aria-pressed={selected?.id === m.id} className={`w-full h-auto py-2 justify-start whitespace-normal text-left ${selected?.id === m.id ? "bg-muted" : ""}`} onClick={() => setSelected(m)}><UserRound className="text-primary" /><span><span className="block">{m.name}</span><span className="block text-xs text-muted-foreground">{m.designation}</span></span></Button></li>)}</ul>
            </div>}
          </li>;
        })}
      </ul>
      {visible.length === 0 && <p className="py-8 text-muted-foreground text-sm">कोई परिणाम नहीं मिला।</p>}
    </section>
    <aside className="border-t xl:border-t-0 xl:border-l pt-5 xl:pt-0 xl:pl-5" aria-live="polite">
      <h2 className="text-lg mb-4">पदाधिकारी विवरण</h2>
      {selected ? <div className="space-y-4"><UserRound className="size-10 text-primary" /><div><h3 className="text-xl">{selected.name}</h3><p className="text-sm text-muted-foreground">{selected.designation}</p></div><Badge tone={selected.status === "सक्रिय" ? "success" : selected.status === "लंबित" ? "warning" : "muted"}>{selected.status}</Badge><dl className="text-sm space-y-3"><div><dt className="text-muted-foreground">ब्लॉक</dt><dd>{selected.unit}</dd></div><div><dt className="text-muted-foreground">सदस्य क्रमांक</dt><dd>{selected.id}</dd></div><div><dt className="text-muted-foreground">फ़ोन</dt><dd>{selected.phone}</dd></div></dl></div> : <p className="text-sm text-muted-foreground">कोई पदाधिकारी चयनित नहीं है।</p>}
      <div className="border-t mt-6 pt-4 text-xs text-muted-foreground">मंडल और बूथ की पदाधिकारी सूची उपलब्ध नहीं है।</div>
    </aside>
  </div>;
}