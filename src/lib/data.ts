export const blocks = ["सागर", "बंडा", "खुरई", "बीना", "रहली", "देवरी", "नरयावली", "सुरखी"];

export type Member = {
  id: string;
  name: string;
  designation: string;
  unit: string;
  phone: string;
  status: "सक्रिय" | "निष्क्रिय" | "लंबित";
  joined: string;
  vidhanSabha?: string;
  block?: string;
  mandal?: string;
  boothNo?: string;
  boothName?: string;
  isBla?: boolean;
};

// Booth 101 members (Matches screenshot: 5 / 35 scoped members for Bhanu Pratap Singh Dangi)
const booth101Members: Member[] = [
  {
    id: "कजपा-सागर-1001",
    name: "भानु प्रताप सिंह दांगी",
    designation: "बूथ संयोजक / बीएलए-1",
    unit: "सुरखी",
    block: "राहतगढ़",
    mandal: "सीहोरा",
    boothNo: "101",
    boothName: "शासकीय उ.मा. विद्यालय सीहोरा कक्ष 1",
    phone: "+91 98260 12345",
    status: "सक्रिय",
    joined: "2021-03-15",
    vidhanSabha: "037-सुरखी",
    isBla: true,
  },
  {
    id: "कजपा-सागर-1002",
    name: "रामचरण लोधी",
    designation: "बीएलए-2 / मतदान केंद्र एजेंट",
    unit: "सुरखी",
    block: "राहतगढ़",
    mandal: "सीहोरा",
    boothNo: "101",
    boothName: "शासकीय उ.मा. विद्यालय सीहोरा कक्ष 1",
    phone: "+91 94251 78910",
    status: "सक्रिय",
    joined: "2022-06-10",
    vidhanSabha: "037-सुरखी",
    isBla: true,
  },
  {
    id: "कजपा-सागर-1003",
    name: "राजेश विश्वकर्मा",
    designation: "बूथ सचिव / युवा समन्वयक",
    unit: "सुरखी",
    block: "राहतगढ़",
    mandal: "सीहोरा",
    boothNo: "101",
    boothName: "शासकीय उ.मा. विद्यालय सीहोरा कक्ष 1",
    phone: "+91 99772 34567",
    status: "सक्रिय",
    joined: "2023-01-20",
    vidhanSabha: "037-सुरखी",
  },
  {
    id: "कजपा-सागर-1004",
    name: "श्रीमती मीना बाई अहिरवार",
    designation: "महिला बूथ प्रभारी",
    unit: "सुरखी",
    block: "राहतगढ़",
    mandal: "सीहोरा",
    boothNo: "101",
    boothName: "शासकीय उ.मा. विद्यालय सीहोरा कक्ष 1",
    phone: "+91 91314 56789",
    status: "सक्रिय",
    joined: "2022-11-05",
    vidhanSabha: "037-सुरखी",
  },
  {
    id: "कजपा-सागर-1005",
    name: "संतोष यादव",
    designation: "मतदाता पर्ची वितरण प्रभारी",
    unit: "सुरखी",
    block: "राहतगढ़",
    mandal: "सीहोरा",
    boothNo: "101",
    boothName: "शासकीय उ.मा. विद्यालय सीहोरा कक्ष 1",
    phone: "+91 97523 98765",
    status: "सक्रिय",
    joined: "2023-04-12",
    vidhanSabha: "037-सुरखी",
  },
];

const first = ["रमेश", "सुनीता", "अनिल", "कविता", "महेश", "पूजा", "राजेंद्र", "सीमा", "विकास", "नेहा", "दिनेश", "आशा", "सुरेश", "मीना", "अरविंद", "रेखा"];
const last = ["पटेल", "यादव", "तिवारी", "शर्मा", "अहिरवार", "लोधी", "जैन", "राजपूत"];
const desig = ["ब्लॉक अध्यक्ष", "मंडल सचिव", "बूथ समन्वयक", "युवा प्रकोष्ठ अध्यक्ष", "महिला मोर्चा अध्यक्ष", "बूथ समन्वयक", "कार्यकर्ता", "कार्यकर्ता"];
const statuses: Member["status"][] = ["सक्रिय", "सक्रिय", "सक्रिय", "लंबित", "निष्क्रिय"];

const remainingMembers: Member[] = Array.from({ length: 30 }, (_, i) => ({
  id: `कजपा-सागर-${String(1006 + i)}`,
  name: `${first[i % 16]} ${last[(i * 3) % 8]}`,
  designation: desig[i % 8] ?? "कार्यकर्ता",
  unit: blocks[i % 8] ?? "सागर",
  block: blocks[i % 8] ?? "सागर",
  mandal: i % 2 === 0 ? "सीहोरा" : "बरखेड़ी",
  vidhanSabha: i % 3 === 0 ? "037-सुरखी" : "041-सागर",
  boothNo: String(102 + (i % 25)),
  phone: `+91 9${String(800000000 + i * 7919).slice(0, 9)}`,
  status: statuses[i % 5] ?? "सक्रिय",
  joined: `20${19 + (i % 7)}-0${1 + (i % 9)}-1${i % 9}`,
}));

export const members: Member[] = [...booth101Members, ...remainingMembers];

export const tasks = [
  { id: 1, title: "बूथ समिति सत्यापन – वार्ड 12 (बूथ 101)", unit: "सुरखी", block: "राहतगढ़", owner: "भानु प्रताप सिंह दांगी", due: "2026-10-25", status: "समय सीमा पार", priority: "उच्च" },
  { id: 2, title: "घर-घर मतदाता संपर्क अभियान", unit: "सुरखी", block: "राहतगढ़", owner: "राजेश विश्वकर्मा", due: "2026-10-28", status: "प्रगति में", priority: "उच्च" },
  { id: 3, title: "मासिक ब्लॉक प्रतिवेदन जमा करें", unit: "खुरई", block: "खुरई", owner: "अनिल यादव", due: "2026-10-30", status: "करना है", priority: "मध्यम" },
  { id: 4, title: "सदस्यों की संपर्क जानकारी अद्यतन करें", unit: "रहली", block: "रहली", owner: "सीमा राजपूत", due: "2026-11-02", status: "करना है", priority: "निम्न" },
  { id: 5, title: "युवा प्रकोष्ठ की बैठक आयोजित करें", unit: "देवरी", block: "देवरी", owner: "विकास लोधी", due: "2026-10-22", status: "पूर्ण", priority: "मध्यम" },
  { id: 6, title: "मंडल सचिव नियुक्त करें", unit: "बंडा", block: "बंडा", owner: "महेश तिवारी", due: "2026-11-05", status: "प्रगति में", priority: "उच्च" },
  { id: 7, title: "बूथ स्तर की प्रतिक्रिया एकत्र करें", unit: "सुरखी", block: "राहतगढ़", owner: "रामचरण लोधी", due: "2026-11-08", status: "करना है", priority: "मध्यम" },
];

export const events = [
  { id: 1, title: "जिला कार्यकर्ता सम्मेलन", date: "2026-10-27", place: "सागर, नगर सभागार", expected: 850, rsvp: 612 },
  { id: 2, title: "महिला मोर्चा संवाद", date: "2026-10-31", place: "बीना सामुदायिक केंद्र", expected: 300, rsvp: 214 },
  { id: 3, title: "ब्लॉक अध्यक्षों की समीक्षा बैठक", date: "2026-11-03", place: "जिला कार्यालय, सागर", expected: 12, rsvp: 11 },
  { id: 4, title: "युवा रैली – खुरई", date: "2026-11-09", place: "खुरई खेल मैदान", expected: 1200, rsvp: 540 },
];

export const activity = [
  "भानु प्रताप सिंह दांगी ने बूथ 101 में 24 मतदाताओं का भौतिक सत्यापन पूर्ण किया",
  "रामचरण लोधी ने सीहोरा मतदान केंद्र 101 के बीएलए-2 फॉर्म जमा किए",
  "कविता शर्मा ने बीना में 48 घरों से संपर्क दर्ज किया",
  "नई सदस्य पूजा अहिरवार रहली ब्लॉक में जोड़ी गईं",
  "बूथ 101 (शासकीय उ.मा. विद्यालय सीहोरा) का भौतिक सत्यापन स्वीकृत हुआ",
  "विकास लोधी ने पूर्ण किया ‘युवा प्रकोष्ठ की बैठक आयोजित करें’",
  "महेश तिवारी ने बंडा की मंडल सूची अद्यतन की",
];

export const blockStats = blocks.map((b, i) => ({
  block: b, booths: 180 + i * 23, covered: 120 + ((i * 37) % 90), members: 1400 + i * 311,
}));

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${value}T00:00:00+05:30`));
}
