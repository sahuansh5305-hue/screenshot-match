import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Users,
  UserCog,
  MapPin,
  Map as MapIcon,
  SquareCheck,
  ClipboardList,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Plus,
  Download,
  X,
  ArrowUp,
  RefreshCw,
  Info,
  Clock,
  ShieldCheck,
  UserRound,
  ClipboardCheck,
  CalendarClock,
  ZoomIn,
  ZoomOut,
  LocateFixed,
} from "lucide-react";
import { useRbac } from "@/lib/rbac";
import { members } from "@/lib/data";
import { RegisterMemberModal } from "@/components/RegisterMemberModal";
import { SagarPollMap } from "@/components/SagarPollMap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "संगठन समीक्षा डैशबोर्ड – संगठन सेतु सागर" },
      {
        name: "description",
        content: "जिला कांग्रेस कमेटी सागर - चुनावी तैयारी, संगठन सुदृढ़ीकरण और बूथ स्तरीय प्रबंधन डैशबोर्ड।",
      },
      { property: "og:title", content: "संगठन समीक्षा डैशबोर्ड – संगठन सेतु सागर" },
      {
        property: "og:description",
        content: "जिला कांग्रेस कमेटी सागर - चुनावी तैयारी, संगठन सुदृढ़ीकरण और बूथ स्तरीय प्रबंधन डैशबोर्ड।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Tone = "success" | "warning" | "destructive" | "info";
const dot: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
};
const txt: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
};
const pill: Record<Tone, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

const constituencies: { name: string; pct: number; tone: Tone }[] = [
  { name: "35 - बीना (अ.जा.)", pct: 96, tone: "success" },
  { name: "36 - खुरई", pct: 88, tone: "warning" },
  { name: "37 - सुरखी", pct: 100, tone: "success" },
  { name: "38 - देवरी", pct: 76, tone: "destructive" },
  { name: "39 - रहली", pct: 82, tone: "destructive" },
  { name: "40 - नरयावली (अ.जा.)", pct: 91, tone: "success" },
  { name: "41 - सागर शहर", pct: 95, tone: "destructive" },
  { name: "42 - बांडा", pct: 78, tone: "success" },
];

// Stylised (non-geographic) shapes for the overview map
const regions: { label: string; d: string; fill: string; lx: number; ly: number; tone: Tone; mx: number; my: number }[] = [
  { label: "36 - खुरई", d: "M60,40 L150,15 L190,70 L170,130 L95,140 L50,95 Z", fill: "fill-success/20", lx: 115, ly: 60, tone: "success", mx: 140, my: 95 },
  { label: "35 - बीना", d: "M280,30 L360,10 L400,80 L370,150 L290,140 L270,80 Z", fill: "fill-warning/25", lx: 330, ly: 90, tone: "warning", mx: 335, my: 120 },
  { label: "37 - सुरखी", d: "M170,130 L190,70 L270,80 L290,140 L260,190 L180,190 Z", fill: "fill-info/20", lx: 225, ly: 145, tone: "success", mx: 220, my: 115 },
  { label: "38 - देवरी", d: "M95,140 L170,130 L180,190 L160,250 L100,240 L80,190 Z", fill: "fill-destructive/20", lx: 140, ly: 205, tone: "destructive", mx: 140, my: 170 },
  { label: "41 - सागर शहर", d: "M180,190 L260,190 L280,230 L230,250 L170,240 Z", fill: "fill-saffron/20", lx: 245, ly: 220, tone: "success", mx: 260, my: 180 },
  { label: "39 - रहली", d: "M260,190 L290,140 L370,150 L380,220 L320,260 L280,230 Z", fill: "fill-success/25", lx: 335, ly: 205, tone: "success", mx: 340, my: 175 },
  { label: "40 - नरयावली", d: "M100,240 L160,250 L230,250 L240,280 L150,300 Z", fill: "fill-primary/15", lx: 175, ly: 268, tone: "success", mx: 200, my: 290 },
  { label: "42 - बांडा", d: "M230,250 L280,230 L320,260 L340,310 L260,330 L240,280 Z", fill: "fill-info/15", lx: 285, ly: 290, tone: "success", mx: 285, my: 315 },
];

const tasks: { name: string; pr: string; prTone: Tone; date: string; st: string; stTone: Tone }[] = [
  { name: "कमजोर बूथों की विशेष बैठक", pr: "उच्च", prTone: "destructive", date: "25 सित 2025", st: "समय सीमा पार", stTone: "destructive" },
  { name: "BLA सत्यापन अभियान - फेज 2", pr: "उच्च", prTone: "destructive", date: "30 सित 2025", st: "प्रगति पर", stTone: "info" },
  { name: "नए कार्यकर्ताओं का सत्यापन", pr: "मध्यम", prTone: "warning", date: "05 अक्टू 2025", st: "लंबित", stTone: "warning" },
  { name: "मंडल स्तर समीक्षा बैठक", pr: "मध्यम", prTone: "warning", date: "10 अक्टू 2025", st: "निर्धारित", stTone: "info" },
  { name: "सदस्यता अभियान - पंचायत स्तर", pr: "निम्न", prTone: "success", date: "20 अक्टू 2025", st: "लंबित", stTone: "warning" },
];

const eventsList = [
  { name: "जिला कार्यकर्ता सम्मेलन", d: "18 सित 2025", t: "11:00 पूर्वाह्न", place: "सागर टाउन हॉल" },
  { name: "मंडल पदाधिकारी बैठक", d: "22 सित 2025", t: "04:00 अपराह्न", place: "सुरखी मंडल कार्यालय" },
  { name: "BLA प्रशिक्षण कार्यक्रम", d: "28 सित 2025", t: "11:00 पूर्वाह्न", place: "खुरई सामुदायिक भवन" },
  { name: "पंचायत स्तर बैठक", d: "03 अक्टू 2025", t: "04:00 अपराह्न", place: "देवरी जनपद भवन" },
  { name: "सदस्यता अभियान शुभारंभ", d: "10 अक्टू 2025", t: "11:00 पूर्वाह्न", place: "जिला कांग्रेस कार्यालय" },
];

const logs: { text: string; when: string; tone: Tone }[] = [
  { text: "राहुल तिवारी ने बूथ #178 का सत्यापन पूरा किया", when: "2 घंटे पहले", tone: "success" },
  { text: "सीमा पटेल को BLA के रूप में नियुक्त किया गया", when: "4 घंटे पहले", tone: "success" },
  { text: "सुरखी मंडल बैठक की तिथि अपडेट की गई", when: "6 घंटे पहले", tone: "warning" },
  { text: "20 नए कार्यकर्ताओं की सूची आयात की गई", when: "1 दिन पहले", tone: "success" },
  { text: "बांडा क्षेत्र का कवरेज रिपोर्ट जेनरेट किया गया", when: "1 दिन पहले", tone: "info" },
  { text: "देवरी के 5 बूथों का ग्रेड C से B में अपडेट", when: "2 दिन पहले", tone: "warning" },
  { text: "जन समस्या #124 का निवारण किया गया", when: "2 दिन पहले", tone: "success" },
];

function Sparkbars({ tone }: { tone: Tone }) {
  const h = [30, 45, 35, 60, 50, 75, 65, 90, 100];
  return (
    <div className="flex items-end gap-[3px] h-10">
      {h.map((v, i) => (
        <span key={i} className={`w-1.5 rounded-sm ${dot[tone]}`} style={{ height: `${v}%`, opacity: 0.45 + i * 0.06 }} />
      ))}
    </div>
  );
}

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-xl border border-border bg-card shadow-sm ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon, title, sub, tone = "success" }: { icon: typeof Home; title: string; sub?: string; tone?: Tone }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`size-5 ${txt[tone]}`} />
      <h2 className="font-serif text-lg font-bold text-primary">{title}</h2>
      {sub && <span className="text-sm text-primary/80">{sub}</span>}
    </div>
  );
}

function ViewAll({ to }: { to: string }) {
  return (
    <Link to={to} className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted">
      सभी देखें <ChevronRight className="size-3.5" />
    </Link>
  );
}

function Dashboard() {
  const { currentRole } = useRbac();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selected, setSelected] = useState("37 - सुरखी");

  const handleDownload = () => {
    const csv = ["सदस्य क्रमांक,नाम,पद,ब्लॉक,फ़ोन,स्थिति"]
      .concat(members.map((m) => `${m.id},${m.name},${m.designation},${m.unit},${m.phone},${m.status}`))
      .join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `sangathan_report_${currentRole.id}.csv`;
    a.click();
  };

  const grades = [
    { g: "Grade A", n: "1,024", p: "47%", note: "कांग्रेस मजबूत बूथ", tone: "success" as Tone, icon: ShieldCheck },
    { g: "Grade B", n: "842", p: "39%", note: "सुधार की संभावना", tone: "info" as Tone, icon: UserRound },
    { g: "Grade C", n: "249", p: "11%", note: "विशेष प्रयास आवश्यक", tone: "warning" as Tone, icon: ClipboardCheck },
    { g: "Grade D", n: "68", p: "3%", note: "अतिरिक्त ध्यान आवश्यक", tone: "destructive" as Tone, icon: CalendarClock },
  ];

  // donut: 47 / 39 / 11 / 3
  const segs: { v: number; cls: string }[] = [
    { v: 47, cls: "stroke-success" },
    { v: 39, cls: "stroke-info" },
    { v: 11, cls: "stroke-warning" },
    { v: 3, cls: "stroke-destructive" },
  ];
  const C = 2 * Math.PI * 40;
  let acc = 0;

  return (
    <div className="p-4 md:p-5 space-y-5 bg-slate-50/70 min-h-screen">
      {/* Title row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Home className="size-3.5 text-primary" /> डैशबोर्ड
          </div>
          <div className="flex items-center gap-4 flex-wrap mt-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#0B1736] tracking-tight">संगठन समीक्षा डैशबोर्ड</h1>
            <span className="flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-[11px] text-success">
              <span className="size-2 rounded-full bg-success" /> अद्यतन: 28 अगस्त 2025, 12:45 PM
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            जिला कांग्रेस कमेटी सागर - चुनावी तैयारी, संगठन सुदृढ़ीकरण और बूथ स्तरीय प्रबंधन
          </p>
          <span className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">
            डैशबोर्ड के आंकड़े नमूना डेटा हैं
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2 text-left shadow-sm hover:bg-slate-50">
            <CalendarDays className="size-5 text-primary" />
            <span className="leading-tight">
              <span className="block text-[11px] text-muted-foreground">अवधि</span>
              <span className="text-sm font-semibold">01 जन 2025 - 31 दिस 2025</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            disabled={!currentRole.capabilities.canAddMember}
            className="flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#162a63] disabled:opacity-50"
          >
            <Plus className="size-4" /> नया कार्यकर्ता जोड़ें
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-[#0B1736] hover:bg-slate-50"
          >
            <Download className="size-4" /> रिपोर्ट डाउनलोड
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4 flex gap-4">
          <span className="size-12 shrink-0 rounded-xl bg-success/15 grid place-items-center">
            <Users className="size-6 text-success" />
          </span>
          <div className="flex-1">
            <div className="flex justify-between font-semibold">
              सक्रिय कार्यकर्ता <X className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold">450</span>
              <span className="flex items-center gap-0.5 rounded bg-success/15 px-1.5 py-0.5 text-xs font-semibold text-success">
                <ArrowUp className="size-3" />
                +12.4%
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted-foreground">पिछले माह: 400</span>
              <Sparkbars tone="success" />
            </div>
          </div>
        </Card>

        <Card className="p-4 flex gap-4">
          <span className="size-12 shrink-0 rounded-xl bg-info/15 grid place-items-center">
            <UserCog className="size-6 text-info" />
          </span>
          <div className="flex-1">
            <div className="font-semibold">BLA नियुक्ति (मतदान केंद्र)</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">(2,183 / 2,183 बूथ)</div>
                <div className="text-xs text-muted-foreground mt-1">लक्ष्य: 100% | शेष: 0 बूथ</div>
              </div>
              <svg viewBox="0 0 40 40" className="size-16">
                <circle cx="20" cy="20" r="15" className="fill-none stroke-success" strokeWidth="5" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex gap-4">
          <span className="size-12 shrink-0 rounded-xl bg-destructive/10 grid place-items-center">
            <MapPin className="size-6 text-destructive" />
          </span>
          <div className="flex-1">
            <div className="font-semibold">क्षेत्रीय अधिकार क्षेत्र (SCOPE)</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold">{currentRole.scopeBadge}</span>
              <MapIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">
              {currentRole.boothsCount.toLocaleString("en-IN")} मतदान केंद्र • {currentRole.votersCount.toLocaleString("en-IN")} मतदाता
            </div>
            <div className="text-right mt-1">
              <span className="rounded bg-warning/20 px-2 py-0.5 text-xs font-medium">{currentRole.levelLabel}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex gap-4">
          <span className="size-12 shrink-0 rounded-xl bg-destructive/10 grid place-items-center">
            <SquareCheck className="size-6 text-destructive" />
          </span>
          <div className="flex-1">
            <div className="flex justify-between font-semibold">
              लंबित कार्य (CADRE TASKS) <ClipboardList className="size-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">3</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm font-semibold text-destructive">
                  समय सीमा पार: <span className="rounded bg-destructive/15 px-1">1</span>
                </div>
                <div className="text-sm text-muted-foreground">कुल सक्रिय कार्य: 18</div>
              </div>
              <Sparkbars tone="destructive" />
            </div>
          </div>
        </Card>
      </div>

      {/* Map + health */}
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="xl:col-span-1">
          <SagarPollMap />
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-5 text-info" />
              <h2 className="font-serif text-lg font-bold text-primary">मतदान केंद्र स्वास्थ्य वर्गीकरण</h2>
              <Info className="size-4 text-muted-foreground" />
            </div>
            <button type="button" className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs">
              ग्रेड अनुसार <ChevronDown className="size-3.5" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-6 flex-wrap">
            <div className="relative size-44">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                {segs.map((s) => {
                  const len = (s.v / 100) * C;
                  const el = (
                    <circle
                      key={s.cls}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      className={s.cls}
                      strokeWidth="16"
                      strokeDasharray={`${len} ${C - len}`}
                      strokeDashoffset={-acc}
                    />
                  );
                  acc += len;
                  return el;
                })}
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">2,183</div>
                  <div className="text-xs text-muted-foreground">मतदान केंद्र</div>
                </div>
              </div>
            </div>
            <ul className="flex-1 space-y-3 text-sm min-w-40">
              {[
                ["मजबूत", "1,024", "47%", "success"],
                ["सामान्य", "842", "39%", "info"],
                ["कमजोर", "249", "11%", "warning"],
                ["अति: कमजोर", "68", "3%", "destructive"],
              ].map(([l, n, p, t]) => (
                <li key={l} className="flex items-center gap-3">
                  <span className={`size-3 rounded-full ${dot[t as Tone]}`} />
                  <span className="flex-1 text-muted-foreground">{l}</span>
                  <span className="font-bold">{n}</span> <span className="text-muted-foreground">({p})</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {grades.map((g) => (
              <div key={g.g} className={`rounded-lg border border-border p-2 text-center ${pill[g.tone].split(" ")[0]}`}>
                <div className="flex items-center justify-center gap-1 text-xs font-semibold">
                  <g.icon className={`size-4 ${txt[g.tone]}`} /> {g.g}
                </div>
                <div className="text-xl font-bold mt-1">{g.n}</div>
                <div className={`mx-auto mt-1 w-fit rounded px-2 text-[11px] font-semibold ${pill[g.tone]}`}>{g.p}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{g.note}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <SectionTitle icon={SquareCheck} title="महत्वपूर्ण कार्य" sub="(Critical Tasks)" />
            <ViewAll to="/tasks" />
          </div>
          <table className="mt-3 w-full text-xs">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="p-1.5 font-semibold">कार्य का नाम</th>
                <th className="p-1.5 font-semibold">प्राथमिकता</th>
                <th className="p-1.5 font-semibold">अंतिम तिथि</th>
                <th className="p-1.5 font-semibold">स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((t) => (
                <tr key={t.name}>
                  <td className="p-1.5">› {t.name}</td>
                  <td className="p-1.5"><span className={`rounded px-2 py-0.5 ${pill[t.prTone]}`}>{t.pr}</span></td>
                  <td className="p-1.5 text-muted-foreground whitespace-nowrap">{t.date}</td>
                  <td className="p-1.5"><span className={`rounded px-2 py-0.5 whitespace-nowrap ${pill[t.stTone]}`}>{t.st}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <SectionTitle icon={CalendarDays} title="आगामी आयोजन" sub="(Events)" tone="info" />
            <ViewAll to="/events" />
          </div>
          <table className="mt-3 w-full text-xs">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="p-1.5 font-semibold">आयोजन का नाम</th>
                <th className="p-1.5 font-semibold">तिथि एवं समय</th>
                <th className="p-1.5 font-semibold">स्थान</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {eventsList.map((e) => (
                <tr key={e.name}>
                  <td className="p-1.5">{e.name}</td>
                  <td className="p-1.5 text-muted-foreground leading-tight">{e.d}<br />{e.t}</td>
                  <td className="p-1.5 text-muted-foreground">{e.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <SectionTitle icon={Clock} title="हाल की गतिविधियाँ" sub="(Field Cadre Log)" tone="info" />
            <ViewAll to="/war-room" />
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {logs.map((l) => (
              <li key={l.text} className="flex items-center gap-2">
                <span className={`size-2.5 shrink-0 rounded-full ${dot[l.tone]}`} />
                <span className="flex-1">{l.text}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{l.when}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <RegisterMemberModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(_d, m) => {
          setIsAddOpen(false);
          alert(`नया कार्यकर्ता ${m.name} सफलतापूर्वक पंजीकृत किया गया।`);
        }}
      />
    </div>
  );
}
