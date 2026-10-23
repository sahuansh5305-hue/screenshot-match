import { createFileRoute } from "@tanstack/react-router";
import { BlockChart } from "@/components/DataCharts";
import { PageHeader, btn } from "@/components/AppShell";
import { blockStats } from "@/lib/data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "प्रतिवेदन – कांग्रेस जनता पार्टी सागर" },
      { name: "description", content: "ब्लॉकवार बूथ कवरेज और सदस्यता प्रतिवेदन।" },
      { property: "og:title", content: "प्रतिवेदन – कांग्रेस जनता पार्टी सागर" },
      { property: "og:description", content: "ब्लॉकवार बूथ कवरेज और सदस्यता प्रतिवेदन।" },
    ],
  }),
  component: Reports,
});

function Reports() {
  return (
    <>
      <PageHeader title="प्रतिवेदन" subtitle="ब्लॉकवार प्रदर्शन, सागर जिला" action={<button className={btn} onClick={() => alert("यह नमूना है: प्रतिवेदन डाउनलोड करना अभी उपलब्ध नहीं है।")}>डाउनलोड करें</button>} />
      <div className="p-6 grid lg:grid-cols-2 gap-6">
        <BlockChart />
        <section className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2.5">ब्लॉक</th><th className="px-4 py-2.5">बूथ</th><th className="px-4 py-2.5">कवर किए गए</th><th className="px-4 py-2.5">कवरेज</th></tr>
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
