import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, btn } from "@/components/AppShell";
import { events as initialEvents } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "आयोजन – संगठन सेतु" },
      { name: "description", content: "आगामी बैठकों, रैलियों और उपस्थिति का विवरण।" },
      { property: "og:title", content: "आयोजन – संगठन सेतु" },
      { property: "og:description", content: "आगामी बैठकों, रैलियों और उपस्थिति का विवरण।" },
    ],
  }),
  component: Events,
});

type EventItem = {
  id: number;
  title: string;
  date: string;
  place: string;
  expected: number;
  rsvp: number;
};

function Events() {
  const [eventList, setEventList] = useState<EventItem[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]!,
    place: "",
    expected: 250,
    rsvp: 50,
  });

  const inputClass = "border bg-card px-3 py-2 text-sm rounded-sm w-full";

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.place.trim()) return;

    const newEvent: EventItem = {
      id: Date.now(),
      title: formData.title.trim(),
      date: formData.date,
      place: formData.place.trim(),
      expected: Number(formData.expected) || 100,
      rsvp: Number(formData.rsvp) || 0,
    };

    setEventList([newEvent, ...eventList]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]!,
      place: "",
      expected: 250,
      rsvp: 50,
    });
    setNotification(`नया आयोजन "${newEvent.title}" सफलतापूर्वक जोड़ा गया!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <>
      <PageHeader
        title="आयोजन और उपस्थिति"
        subtitle="बैठकें, सम्मेलन और रैलियाँ"
        action={
          <button className={btn} onClick={() => setIsModalOpen(true)}>
            + नया आयोजन
          </button>
        }
      />

      {notification && (
        <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm px-4 py-3 rounded-sm flex items-center justify-between">
          <span>✓ {notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-emerald-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-6 grid md:grid-cols-2 gap-4">
        {eventList.map((e) => {
          const pct = Math.min(100, Math.round((e.rsvp / (e.expected || 1)) * 100));
          const d = new Date(`${e.date}T00:00:00+05:30`);
          return (
            <article key={e.id} className="panel flex">
              <div className="bg-primary text-primary-foreground w-20 flex flex-col items-center justify-center shrink-0">
                <span className="font-serif text-2xl">
                  {d.toLocaleString("hi-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}
                </span>
                <span className="text-xs uppercase tracking-wider">
                  {d.toLocaleString("hi-IN", { month: "short", timeZone: "Asia/Kolkata" })}
                </span>
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-lg">{e.title}</h2>
                <p className="text-sm text-muted-foreground">{e.place}</p>
                <div className="mt-3 h-1.5 bg-muted rounded-sm">
                  <div className="h-full bg-accent rounded-sm" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs mt-1">
                  {e.rsvp} पुष्ट, कुल {e.expected} अपेक्षित ({pct}%)
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Event Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border shadow-xl rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold">नया आयोजन जोड़ें</h3>
                <p className="text-xs text-muted-foreground">रैली, बैठक या सम्मेलन का विवरण दर्ज करें</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-lg px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium mb-1">आयोजन का नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. सागर जिला कार्यकर्ता सम्मेलन"
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">स्थान / स्थल *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. पद्माकर सभागार, सिविल लाइन्स, सागर"
                  className={inputClass}
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">दिनांक</label>
                <input
                  type="date"
                  className={inputClass}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">अपेक्षित संख्या</label>
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={formData.expected}
                    onChange={(e) => setFormData({ ...formData, expected: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">पुष्ट उपस्थिति (RSVP)</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={formData.rsvp}
                    onChange={(e) => setFormData({ ...formData, rsvp: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-sm border hover:bg-muted"
                >
                  रद्द करें
                </button>
                <button type="submit" className={btn}>
                  आयोजन सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
