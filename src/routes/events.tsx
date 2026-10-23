import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, btn } from "@/components/AppShell";
import { events } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events – CJP Sagar" },
      { name: "description", content: "Upcoming meetings, rallies and attendance tracking." },
      { property: "og:title", content: "Events – CJP Sagar" },
      { property: "og:description", content: "Upcoming meetings, rallies and attendance tracking." },
    ],
  }),
  component: Events,
});

function Events() {
  return (
    <>
      <PageHeader title="Events & Attendance" subtitle="Meetings, sammelans and rallies" action={<button className={btn} onClick={() => alert("Prototype: create event form")}>+ New event</button>} />
      <div className="p-6 grid md:grid-cols-2 gap-4">
        {events.map((e) => {
          const pct = Math.round((e.rsvp / e.expected) * 100);
          const d = new Date(e.date);
          return (
            <article key={e.id} className="panel flex">
              <div className="bg-primary text-primary-foreground w-20 flex flex-col items-center justify-center shrink-0">
                <span className="font-serif text-2xl">{d.getDate()}</span>
                <span className="text-xs uppercase tracking-wider">{d.toLocaleString("en", { month: "short" })}</span>
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-lg">{e.title}</h2>
                <p className="text-sm text-muted-foreground">{e.place}</p>
                <div className="mt-3 h-1.5 bg-muted rounded-sm"><div className="h-full bg-accent rounded-sm" style={{ width: `${pct}%` }} /></div>
                <p className="text-xs mt-1">{e.rsvp} confirmed of {e.expected} expected ({pct}%)</p>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
