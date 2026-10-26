import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { blocks, members as initialMembers, type Member } from "@/lib/data";
import { RegisterMemberModal, type RegisterMemberData } from "@/components/RegisterMemberModal";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "सदस्य – संगठन सेतु" },
      { name: "description", content: "पार्टी सदस्यों और पदाधिकारियों की खोज योग्य सूची।" },
      { property: "og:title", content: "सदस्य – संगठन सेतु" },
      { property: "og:description", content: "पार्टी सदस्यों और पदाधिकारियों की खोज योग्य सूची।" },
    ],
  }),
  component: Members,
});

const designations = [
  "कार्यकर्ता",
  "बूथ समन्वयक",
  "मंडल सचिव",
  "ब्लॉक अध्यक्ष",
  "युवा प्रकोष्ठ अध्यक्ष",
  "महिला मोर्चा अध्यक्ष",
  "आईटी सेल प्रभारी",
  "किसान मोर्चा प्रतिनिधि",
];

function Members() {
  const [memberList, setMemberList] = useState<Member[]>(initialMembers);
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form state

  const list = memberList.filter(
    (m) =>
      (!unit || m.unit === unit) &&
      `${m.name} ${m.id} ${m.designation}`.toLowerCase().includes(q.toLowerCase())
  );

  const inputClass = "border bg-card px-3 py-2 text-sm rounded-sm w-full";

  const handleAddMember = (_formData: RegisterMemberData, newMember: Member) => {
    setMemberList((current) => [newMember, ...current]);
    setIsModalOpen(false);
    setNotification(`सदस्य "${newMember.name}" (${newMember.id}) सफलतापूर्वक जोड़ा गया!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <>
      <PageHeader
        title="सदस्य निर्देशिका"
        subtitle={`${list.length} में से ${memberList.length} अभिलेख`}
        action={
          <button className={btn} onClick={() => setIsModalOpen(true)}>
            + सदस्य जोड़ें
          </button>
        }
      />

      <div className="p-6 space-y-4">
        {notification && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm px-4 py-3 rounded-sm flex items-center justify-between">
            <span>✓ {notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs text-emerald-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <input
            className="border bg-card px-3 py-2 text-sm rounded-sm flex-1 min-w-48"
            placeholder="नाम, सदस्य क्रमांक या पद से खोजें"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="border bg-card px-3 py-2 text-sm rounded-sm"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">सभी ब्लॉक</option>
            {blocks.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["सदस्य क्रमांक", "नाम", "पद", "ब्लॉक", "फ़ोन", "स्थिति"].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((m) => (
                <tr key={m.id} className="hover:bg-muted/50">
                  <td className="px-4 py-2.5 font-mono text-xs">{m.id}</td>
                  <td className="px-4 py-2.5 font-medium">{m.name}</td>
                  <td className="px-4 py-2.5">{m.designation}</td>
                  <td className="px-4 py-2.5">{m.unit}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.phone}</td>
                  <td className="px-4 py-2.5">
                    <Badge
                      tone={
                        m.status === "सक्रिय"
                          ? "success"
                          : m.status === "लंबित"
                            ? "warning"
                            : "muted"
                      }
                    >
                      {m.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RegisterMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMember}
      />
    </>
  );
}
