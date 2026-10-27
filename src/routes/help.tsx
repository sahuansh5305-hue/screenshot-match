import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MessageCircle, ChevronDown, Search } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "सहायता केंद्र – जिला कांग्रेस कमेटी सागर" },
      { name: "description", content: "संगठन प्रबंधन प्रणाली के उपयोग से जुड़े सामान्य प्रश्न, संपर्क और मार्गदर्शन।" },
      { property: "og:title", content: "सहायता केंद्र – जिला कांग्रेस कमेटी सागर" },
      { property: "og:description", content: "सामान्य प्रश्न, संपर्क और उपयोग मार्गदर्शिका।" },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  { q: "नया कार्यकर्ता कैसे जोड़ें?", a: "ऊपर दिए गए 'नया कार्यकर्ता' बटन पर क्लिक करें, विवरण भरें और सहेजें। आपके पद के अनुसार ही यह विकल्प दिखाई देता है।" },
  { q: "मुझे केवल अपने बूथ का डेटा क्यों दिखता है?", a: "हर पदाधिकारी को उसके क्षेत्र के अनुसार डेटा दिखता है। जिला अध्यक्ष पूरा जिला देख सकते हैं, बूथ संयोजक केवल अपना बूथ।" },
  { q: "कार्य कैसे सौंपें और उसकी प्रगति देखें?", a: "'कार्य एवं ट्रैकिंग' पन्ने पर जाकर नया कार्य बनाएँ, जिम्मेदार व्यक्ति चुनें और समय सीमा तय करें। प्रगति वहीं दिखती रहेगी।" },
  { q: "जन समस्या कैसे दर्ज करें?", a: "'जन समस्याएं' पन्ने पर शिकायत का विवरण, क्षेत्र और श्रेणी भरें। समस्या का स्तर बदलने पर संबंधित पदाधिकारी को सूचना मिलती है।" },
  { q: "सभी कार्यकर्ताओं को संदेश कैसे भेजें?", a: "'संदेश एवं अभियान' पन्ने पर संदेश लिखें, समूह चुनें और भेजें। यह सुविधा केवल अधिकृत पदाधिकारियों के लिए है।" },
  { q: "रिपोर्ट कैसे डाउनलोड करें?", a: "'रिपोर्ट एवं विश्लेषण' पन्ने पर ब्लॉक या बूथ चुनकर रिपोर्ट देखें और डाउनलोड करें।" },
];

function HelpPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const list = faqs.filter((f) => (f.q + f.a).includes(q.trim()));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">सहायता केंद्र</h1>
        <p className="text-sm text-muted-foreground mt-1">प्रणाली के उपयोग में कोई कठिनाई हो तो यहाँ उत्तर खोजें या हमसे संपर्क करें।</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Phone, t: "हेल्पलाइन", d: "+91 75820 00000", s: "सुबह 10 से शाम 6 बजे तक" },
          { icon: MessageCircle, t: "व्हाट्सऐप सहायता", d: "+91 75820 00001", s: "24 घंटे संदेश भेजें" },
          { icon: Mail, t: "ईमेल", d: "sahayta@dccsagar.in", s: "2 दिन में उत्तर" },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border bg-card p-4">
            <c.icon className="size-5 text-primary" />
            <div className="mt-2 font-semibold text-foreground">{c.t}</div>
            <div className="text-sm text-foreground break-all">{c.d}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.s}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">सामान्य प्रश्न</h2>
        <label className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 mb-4">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="प्रश्न खोजें…" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="divide-y">
          {list.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-foreground">
                {f.q}
                <ChevronDown className={`size-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="pb-3 text-sm text-muted-foreground">{f.a}</p>}
            </div>
          ))}
          {list.length === 0 && <p className="py-3 text-sm text-muted-foreground">कोई प्रश्न नहीं मिला।</p>}
        </div>
      </div>
    </div>
  );
}
