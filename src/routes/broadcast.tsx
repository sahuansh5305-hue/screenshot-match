import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BellRing, Check, ChevronDown, Clock3, Mail, MessageCircle, Send, Smartphone, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { segments, segmentSize } from "@/lib/campaign";

export const Route = createFileRoute("/broadcast")({
  head: () => ({
    meta: [
      { title: "संदेश एवं अभियान केंद्र – संगठन सेतु" },
      { name: "description", content: "संगठनात्मक संदेश तैयार करें, लक्ष्य समूह चुनें और प्रसारण का पूर्वावलोकन देखें।" },
    ],
  }),
  component: BroadcastCenter,
});

const roles = [
  "सभी बीएलए (BLA-1 & BLA-2)",
  "मंडलम अध्यक्ष (Mandalam Adhyaksh)",
  "ब्लॉक एवं नगर अध्यक्ष (Block Presidents)",
  "सेक्टर एवं पंचायत प्रभारी",
  "जिला पदाधिकारी (DCC Office Bearers)",
  "सक्रिय कार्यकर्ता (Active Cadre)",
];
const constituencies = ["सभी सागर जिला", "35 - बीना", "36 - खुरई", "37 - सुरखी", "38 - देवरी", "39 - रहली", "40 - नरयावली", "41 - सागर", "42 - बंडा"];
const templates = [
  { title: "बैठक आमंत्रण", body: "जय कांग्रेस! सादर जय जोहार 🙏\n\nआदरणीय साथी {{member_name}} जी ({{designation}}),\n\n{{vidhan_sabha}} विधानसभा की महत्वपूर्ण संगठनात्मक बैठक आयोजित की जा रही है।\n\n📍 स्थान: {{venue}}\n📅 दिनांक एवं समय: {{meeting_time}}\n\nआपकी उपस्थिति सादर अपेक्षित है।" },
  { title: "मतदाता सूची पुनरीक्षण", body: "नमस्कार {{member_name}} जी,\n\n{{vidhan_sabha}} विधानसभा में मतदाता सूची पुनरीक्षण कार्य में सहयोग करें। अपने क्षेत्र के बूथों पर सत्यापन की स्थिति की जानकारी साझा करें।\n\nधन्यवाद।" },
  { title: "जनसंपर्क अभियान", body: "जय कांग्रेस! 🙏\n\n{{mandalam}} मंडलम के सभी साथियों से निवेदन है कि आगामी जनसंपर्क अभियान में सक्रिय भागीदारी करें।\n\nस्थान: {{venue}}\nसमय: {{meeting_time}}" },
  { title: "बूथ बैठक सूचना", body: "सूचना: {{booth_no}} बूथ की बैठक {{meeting_time}} को {{venue}} पर आयोजित होगी।\n\nसभी संबंधित साथियों से समय पर उपस्थित होने का अनुरोध है।" },
];
const variableTokens = ["{{member_name}}", "{{designation}}", "{{vidhan_sabha}}", "{{mandalam}}", "{{booth_no}}", "{{meeting_time}}", "{{venue}}"];
const channels = [
  { id: "whatsapp", label: "WhatsApp ब्रॉडकास्ट", icon: MessageCircle },
  { id: "sms", label: "टेक्स्ट एसएमएस (Bulk SMS)", icon: Send },
  { id: "email", label: "ईमेल / बैठक नोटिस", icon: Mail },
] as const;
type Channel = (typeof channels)[number]["id"];
type Campaign = { id: number; title: string; channel: string; target: number; date: string; status: string; body: string };

function BroadcastCenter() {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [area, setArea] = useState(constituencies[0]!);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([roles[0]!, roles[1]!]);
  const [wing, setWing] = useState("सभी विंग");
  const [title, setTitle] = useState("सुरखी विधानसभा - बूथ बीएलए समीक्षा एवं बैठक बुलावा");
  const [meetingTime, setMeetingTime] = useState("26 अक्टूबर 2026, शाम 5:00 बजे");
  const [venue, setVenue] = useState("राहतगढ़ विश्राम गृह, सागर मार्ग");
  const [message, setMessage] = useState(templates[0]!.body);
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState<Campaign[]>([
    { id: 1, title: "मतदाता सूची पुनरीक्षण एवं बीएलए सक्रियता", channel: "WhatsApp", target: 40, date: "आज, 10:45 AM", status: "मसौदा", body: "साथियों, कृपया अपने बूथ की मतदाता सूची पुनरीक्षण स्थिति साझा करें।" },
    { id: 2, title: "संगठनात्मक बैठक आमंत्रण", channel: "ईमेल", target: 32, date: "24 अक्टूबर 2026", status: "मसौदा", body: "सभी पदाधिकारियों से बैठक में उपस्थित रहने का अनुरोध है।" },
  ]);

  const audience = useMemo(() => {
    if (selectedRoles.some((role) => role.includes("सभी बीएलए"))) return area === "सभी सागर जिला" ? 842 : 295;
    const base = selectedRoles.reduce((total, role) => total + (role.includes("मंडलम") ? 18 : role.includes("ब्लॉक") ? 8 : role.includes("जिला") ? 12 : role.includes("सेक्टर") ? 24 : 40), 0);
    const geographicFactor = area === "सभी सागर जिला" ? 1 : 0.36;
    const wingFactor = wing === "सभी विंग" ? 1 : 0.65;
    return Math.max(0, Math.round(base * geographicFactor * wingFactor));
  }, [area, selectedRoles, wing]);

  const toggleRole = (role: string) => setSelectedRoles((current) => current.includes(role) ? current.filter((item) => item !== role) : [...current, role]);
  const chooseTemplate = (body: string) => {
    setMessage(body);
    setNotice("टेम्पलेट संदेश में जोड़ दिया गया है।");
    window.setTimeout(() => setNotice(""), 2800);
  };
  const insertVariable = (token: string) => {
    setMessage((current) => `${current}${current.endsWith(" ") || current.endsWith("\n") ? "" : " "}${token}`);
  };
  const saveDraft = () => {
    if (!title.trim() || !message.trim()) return;
    setHistory((current) => [{
      id: Date.now(), title, channel: channels.find((item) => item.id === channel)?.label ?? "WhatsApp",
      target: audience, date: "अभी", status: "मसौदा", body: message,
    }, ...current]);
    setNotice("मसौदा स्थानीय सूची में सुरक्षित किया गया। इसे भेजा नहीं गया है। वास्तविक प्रसारण के लिए चैनल सेवा जोड़नी होगी।");
  };

  return (
    <>
      <PageHeader title="राजनीतिक संदेश एवं अभियान केंद्र" subtitle="संदेश बनाएँ, लक्षित कार्यकर्ता समूह चुनें और प्रसारण से पहले पूर्वावलोकन करें" />
      <div className="p-4 md:p-6 space-y-5 max-w-[1500px] mx-auto">
        <section className="panel p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b">
            <div>
              <h2 className="text-xl font-serif font-semibold text-primary flex items-center gap-2"><Send className="w-5 h-5" /> राजनीतिक संदेश एवं अभियान केंद्र (Political Campaign Center)</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-3xl">WhatsApp, Bulk SMS और ईमेल के लिए लक्षित संदेश तैयार करें। यह स्क्रीन अभी पूर्वावलोकन और मसौदा बनाती है, वास्तविक संदेश नहीं भेजती।</p>
            </div>
            <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs px-3 py-2 max-w-sm">
              <strong>प्रसारण सेवा कनेक्ट नहीं है</strong><br />अभी सहेजे गए संदेश केवल इस स्क्रीन की स्थानीय मसौदा सूची में दिखेंगे।
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4" role="tablist" aria-label="प्रसारण चैनल">
            {channels.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} role="tab" aria-selected={channel === item.id} onClick={() => setChannel(item.id)} className={`flex items-center justify-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${channel === item.id ? "bg-slate-900 text-white border-slate-900" : "bg-card hover:bg-muted"}`}><Icon className="w-4 h-4" />{item.label}</button>;
            })}
          </div>
        </section>

        {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 text-blue-900 px-4 py-3 text-sm flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0" />{notice}</div>}

        <div className="grid xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] gap-5 items-start">
          <div className="space-y-5">
            <section className="panel p-5 space-y-4">
              <div className="rounded-xl bg-gradient-to-r from-blue-950 to-slate-800 p-4 text-white flex items-center justify-between gap-4">
                <div><div className="text-xs text-orange-300 font-semibold">चयनित दर्शक (DYNAMIC TARGET AUDIENCE)</div><div className="text-2xl font-bold mt-1">{audience.toLocaleString("en-IN")} पदाधिकारी एवं कार्यकर्ता</div></div>
                <div className="hidden sm:flex rounded-lg bg-white/10 px-3 py-2 text-xs">लाइव फ़िल्टर<br />सक्रिय</div>
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2"><span className="text-primary">1.</span> भौगोलिक दायरा (Geographical Scope)</label>
                <div className="relative"><select className="w-full appearance-none border rounded-lg px-3 py-2.5 pr-9 text-sm bg-card" value={area} onChange={(e) => setArea(e.target.value)}>{constituencies.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="w-4 h-4 absolute right-3 top-3 text-muted-foreground pointer-events-none" /></div>
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2"><span className="text-orange-600">2.</span> पद अनुसार लक्ष्य निर्धारण (TARGET BY ROLES)</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {roles.map((role) => <label key={role} className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs cursor-pointer transition-colors ${selectedRoles.includes(role) ? "border-blue-400 bg-blue-50 text-slate-900" : "hover:bg-muted/60"}`}><input type="checkbox" checked={selectedRoles.includes(role)} onChange={() => toggleRole(role)} className="mt-0.5 accent-blue-700" /><span>{role}</span></label>)}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold flex items-center gap-2 mb-2"><span className="text-primary">3.</span> संगठन मोर्चा / विंग (FILTER BY WING)</label>
                <select className="w-full border rounded-lg px-3 py-2.5 text-sm bg-card" value={wing} onChange={(e) => setWing(e.target.value)}>{["सभी विंग", "मुख्य संगठन", "युवा कांग्रेस", "महिला कांग्रेस", "एनएसयूआई", "सेवा दल", "किसान कांग्रेस", "आईटी एवं सोशल मीडिया सेल"].map((item) => <option key={item}>{item}</option>)}</select>
              </div>
            </section>

            <section className="panel p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-orange-500" /> पूर्व-निर्मित संदेश टेम्पलेट (PRE-CONFIGURED TEMPLATES)</h3>
              <div className="grid sm:grid-cols-2 gap-2">{templates.map((template) => <button type="button" key={template.title} onClick={() => chooseTemplate(template.body)} className="border rounded-lg px-3 py-2.5 text-left hover:border-primary hover:bg-primary/5 transition-colors"><span className="block text-sm font-medium">{template.title}</span><span className="block text-xs text-muted-foreground mt-1 line-clamp-2">{template.body.replaceAll("\n", " ")}</span></button>)}</div>
              <div><label className="block text-sm font-semibold mb-1.5">अभियान शीर्षक (CAMPAIGN TITLE) *</label><input className="w-full border rounded-lg px-3 py-2.5 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="संदेश अभियान का नाम" /></div>
              <div className="grid sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1.5">दिनांक एवं समय (Meeting Time)</label><input className="w-full border rounded-lg px-3 py-2.5 text-sm" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} /></div><div><label className="block text-sm font-medium mb-1.5">स्थान (Venue)</label><input className="w-full border rounded-lg px-3 py-2.5 text-sm" value={venue} onChange={(e) => setVenue(e.target.value)} /></div></div>
              <div>
                <div className="flex items-center justify-between mb-2"><label className="text-sm font-semibold">संदेश मुख्य भाग (MESSAGE BODY) *</label><span className="text-xs text-muted-foreground">{message.length} अक्षर</span></div>
                <div className="flex flex-wrap gap-1.5 mb-2">{variableTokens.map((token) => <button type="button" key={token} onClick={() => insertVariable(token)} className="border border-blue-200 bg-blue-50 text-blue-800 rounded-md px-2 py-1 text-[11px] hover:bg-blue-100">{token}</button>)}</div>
                <textarea className="w-full min-h-48 border rounded-lg p-3 text-sm leading-6 resize-y" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="अपना संदेश लिखें..." />
                <p className="text-xs text-muted-foreground mt-1">गतिशील फ़ील्ड प्रसारण के समय प्रत्येक सदस्य के रिकॉर्ड से बदले जाने के लिए हैं।</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t pt-4"><p className="text-xs text-muted-foreground">लक्ष्य: <strong>{audience.toLocaleString("en-IN")} प्राप्तकर्ता</strong> · {channels.find((item) => item.id === channel)?.label} · मसौदा</p><button type="button" onClick={saveDraft} disabled={!title.trim() || !message.trim() || selectedRoles.length === 0} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"><Send className="w-4 h-4" />मसौदा सुरक्षित करें</button></div>
            </section>
          </div>

          <div className="space-y-5 xl:sticky xl:top-4">
            <section className="panel p-5">
              <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">लाइव संदेश पूर्वावलोकन</h3><span className="text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-100 rounded-full px-2 py-1">डायनामिक फ़ील्ड</span></div>
              <div className="mx-auto max-w-[340px] rounded-[2rem] border-[8px] border-slate-800 bg-slate-800 p-1 shadow-xl">
                <div className="bg-[#efe9df] rounded-[1.5rem] overflow-hidden min-h-[480px] flex flex-col">
                  <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">✋</div><div className="min-w-0"><div className="text-xs font-semibold">सागर जिला कांग्रेस कमेटी</div><div className="text-[10px] opacity-80">आधिकारिक चैनल · पूर्वावलोकन</div></div><Smartphone className="w-4 h-4 ml-auto" /></div>
                  <div className="p-3 flex-1 bg-[radial-gradient(#d9d1c5_0.7px,transparent_0.7px)] [background-size:12px_12px]"><div className="text-center text-[10px] bg-amber-100/90 rounded-md px-2 py-1.5 text-amber-900 mb-3">यह एक संदेश पूर्वावलोकन है। अभी प्रसारित नहीं हुआ।</div><div className="bg-white rounded-lg shadow-sm p-3 text-xs leading-5 whitespace-pre-wrap break-words">{message.replaceAll("{{member_name}}", "राजेंद्र सिंह").replaceAll("{{designation}}", "मंडलम अध्यक्ष").replaceAll("{{vidhan_sabha}}", area).replaceAll("{{mandalam}}", "सीहोरा").replaceAll("{{booth_no}}", "101").replaceAll("{{meeting_time}}", meetingTime || "बैठक समय").replaceAll("{{venue}}", venue || "बैठक स्थान")}<div className="text-[9px] text-right text-muted-foreground mt-2">अभी · ✓✓</div></div></div>
                  <div className="bg-white px-3 py-2 flex gap-2 items-center text-[10px] text-muted-foreground"><span className="rounded-full border px-3 py-1.5 flex-1">संदेश लिखें…</span><span className="text-emerald-700">●</span></div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center flex items-center justify-center gap-1"><BellRing className="w-3.5 h-3.5" />प्राप्तकर्ता संख्या चयनित फ़िल्टर के अनुसार अनुमानित है</div>
            </section>
            <section className="panel p-5">
              <div className="flex justify-between items-center border-b pb-3 mb-1"><div><h3 className="font-semibold">अभियान प्रसारण इतिहास</h3><p className="text-xs text-muted-foreground mt-0.5">सहेजे गए मसौदे और पूर्वावलोकन</p></div><span className="text-xs bg-muted rounded-full px-2 py-1">कुल {history.length} अभियान</span></div>
              <div className="divide-y">{history.map((item) => <article key={item.id} className="py-3"><div className="flex items-start justify-between gap-2"><div className="font-medium text-sm">{item.title}</div><span className="text-[10px] whitespace-nowrap rounded-full bg-amber-100 text-amber-900 px-2 py-0.5">{item.status}</span></div><p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.body}</p><div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-2"><span>{item.channel}</span><span>·</span><span>{item.target.toLocaleString("en-IN")} लक्ष्य</span><span>·</span><span className="inline-flex items-center gap-1"><Clock3 className="w-3 h-3" />{item.date}</span></div></article>)}</div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
