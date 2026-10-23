import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, btn } from "@/components/AppShell";
import { events } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "आयोजन – कांग्रेस जनता पार्टी सागर" },
      { name: "description", content: "आगामी बैठकों, रैलियों और उपस्थिति का विवरण।" },
      { property: "og:title", content: "आयोजन – कांग्रेस जनता पार्टी सागर" },
      { property: "og:description", content: "आगामी बैठकों, रैलियों और उपस्थिति का विवरण।" },
    ],
  }),
  component: Events,
});

function Events() {
  return (
    <>
      <PageHeader title="आयोजन और उपस्थिति" subtitle="बैठकें, सम्मेलन और रैलियाँ" action={<button className={btn} onClick={() => alert("यह नमूना है: आयोजन जोड़ने का प्रपत्र अभी उपलब्ध नहीं है।")}>+ नया आयोजन</button>} />
      <div className="p-6 grid md:grid-cols-2 gap-4">
        {events.map((e) => {
          const pct = Math.round((e.rsvp / e.expected) * 100);
          const d = new Date(`${e.date}T00:00:00+05:30`);
          return (
            <article key={e.id} className="panel flex">
              <div className="bg-primary text-primary-foreground w-20 flex flex-col items-center justify-center shrink-0">
                <span className="font-serif text-2xl">{d.toLocaleString("hi-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}</span>
                <span className="text-xs uppercase tracking-wider">{d.toLocaleString("hi-IN", { month: "short", timeZone: "Asia/Kolkata" })}</span>
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-lg">{e.title}</h2>
                <p className="text-sm text-muted-foreground">{e.place}</p>
                <div className="mt-3 h-1.5 bg-muted rounded-sm"><div className="h-full bg-accent rounded-sm" style={{ width: `${pct}%` }} /></div>
                <p className="text-xs mt-1">{e.rsvp} पुष्ट, कुल {e.expected} अपेक्षित ({pct}%)</p>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
