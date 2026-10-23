export const blocks = ["सागर", "बंडा", "खुरई", "बीना", "रहली", "देवरी", "नरयावली", "सुरखी"];

export type Member = {
  id: string; name: string; designation: string; unit: string; phone: string;
  status: "सक्रिय" | "निष्क्रिय" | "लंबित"; joined: string;
};

const first = ["रमेश", "सुनीता", "अनिल", "कविता", "महेश", "पूजा", "राजेंद्र", "सीमा", "विकास", "नेहा", "दिनेश", "आशा", "सुरेश", "मीना", "अरविंद", "रेखा"];
const last = ["पटेल", "यादव", "तिवारी", "शर्मा", "अहिरवार", "लोधी", "जैन", "राजपूत"];
const desig = ["ब्लॉक अध्यक्ष", "मंडल सचिव", "बूथ समन्वयक", "युवा प्रकोष्ठ अध्यक्ष", "महिला मोर्चा अध्यक्ष", "बूथ समन्वयक", "कार्यकर्ता", "कार्यकर्ता"];
const statuses: Member["status"][] = ["सक्रिय", "सक्रिय", "सक्रिय", "लंबित", "निष्क्रिय"];

export const members: Member[] = Array.from({ length: 32 }, (_, i) => ({
  id: `कजपा-सागर-${String(1001 + i)}`,
  name: `${first[i % 16]} ${last[(i * 3) % 8]}`,
  designation: desig[i % 8] ?? "कार्यकर्ता",
  unit: blocks[i % 8] ?? "सागर",
  phone: `+91 9${String(800000000 + i * 7919).slice(0, 9)}`,
  status: statuses[i % 5] ?? "सक्रिय",
  joined: `20${19 + (i % 7)}-0${1 + (i % 9)}-1${i % 9}`,
}));

export const tasks = [
  { id: 1, title: "बूथ समिति सत्यापन – वार्ड 12", unit: "सागर", owner: "रमेश पटेल", due: "2026-10-25", status: "समय सीमा पार", priority: "उच्च" },
  { id: 2, title: "घर-घर मतदाता संपर्क अभियान", unit: "बीना", owner: "कविता शर्मा", due: "2026-10-28", status: "प्रगति में", priority: "उच्च" },
  { id: 3, title: "मासिक ब्लॉक प्रतिवेदन जमा करें", unit: "खुरई", owner: "अनिल यादव", due: "2026-10-30", status: "करना है", priority: "मध्यम" },
  { id: 4, title: "सदस्यों की संपर्क जानकारी अद्यतन करें", unit: "रहली", owner: "सीमा राजपूत", due: "2026-11-02", status: "करना है", priority: "निम्न" },
  { id: 5, title: "युवा प्रकोष्ठ की बैठक आयोजित करें", unit: "देवरी", owner: "विकास लोधी", due: "2026-10-22", status: "पूर्ण", priority: "मध्यम" },
  { id: 6, title: "मंडल सचिव नियुक्त करें", unit: "बंडा", owner: "महेश तिवारी", due: "2026-11-05", status: "प्रगति में", priority: "उच्च" },
  { id: 7, title: "बूथ स्तर की प्रतिक्रिया एकत्र करें", unit: "सुरखी", owner: "नेहा जैन", due: "2026-11-08", status: "करना है", priority: "मध्यम" },
];

export const events = [
  { id: 1, title: "जिला कार्यकर्ता सम्मेलन", date: "2026-10-27", place: "सागर, नगर सभागार", expected: 850, rsvp: 612 },
  { id: 2, title: "महिला मोर्चा संवाद", date: "2026-10-31", place: "बीना सामुदायिक केंद्र", expected: 300, rsvp: 214 },
  { id: 3, title: "ब्लॉक अध्यक्षs Review", date: "2026-11-03", place: "जिला कार्यालय, सागर", expected: 12, rsvp: 11 },
  { id: 4, title: "युवा रैली – खुरई", date: "2026-11-09", place: "खुरई खेल मैदान", expected: 1200, rsvp: 540 },
];

export const activity = [
  "कविता शर्मा ने बीना में 48 घरों से संपर्क दर्ज किया",
  "नई सदस्य पूजा अहिरवार रहली ब्लॉक में जोड़ी गईं",
  "बूथ 114 (सागर) का सत्यापन स्वीकृत हुआ",
  "विकास लोधी ने पूर्ण किया ‘युवा प्रकोष्ठ की बैठक आयोजित करें’",
  "महेश तिवारी ने बंडा की मंडल सूची अद्यतन की",
];

export const blockStats = blocks.map((b, i) => ({
  block: b, booths: 180 + i * 23, covered: 120 + ((i * 37) % 90), members: 1400 + i * 311,
}));

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${value}T00:00:00+05:30`));
}
