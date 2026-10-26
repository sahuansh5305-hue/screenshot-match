import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { blocks, members as initialMembers, type Member } from "@/lib/data";

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
  const [formData, setFormData] = useState({
    name: "",
    designation: "कार्यकर्ता",
    unit: "सागर",
    phone: "",
    status: "सक्रिय" as Member["status"],
  });

  const list = memberList.filter(
    (m) =>
      (!unit || m.unit === unit) &&
      `${m.name} ${m.id} ${m.designation}`.toLowerCase().includes(q.toLowerCase())
  );

  const inputClass = "border bg-card px-3 py-2 text-sm rounded-sm w-full";

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newId = `कजपा-सागर-${1000 + memberList.length + 1}`;
    const newMember: Member = {
      id: newId,
      name: formData.name.trim(),
      designation: formData.designation,
      unit: formData.unit,
      phone: formData.phone.trim() || "+91 9800000000",
      status: formData.status,
      joined: new Date().toISOString().split("T")[0]!,
    };

    setMemberList([newMember, ...memberList]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      designation: "कार्यकर्ता",
      unit: "सागर",
      phone: "",
      status: "सक्रिय",
    });
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

      {/* Member Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border shadow-xl rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold">नया सदस्य जोड़ें</h3>
                <p className="text-xs text-muted-foreground">संगठन में नए कार्यकर्ता या पदाधिकारी का विवरण दर्ज करें</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-lg px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium mb-1">पूरा नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रमेश कुमार साहू"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">पद / दायित्व</label>
                  <select
                    className={inputClass}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  >
                    {designations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">ब्लॉक / विधानसभा</label>
                  <select
                    className={inputClass}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    {blocks.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">मोबाइल नंबर</label>
                <input
                  type="tel"
                  placeholder="+91 98XXXXXXXX"
                  className={inputClass}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">स्थिति</label>
                <select
                  className={inputClass}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as Member["status"] })
                  }
                >
                  <option value="सक्रिय">सक्रिय</option>
                  <option value="लंबित">लंबित</option>
                  <option value="निष्क्रिय">निष्क्रिय</option>
                </select>
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
                  सदस्य सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
