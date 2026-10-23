import { createFileRoute } from "@tanstack/react-router";
import { TaskChart } from "@/components/DataCharts";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { formatDate, tasks } from "@/lib/data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "कार्य – कांग्रेस जनता पार्टी सागर" },
      { name: "description", content: "जिले की इकाइयों के कार्य आवंटन और अनुवर्ती कार्य।" },
      { property: "og:title", content: "कार्य – कांग्रेस जनता पार्टी सागर" },
      { property: "og:description", content: "जिले की इकाइयों के कार्य आवंटन और अनुवर्ती कार्य।" },
    ],
  }),
  component: Tasks,
});

const cols = ["करना है", "प्रगति में", "समय सीमा पार", "पूर्ण"];

function Tasks() {
  return (
    <>
      <PageHeader title="कार्य और जिम्मेदारियाँ" subtitle="ब्लॉकवार कार्य की स्थिति" action={<button className={btn} onClick={() => alert("यह नमूना है: कार्य सौंपने का प्रपत्र अभी उपलब्ध नहीं है।")}>+ कार्य सौंपें</button>} />
      <div className="px-6 pt-6"><TaskChart /></div>
      <div className="p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cols.map((c) => (
          <section key={c} className="bg-muted rounded-sm p-3">
            <h2 className="text-sm font-sans font-semibold uppercase tracking-wider mb-3 px-1">{c} <span className="text-muted-foreground">({tasks.filter((t) => t.status === c).length})</span></h2>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === c).map((t) => (
                <div key={t.id} className="panel p-3 text-sm">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.unit} · {t.owner}</div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge tone={t.priority === "उच्च" ? "destructive" : t.priority === "मध्यम" ? "warning" : "muted"}>{t.priority}</Badge>
                    <span className="text-xs text-muted-foreground">अंतिम तिथि {formatDate(t.due)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
