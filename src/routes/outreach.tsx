import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, btn } from "@/components/AppShell";
import { membershipTargets, segments, segmentSize } from "@/lib/campaign";

export const Route = createFileRoute("/outreach")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "सदस्यता और संदेश – कांग्रेस जनता पार्टी सागर" },
      { name: "description", content: "सदस्यता अभियान की प्रगति, नया पंजीयन और कार्यकर्ताओं को संदेश प्रसारण।" },
      { property: "og:title", content: "सदस्यता और संदेश – कांग्रेस जनता पार्टी सागर" },
      { property: "og:description", content: "सदस्यता अभियान की प्रगति, नया पंजीयन और कार्यकर्ताओं को संदेश प्रसारण।" },
    ],
  }),
  component: Outreach,
});

const input = "border bg-card px-3 py-2 text-sm rounded-sm w-full";

function Outreach() {
  const [targets, setTargets] = useState(membershipTargets);
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [m, setM] = useState({ name: "", phone: "", block: membershipTargets[0]!.block, otp: "" });
  const [seg, setSeg] = useState(segments[0]!);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState<{ seg: string; msg: string; n: number }[]>([
    { seg: "बूथ समन्वयक", msg: "27 अक्टूबर के जिला कार्यकर्ता सम्मेलन में अपने बूथ से कम से कम 5 कार्यकर्ता लाएँ।", n: 1712 },
  ]);

  const total = targets.reduce((a, t) => a + t.enrolled, 0);
  const goal = targets.reduce((a, t) => a + t.target, 0);

  const enroll = () => {
    setTargets(targets.map((t) => t.block === m.block ? { ...t, enrolled: t.enrolled + 1 } : t));
    setStep("done");
  };

  return (
    <>
      <PageHeader title="सदस्यता अभियान और संदेश प्रसारण" subtitle={`अभियान प्रगति: ${total.toLocaleString("en-IN")} / ${goal.toLocaleString("en-IN")} सदस्य`} />
      <div className="p-6 grid xl:grid-cols-2 gap-6">
        <section className="panel p-5">
          <h2 className="text-base mb-4">ब्लॉकवार लक्ष्य</h2>
          <div className="space-y-3">
            {targets.map((t) => {
              const p = Math.round((t.enrolled / t.target) * 100);
              return (
                <div key={t.block}>
                  <div className="flex justify-between text-sm mb-1"><span>{t.block}</span><span className="text-muted-foreground">{t.enrolled.toLocaleString("en-IN")} / {t.target.toLocaleString("en-IN")} · {p}%</span></div>
                  <div className="h-2.5 bg-muted rounded-sm"><div className={`h-2.5 rounded-sm transition-all ${p >= 75 ? "bg-success" : p >= 55 ? "bg-accent" : "bg-destructive"}`} style={{ width: `${Math.min(p, 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel p-5 space-y-3">
          <h2 className="text-base">नया सदस्य पंजीयन (मोबाइल सत्यापन सहित)</h2>
          {step === "form" && (
            <>
              <input className={input} placeholder="पूरा नाम" value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} />
              <input className={input} placeholder="मोबाइल नंबर (10 अंक)" inputMode="numeric" maxLength={10} value={m.phone} onChange={(e) => setM({ ...m, phone: e.target.value.replace(/\D/g, "") })} />
              <select className={input} value={m.block} onChange={(e) => setM({ ...m, block: e.target.value })}>{targets.map((t) => <option key={t.block}>{t.block}</option>)}</select>
              <button className={btn} disabled={!m.name.trim() || m.phone.length !== 10} onClick={() => setStep("otp")}>सत्यापन कोड भेजें</button>
            </>
          )}
          {step === "otp" && (
            <>
              <p className="text-sm">{m.phone} पर 4 अंकों का कोड भेजा गया। नमूने के लिए <b>1234</b> लिखें।</p>
              <input className={input} placeholder="सत्यापन कोड" maxLength={4} value={m.otp} onChange={(e) => setM({ ...m, otp: e.target.value })} />
              {m.otp.length === 4 && m.otp !== "1234" && <p className="text-xs text-destructive">कोड गलत है।</p>}
              <button className={btn} disabled={m.otp !== "1234"} onClick={enroll}>सत्यापित करें और जोड़ें</button>
            </>
          )}
          {step === "done" && (
            <div className="space-y-3">
              <p className="text-sm text-success font-medium">✓ {m.name} को {m.block} ब्लॉक में सदस्य के रूप में जोड़ा गया। लक्ष्य पट्टी अद्यतन हो गई।</p>
              <button className={btn} onClick={() => { setM({ name: "", phone: "", block: m.block, otp: "" }); setStep("form"); }}>एक और सदस्य जोड़ें</button>
            </div>
          )}
        </section>

        <section className="panel p-5 space-y-3 xl:col-span-2">
          <h2 className="text-base">कार्यकर्ताओं को संदेश भेजें</h2>
          <div className="flex flex-wrap gap-2">{segments.map((s) => <button key={s} onClick={() => setSeg(s)} className={`px-3 py-1 text-xs rounded-sm border ${seg === s ? "bg-primary text-primary-foreground" : "bg-card"}`}>{s} ({segmentSize[s]?.toLocaleString("en-IN")})</button>)}</div>
          <textarea className={`${input} min-h-24`} placeholder="संदेश लिखें…" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{msg.length} अक्षर · प्राप्तकर्ता: {segmentSize[seg]?.toLocaleString("en-IN")}</span>
            <button className={btn} disabled={!msg.trim()} onClick={() => { setSent([{ seg, msg, n: segmentSize[seg] ?? 0 }, ...sent]); setMsg(""); }}>संदेश भेजें</button>
          </div>
          <ul className="divide-y border-t text-sm">
            {sent.map((s, i) => <li key={i} className="py-2.5"><div>{s.msg}</div><div className="text-xs text-muted-foreground">{s.seg} · {s.n.toLocaleString("en-IN")} लोगों को भेजा गया</div></li>)}
          </ul>
        </section>
      </div>
    </>
  );
}
