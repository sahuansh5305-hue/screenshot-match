import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { blocks, members as initialMembers, type Member } from "@/lib/data";
import { RegisterMemberModal, type RegisterMemberData } from "@/components/RegisterMemberModal";
import { useRbac } from "@/lib/rbac";
import { ShieldAlert, UserPlus, Filter, MapPin } from "lucide-react";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "कार्यकर्ता निर्देशिका – संगठन प्रबंधन" },
      { name: "description", content: "पार्टी सदस्यों और पदाधिकारियों की खोज योग्य सूची।" },
      { property: "og:title", content: "कार्यकर्ता निर्देशिका – संगठन प्रबंधन" },
      { property: "og:description", content: "पार्टी सदस्यों और पदाधिकारियों की खोज योग्य सूची।" },
    ],
  }),
  component: Members,
});

function Members() {
  const { currentRole, isScoped } = useRbac();
  const [memberList, setMemberList] = useState<Member[]>(initialMembers);
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Scoped members based on RBAC role
  const roleScopedList = memberList.filter((m) => {
    if (currentRole.level === 5 && currentRole.boothNo) {
      return m.boothNo === currentRole.boothNo;
    }
    if (currentRole.level === 4 && currentRole.mandal) {
      return m.mandal === currentRole.mandal;
    }
    if (currentRole.level === 3 && currentRole.block) {
      return m.block === currentRole.block;
    }
    if (currentRole.level === 2 && currentRole.vidhanSabha) {
      return m.vidhanSabha === currentRole.vidhanSabha;
    }
    return true;
  });

  const list = roleScopedList.filter(
    (m) =>
      (!unit || m.unit === unit || m.block === unit) &&
      `${m.name} ${m.id} ${m.designation} ${m.boothNo ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  const handleAddMember = (_formData: RegisterMemberData, newMember: Member) => {
    setMemberList((current) => [newMember, ...current]);
    setIsModalOpen(false);
    setNotification(`सदस्य "${newMember.name}" (${newMember.id}) सफलतापूर्वक जोड़ा गया!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <>
      <PageHeader
        title="कार्यकर्ता निर्देशिका (Cadre Directory)"
        subtitle={`${list.length} में से ${memberList.length} अभिलेख ${
          isScoped ? `(स्कोप: ${currentRole.scopeBadge})` : "(सम्पूर्ण जिला)"
        }`}
        action={
          <button
            type="button"
            className={btn}
            onClick={() => setIsModalOpen(true)}
            disabled={!currentRole.capabilities.canAddMember}
            title={
              currentRole.capabilities.canAddMember
                ? "नया सदस्य जोड़ें"
                : "वर्तमान भूमिका में सदस्य जोड़ने की अनुमति नहीं है"
            }
          >
            <UserPlus className="size-4 mr-1.5 inline" />
            + सदस्य जोड़ें
          </button>
        }
      />

      <div className="p-6 space-y-4">
        {/* Scoped view notice if restricted */}
        {isScoped && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
            <ShieldAlert className="size-4 text-amber-600 shrink-0" />
            <span>
              <strong>डाउनवर्ड स्कोप फ़िल्टर लागू:</strong> आप <strong>{currentRole.name}</strong> ({currentRole.designation}) के रूप में केवल अपने निर्धारित क्षेत्र (<strong>{currentRole.scopeBadge}</strong>) के कार्यकर्ताओं को देख रहे हैं।
            </span>
          </div>
        )}

        {notification && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
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
            className="border border-border bg-card px-3 py-2 text-sm rounded-lg flex-1 min-w-48 text-foreground"
            placeholder="नाम, सदस्य क्रमांक, पद या बूथ संख्या से खोजें..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="border border-border bg-card px-3 py-2 text-sm rounded-lg text-foreground"
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
                {["सदस्य क्रमांक", "नाम", "पद", "ब्लॉक / मंडल", "बूथ संख्या", "फ़ोन", "स्थिति"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((m) => (
                <tr key={m.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs">{m.id}</td>
                  <td className="px-4 py-2.5 font-semibold text-foreground">
                    {m.name}
                    {m.isBla && (
                      <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold">
                        BLA
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{m.designation}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {m.unit} {m.mandal ? `· ${m.mandal}` : ""}
                  </td>
                  <td className="px-4 py-2.5">
                    {m.boothNo ? (
                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                        बूथ {m.boothNo}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{m.phone}</td>
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
              {list.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                    कोई कार्यकर्ता रिकॉर्ड नहीं मिला।
                  </td>
                </tr>
              )}
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
