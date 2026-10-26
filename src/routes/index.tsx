import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BlockChart, TaskChart } from "@/components/DataCharts";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { SagarPollMap } from "@/components/SagarPollMap";
import { formatDate, activity, events, members, tasks, blockStats } from "@/lib/data";
import { useRbac } from "@/lib/rbac";
import { RegisterMemberModal, type RegisterMemberData } from "@/components/RegisterMemberModal";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Download,
  UserPlus,
  ShieldCheck,
  MapPin,
  Clock,
  Layers,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "डैशबोर्ड – संगठन सेतु" },
      {
        name: "description",
        content:
          "संगठनात्मक समीक्षा डैशबोर्ड (Executive Cadre KPI) - सागर जिला कांग्रेस कमेटी, चुनावी तैयारी एवं बीएलए सक्रियता रिपोर्ट।",
      },
      { property: "og:title", content: "डैशबोर्ड – संगठन सेतु" },
      {
        property: "og:description",
        content:
          "संगठनात्मक समीक्षा डैशबोर्ड (Executive Cadre KPI) - सागर जिला कांग्रेस कमेटी, चुनावी तैयारी एवं बीएलए सक्रियता रिपोर्ट।",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { currentRole, scopedMembersCount, totalMembersCount, isScoped } = useRbac();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Scoped members
  const scopedMembers =
    currentRole.level === 5
      ? members.filter((m) => m.boothNo === currentRole.boothNo)
      : currentRole.level === 4
        ? members.filter((m) => m.mandal === currentRole.mandal)
        : currentRole.level === 3
          ? members.filter((m) => m.block === currentRole.block)
          : currentRole.level === 2
            ? members.filter((m) => m.vidhanSabha === currentRole.vidhanSabha)
            : members;

  // Active cadre count for display
  const activeCadreCount = isScoped ? (currentRole.level === 5 ? 60 : scopedMembers.length * 30) : 1420;
  const verifiedCount = scopedMembers.filter((m) => m.status === "सक्रिय").length;

  const handleExportRoster = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["सदस्य क्रमांक,नाम,पद,ब्लॉक,फ़ोन,स्थिति"]
        .concat(
          scopedMembers.map(
            (m) => `${m.id},${m.name},${m.designation},${m.unit},${m.phone},${m.status}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cadre_roster_${currentRole.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageHeader
        title="संगठनात्मक समीक्षा डैशबोर्ड (Executive Cadre KPI)"
        subtitle="सागर जिला कांग्रेस कमेटी · चुनावी तैयारी एवं बीएलए सक्रियता रिपोर्ट"
        action={
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAddMemberOpen(true)}
              disabled={!currentRole.capabilities.canAddMember}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md shadow-xs transition-colors ${
                currentRole.capabilities.canAddMember
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              }`}
            >
              <UserPlus className="size-3.5" />
              <span>+ नया कार्यकर्ता जोड़ें</span>
            </button>
            <button
              type="button"
              onClick={handleExportRoster}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>रोस्टर डाउनलोड / निर्यात</span>
            </button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* EXECUTIVE KPI SUMMARY CARDS (Matches Screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Active Cadre */}
          <div className="panel p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <span>सक्रिय कार्यकर्ता (ACTIVE CADRE)</span>
              <Users className="size-4 text-primary opacity-80" />
            </div>
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="font-serif text-3xl font-bold text-foreground">
                {activeCadreCount}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                <TrendingUp className="size-3 mr-0.5" /> +12.4%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>सत्यापित रिकॉर्ड: <strong className="text-foreground">{verifiedCount}</strong></span>
              <span className="font-medium text-emerald-600">100% स्थानीय</span>
            </div>
          </div>

          {/* 2. BLA Appointed */}
          <div className="panel p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <span>नियुक्त बीएलए कवरेज (BLA APPOINTED)</span>
              <CheckCircle2 className="size-4 text-emerald-600 opacity-80" />
            </div>
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="font-serif text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                100%
              </span>
              <span className="text-xs text-muted-foreground">
                {currentRole.level === 5 ? "(1 पूर्ण / 1 बूथ)" : "(2,183 / 2,183 बूथ)"}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
              <span>लक्ष्य: 100% मतदान केंद्र बीएलए-1 व 2 नियुक्त</span>
            </div>
          </div>

          {/* 3. Jurisdictional Scope */}
          <div className="panel p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <span>क्षेत्रीय अधिकार क्षेत्र (SCOPE)</span>
              <MapPin className="size-4 text-primary opacity-80" />
            </div>
            <div className="mt-3">
              <div className="font-bold text-lg text-foreground truncate" title={currentRole.scopeBadge}>
                {currentRole.scopeBadge}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {currentRole.boothsCount} मतदान केंद्र · {currentRole.votersCount.toLocaleString("hi-IN")} मतदाता
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">पदानुक्रम स्तर:</span>
              <Badge tone="muted">Level {currentRole.level} ({currentRole.levelLabel.split(" ")[0]})</Badge>
            </div>
          </div>

          {/* 4. Tasks & Operations */}
          <div className="panel p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <span>कार्य निष्पादन (CADRE TASKS)</span>
              <Clock className="size-4 text-amber-600 opacity-80" />
            </div>
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="font-serif text-3xl font-bold text-foreground">
                {tasks.filter((t) => t.status === "प्रगति में" || t.status === "समय सीमा पार").length}
              </span>
              <span className="text-xs text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                समय सीमा पार: {tasks.filter((t) => t.status === "समय सीमा पार").length}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>समीक्षा चक्र: साप्ताहिक</span>
              <Link to="/tasks" className="text-primary hover:underline font-medium">
                विवरण देखें →
              </Link>
            </div>
          </div>
        </div>

        {/* ROLE CONTEXT QUICK INSIGHT */}
        <div className="panel p-4 bg-muted/20 border-l-4 border-primary flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-primary shrink-0" />
            <div>
              <div className="text-sm font-semibold text-foreground">
                सक्रिय भूमिका प्रोफाइल: {currentRole.name} ({currentRole.designation})
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentRole.scopeDescription}
              </p>
            </div>
          </div>
          <Link
            to="/organization"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>सम्पूर्ण RBAC पदानुक्रम व अधिकार मैट्रिक्स देखें</span> →
          </Link>
        </div>

        {/* Interactive India & Sagar District Polling Map */}
        <SagarPollMap />

        {/* Charts & Analytics */}
        <div className="grid xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6">
          <BlockChart />
          <TaskChart />
        </div>

        {/* Critical Tasks & Upcoming Events */}
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="panel lg:col-span-2">
            <h2 className="px-5 py-3 border-b border-border text-base font-semibold">
              ध्यान देने योग्य कार्य (Critical Tasks)
            </h2>
            <ul className="divide-y divide-border/60">
              {tasks.filter((t) => t.status !== "पूर्ण").slice(0, 5).map((t) => (
                <li key={t.id} className="px-5 py-3 flex justify-between gap-3 text-sm">
                  <div>
                    <div className="font-medium text-foreground">{t.title}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      {t.unit} (ब्लॉक: {t.block}) · प्रभारी: {t.owner}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge tone={t.status === "समय सीमा पार" ? "destructive" : "muted"}>
                      {t.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(t.due)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2 className="px-5 py-3 border-b border-border text-base font-semibold">
              आगामी आयोजन (Events)
            </h2>
            <ul className="divide-y divide-border/60">
              {events.map((e) => (
                <li key={e.id} className="px-5 py-3 text-sm">
                  <div className="font-medium text-foreground">{e.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(e.date)} · {e.place}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Recent Field Activities */}
        <section className="panel">
          <h2 className="px-5 py-3 border-b border-border text-base font-semibold">
            हाल की गतिविधियाँ (Field Cadre Logs)
          </h2>
          <ul className="divide-y divide-border/60 text-sm">
            {activity.map((a) => (
              <li key={a} className="px-5 py-2.5 text-muted-foreground hover:text-foreground transition-colors">
                ✓ {a}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <RegisterMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSave={(_data, newMember) => {
          setIsAddMemberOpen(false);
          alert(`सदस्य "${newMember.name}" पंजीकृत किया गया।`);
        }}
      />
    </>
  );
}
