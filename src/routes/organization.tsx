import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OrganizationTree } from "@/components/OrganizationTree";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { useRbac, USER_ROLES, type UserRole } from "@/lib/rbac";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Network,
  ChevronRight,
  ArrowRight,
  Layers,
  Lock,
  Eye,
  Send,
  UserPlus,
  ClipboardList,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "संगठनात्मक संरचना एवं भूमिका पदानुक्रम – संगठन सेतु" },
      {
        name: "description",
        content:
          "सागर जिला कांग्रेस कमेटी: 5-स्तरीय उपयोगकर्ता पदानुक्रम (RBAC Hierarchy) एवं भूमिका आधारित अधिकार मैट्रिक्स।",
      },
      { property: "og:title", content: "संगठनात्मक संरचना एवं भूमिका पदानुक्रम – संगठन सेतु" },
      {
        property: "og:description",
        content:
          "सागर जिला कांग्रेस कमेटी: 5-स्तरीय उपयोगकर्ता पदानुक्रम (RBAC Hierarchy) एवं भूमिका आधारित अधिकार मैट्रिक्स।",
      },
    ],
  }),
  component: Org,
});

function Org() {
  const { currentRole, setCurrentRoleId, switchToSuperAdmin } = useRbac();
  const [activeTab, setActiveTab] = useState<"hierarchy" | "matrix" | "tree">("hierarchy");
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<UserRole>(currentRole);

  const capabilityMatrixRows = [
    {
      category: "डेटा दृश्यता (Data Visibility)",
      icon: Eye,
      name: "डेटा दृश्यता स्कोप (View Scope)",
      dcc: "सम्पूर्ण सागर जिला (8 वि.स., 2,183 बूथ)",
      assembly: "केवल 037-सुरखी वि.स. (295 बूथ)",
      block: "केवल राहतगढ़ ब्लॉक (118 बूथ)",
      mandal: "केवल सीहोरा मंडलम (18 बूथ)",
      booth: "केवल बूथ 101 (842 मतदाता, 5 कार्यकर्ता)",
    },
    {
      category: "कार्यकर्ता प्रबंधन (Cadre Management)",
      icon: UserPlus,
      name: "नया कार्यकर्ता जोड़ना (Add Cadre)",
      dcc: true,
      assembly: true,
      block: true,
      mandal: true,
      booth: false,
    },
    {
      category: "कार्यकर्ता प्रबंधन (Cadre Management)",
      icon: Users,
      name: "कार्यकर्ता प्रोफ़ाइल संपादन (Edit Cadre)",
      dcc: true,
      assembly: true,
      block: true,
      mandal: false,
      booth: false,
    },
    {
      category: "बीएलए एवं चुनाव (BLA & Polling)",
      icon: CheckCircle2,
      name: "बीएलए-1 व 2 सत्यापन (BLA Verification)",
      dcc: true,
      assembly: true,
      block: true,
      mandal: true,
      booth: true,
    },
    {
      category: "अभियान एवं संदेश (Campaign & Broadcast)",
      icon: Send,
      name: "संदेश व व्हाट्सएप प्रसारण (Broadcast)",
      dcc: "समस्त जिला व विधानसभा",
      assembly: "विधानसभा क्षेत्र तक",
      block: "ब्लॉक क्षेत्र तक",
      mandal: false,
      booth: false,
    },
    {
      category: "कार्य आवंटन (Task Allocation)",
      icon: ClipboardList,
      name: "कार्य आवंटन व समीक्षा (Assign Tasks)",
      dcc: true,
      assembly: true,
      block: true,
      mandal: false,
      booth: false,
    },
    {
      category: "डेटा निर्यात (Data Export)",
      icon: FileSpreadsheet,
      name: "रोस्टर व डेटा डाउनलोड (Export Reports)",
      dcc: true,
      assembly: true,
      block: true,
      mandal: false,
      booth: false,
    },
    {
      category: "प्रशासन (Administration)",
      icon: Settings,
      name: "उपयोगकर्ता रोल व अधिकार प्रबंधन (Manage RBAC)",
      dcc: true,
      assembly: false,
      block: false,
      mandal: false,
      booth: false,
    },
  ];

  return (
    <>
      <PageHeader
        title="संगठनात्मक संरचना एवं उपयोगकर्ता पदानुक्रम (Hierarchy & RBAC)"
        subtitle="सागर जिला कांग्रेस कमेटी · 5-स्तरीय संगठनात्मक अधिकार, कार्यक्षेत्र स्कोप एवं अनुमतियाँ"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={switchToSuperAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold"
            >
              <Shield className="size-3.5 text-primary" />
              <span>सुपर एडमिन रीसेट</span>
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* TABS HEADER */}
        <div className="flex border-b border-border gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("hierarchy")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "hierarchy"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Network className="size-4" />
            <span>5-स्तरीय पदानुक्रम (Role Hierarchy)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "matrix"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="size-4" />
            <span>भूमिका एवं अधिकार मैट्रिक्स (RBAC Matrix)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tree")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "tree"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-4" />
            <span>ब्लॉक संगठन वृक्ष (Block Units)</span>
          </button>
        </div>

        {/* TAB 1: 5-LEVEL ROLE HIERARCHY */}
        {activeTab === "hierarchy" && (
          <div className="space-y-6">
            {/* Live Role Switcher Tester */}
            <div className="panel p-5 bg-muted/20 border-l-4 border-primary">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 font-bold text-base text-foreground">
                    <Shield className="size-5 text-primary" />
                    <span>वर्तमान में सक्रिय भूमिका (Active Role Session):</span>
                    <Badge tone={currentRole.isSuperAdmin ? "success" : "warning"}>
                      Level {currentRole.level} - {currentRole.levelLabel.split(" ")[0]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    सक्रिय उपयोगकर्ता: <strong>{currentRole.name}</strong> ({currentRole.designation}) · निर्धारित स्कोप: <strong>{currentRole.scopeBadge}</strong>
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  (नीचे किसी भी पद पर क्लिक करके लाइव भूमिका में स्विच कर सकते हैं)
                </div>
              </div>
            </div>

            {/* Hierarchical Role Cards Flow */}
            <div className="grid gap-4">
              {USER_ROLES.map((role, idx) => {
                const isActive = currentRole.id === role.id;
                const isSelectedForDetail = selectedRoleDetail.id === role.id;

                return (
                  <div
                    key={role.id}
                    className={`panel p-5 transition-all cursor-pointer hover:border-primary/60 relative ${
                      isActive ? "ring-2 ring-primary bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setSelectedRoleDetail(role);
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center size-12 rounded-xl bg-muted border border-border shrink-0 font-bold">
                          <span className="text-[10px] text-muted-foreground uppercase">Level</span>
                          <span className="text-lg text-primary leading-none">{role.level}</span>
                        </div>
                        <img
                          src={role.avatarUrl}
                          alt={role.name}
                          className="size-12 rounded-full object-cover ring-2 ring-border shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base text-foreground leading-tight">
                              {role.designation}
                            </h3>
                            {role.isSuperAdmin ? (
                              <span className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                                सुपर एडमिन (Super Admin)
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                                डाउनवर्ड स्कोप (Scoped RBAC)
                              </span>
                            )}
                            {isActive && (
                              <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                वर्तमान सक्रिय उपयोगकर्ता
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span>पदाधिकारी: <strong className="text-foreground">{role.name}</strong></span>
                            <span>•</span>
                            <span>समिति: {role.tierName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-center sm:self-start">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentRoleId(role.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-card hover:bg-muted text-foreground"
                          }`}
                        >
                          {isActive ? "✓ सक्रिय भूमिका" : "इस भूमिका में स्विच करें →"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/60 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground">अधिकार क्षेत्र (Scope)</div>
                        <div className="font-semibold text-foreground mt-0.5">{role.scopeBadge}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">मतदान केंद्र / मतदाता</div>
                        <div className="font-semibold text-foreground mt-0.5">
                          {role.boothsCount.toLocaleString("hi-IN")} बूथ · {role.votersCount.toLocaleString("hi-IN")} मतदाता
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">संदेश प्रसारण अधिकार</div>
                        <div className="font-semibold text-foreground mt-0.5">
                          {role.capabilities.canBroadcast}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">कार्यकर्ता संपादन</div>
                        <div className="font-semibold text-foreground mt-0.5">
                          {role.capabilities.canEditCadre ? "✓ अधिकृत (अनुमति प्राप्त)" : "✗ केवल पठन (Read-Only)"}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-md leading-relaxed">
                      {role.scopeDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: RBAC CAPABILITY MATRIX */}
        {activeTab === "matrix" && (
          <div className="space-y-6">
            <div className="panel p-5 bg-card overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-border flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    भूमिका आधारित अधिकार तुलना तालिका (Role Capability Matrix)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    पार्टी संगठनात्मक संरचना के सभी 5 स्तरों पर प्रदान की गई अनुमतियाँ
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="size-4" /> पूर्ण अधिकार
                  </span>
                  <span className="flex items-center gap-1 text-red-500 font-semibold">
                    <XCircle className="size-4" /> प्रतिबंधित
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground uppercase text-[11px] font-semibold border-b border-border">
                    <tr>
                      <th className="p-3">अधिकार / क्षमता (Permission)</th>
                      <th className="p-3">Level 1: जिला प्रभारी (DCC)</th>
                      <th className="p-3">Level 2: वि.स. अध्यक्ष (037)</th>
                      <th className="p-3">Level 3: ब्लॉक अध्यक्ष (राहतगढ़)</th>
                      <th className="p-3">Level 4: मंडलम अध्यक्ष (सीहोरा)</th>
                      <th className="p-3">Level 5: बूथ संयोजक (101)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {capabilityMatrixRows.map((row, idx) => {
                      const Icon = row.icon;
                      return (
                        <tr key={idx} className="hover:bg-muted/40 transition-colors">
                          <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                            <Icon className="size-3.5 text-primary shrink-0" />
                            <span>{row.name}</span>
                          </td>
                          {/* DCC */}
                          <td className="p-3 font-medium">
                            {typeof row.dcc === "boolean" ? (
                              row.dcc ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <CheckCircle2 className="size-3.5" /> हाँ (सक्षम)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500">
                                  <XCircle className="size-3.5" /> नहीं
                                </span>
                              )
                            ) : (
                              <span className="text-foreground">{row.dcc}</span>
                            )}
                          </td>
                          {/* Assembly */}
                          <td className="p-3 font-medium">
                            {typeof row.assembly === "boolean" ? (
                              row.assembly ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <CheckCircle2 className="size-3.5" /> हाँ (वि.स. तक)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500">
                                  <XCircle className="size-3.5" /> नहीं
                                </span>
                              )
                            ) : (
                              <span className="text-foreground">{row.assembly}</span>
                            )}
                          </td>
                          {/* Block */}
                          <td className="p-3 font-medium">
                            {typeof row.block === "boolean" ? (
                              row.block ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <CheckCircle2 className="size-3.5" /> हाँ (ब्लॉक तक)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500">
                                  <XCircle className="size-3.5" /> नहीं
                                </span>
                              )
                            ) : (
                              <span className="text-foreground">{row.block}</span>
                            )}
                          </td>
                          {/* Mandal */}
                          <td className="p-3 font-medium">
                            {typeof row.mandal === "boolean" ? (
                              row.mandal ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <CheckCircle2 className="size-3.5" /> हाँ (अनुशंसा)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500">
                                  <XCircle className="size-3.5" /> नहीं
                                </span>
                              )
                            ) : (
                              <span className="text-foreground">{row.mandal}</span>
                            )}
                          </td>
                          {/* Booth */}
                          <td className="p-3 font-medium">
                            {typeof row.booth === "boolean" ? (
                              row.booth ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <CheckCircle2 className="size-3.5" /> हाँ (बूथ 101)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-500">
                                  <XCircle className="size-3.5" /> नहीं
                                </span>
                              )
                            ) : (
                              <span className="text-foreground">{row.booth}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BLOCK UNITS TREE */}
        {activeTab === "tree" && (
          <div className="panel p-6">
            <h3 className="text-base font-bold text-foreground mb-4">
              सागर जिला ब्लॉक एवं मंडल संरचना वृक्ष
            </h3>
            <OrganizationTree />
          </div>
        )}
      </div>
    </>
  );
}
