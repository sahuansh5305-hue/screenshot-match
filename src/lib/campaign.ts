import { blocks } from "./data";

export type Sentiment = "समर्थक" | "तटस्थ" | "विरोधी";

export type Booth = {
  id: number;
  block: string;
  name: string;
  pollingStation: string;
  coordinator: string;
  coordinatorPhone: string;
  voters: number;
  support: number;
  neutral: number;
  oppose: number;
  visited: number;
  turnout: number;
  keyIssue: string;
};

const stationLocations: Record<string, string[]> = {
  "सागर": ["शासकीय उत्कृष्ट उ.मा. विद्यालय, सागर", "कन्या प्राथमिक शाला, मकरोनिया", "नगर निगम वाचनालय, कटरा", "प्राथमिक शाला, गोपालगंज", "सामुदायिक भवन, सिविल लाइन्स", "शासकीय माध्यमिक शाला, सदर"],
  "बंडा": ["शासकीय बालक उ.मा.वि., बंडा", "कन्या प्राथमिक शाला, दलपतपुर", "प्राथमिक शाला, बरा", "ग्राम पंचायत भवन, शाहगढ़", "माध्यमिक शाला, उल्दन", "प्राथमिक शाला, बहरोल"],
  "खुरई": ["शासकीय कन्या उ.मा.वि., खुरई", "प्राथमिक शाला, बरोदिया", "रेलवे कॉलोनी स्कूल, खुरई", "ग्राम पंचायत भवन, धनौरा", "माध्यमिक शाला, खिमलासा", "प्राथमिक शाला, जरुआखेड़ा"],
  "बीना": ["शासकीय पीजी कॉलेज परिसर, बीना", "कन्या माध्यमिक शाला, भानगढ़", "प्राथमिक शाला, आगासौद", "रिफाइनरी कॉलोनी केंद्र, बीना", "शासकीय उ.मा.वि., मण्डी", "प्राथमिक शाला, सिरचौंपी"],
  "रहली": ["शासकीय मॉडल स्कूल, रहली", "प्राथमिक शाला, गढ़ाकोटा", "कन्या शाला, पटना बुजुर्ग", "ग्राम पंचायत, टड़ा", "शासकीय माध्यमिक शाला, छानबीला", "प्राथमिक शाला, रानगिर"],
  "देवरी": ["शासकीय उत्कृष्ट विद्यालय, देवरी", "प्राथमिक शाला, केसली", "कन्या शाला, गौरझामर", "सामुदायिक भवन, सहजपुर", "माध्यमिक शाला, महाराजपुर", "प्राथमिक शाला, बिलहरा"],
  "नरयावली": ["शासकीय उ.मा.वि., नरयावली", "प्राथमिक शाला, जरुआखेड़ा", "कन्या माध्यमिक शाला, ईशरवारा", "ग्राम पंचायत, कर्रापुर", "माध्यमिक शाला, सीहोरा", "प्राथमिक शाला, चितौरा"],
  "सुरखी": ["शासकीय उ.मा.वि., सुरखी", "प्राथमिक शाला, जैसीनगर", "कन्या शाला, राहतगढ़", "ग्राम पंचायत भवन, बिलहरा", "माध्यमिक शाला, बेरखेड़ी", "प्राथमिक शाला, मसवासी"]
};

const coordinators = [
  { name: "रमेश पटेल", phone: "+91 98261 44321" },
  { name: "सुनीता अहिरवार", phone: "+91 94251 78912" },
  { name: "महेश तिवारी", phone: "+91 98932 65410" },
  { name: "कविता शर्मा", phone: "+91 97554 11234" },
  { name: "विकास लोधी", phone: "+91 99770 98765" },
  { name: "सीमा राजपूत", phone: "+91 98273 34567" },
  { name: "अनिल यादव", phone: "+91 94065 56789" },
  { name: "नेहा जैन", phone: "+91 98930 43210" }
];

export const issues = ["पानी", "सड़क", "बिजली", "रोजगार", "स्वास्थ्य", "शिक्षा", "किसान", "महँगाई"];

export const booths: Booth[] = blocks.flatMap((block, bi) =>
  Array.from({ length: 12 }, (_, i) => {
    const seed = (bi * 12 + i) * 37;
    const support = 28 + (seed % 33);
    const oppose = 18 + ((seed * 7) % 30);
    const neutral = Math.max(5, 100 - support - oppose);
    const stations = (stationLocations[block] || stationLocations["सागर"])!;
    const station = stations[i % stations.length];
    const coord = coordinators[(bi + i) % coordinators.length]!;
    const keyIssue = issues[(bi * 3 + i) % issues.length]!;

    return {
      id: 100 + bi * 12 + i,
      block,
      name: `बूथ ${100 + bi * 12 + i}`,
      pollingStation: `${station} (कक्ष क्र. ${(i % 3) + 1})`,
      coordinator: coord.name,
      coordinatorPhone: coord.phone,
      voters: 650 + ((seed * 13) % 600),
      support,
      neutral,
      oppose: 100 - support - neutral,
      visited: 30 + ((seed * 11) % 70),
      turnout: 20 + ((seed * 3) % 45),
      keyIssue,
    };
  }),
);

export function boothLean(b: Booth): "मजबूत" | "कांटे की टक्कर" | "कमजोर" {
  const gap = b.support - b.oppose;
  if (gap >= 15) return "मजबूत";
  if (gap <= -5) return "कमजोर";
  return "कांटे की टक्कर";
}

export const issuesList = issues;

export type Visit = { id: number; household: string; booth: string; issue: string; sentiment: Sentiment; by: string; time: string };
export const initialVisits: Visit[] = [
  { id: 1, household: "रामलाल पटेल परिवार", booth: "बूथ 114", issue: "पानी", sentiment: "समर्थक", by: "कविता शर्मा", time: "आज, सुबह 10:20" },
  { id: 2, household: "श्यामा यादव परिवार", booth: "बूथ 131", issue: "रोजगार", sentiment: "तटस्थ", by: "अनिल यादव", time: "आज, सुबह 11:05" },
  { id: 3, household: "गोविंद जैन परिवार", booth: "बूथ 145", issue: "सड़क", sentiment: "विरोधी", by: "सीमा राजपूत", time: "आज, दोपहर 12:40" },
  { id: 4, household: "मोहन अहिरवार परिवार", booth: "बूथ 102", issue: "किसान", sentiment: "समर्थक", by: "रमेश पटेल", time: "आज, दोपहर 1:15" },
];

export const issueCounts: Record<string, number> = { पानी: 412, सड़क: 356, बिजली: 221, रोजगार: 489, स्वास्थ्य: 198, शिक्षा: 143, किसान: 377, महँगाई: 302 };

export type Grievance = { id: number; title: string; citizen: string; block: string; issue: string; status: "नई" | "कार्यवाही में" | "हल"; days: number };
export const initialGrievances: Grievance[] = [
  { id: 501, title: "वार्ड 7 में हैंडपंप खराब", citizen: "सुखराम लोधी", block: "रहली", issue: "पानी", status: "नई", days: 1 },
  { id: 502, title: "गाँव की सड़क पर गड्ढे", citizen: "प्रेमवती अहिरवार", block: "बंडा", issue: "सड़क", status: "कार्यवाही में", days: 6 },
  { id: 503, title: "वृद्धावस्था पेंशन रुकी", citizen: "हरिप्रसाद तिवारी", block: "खुरई", issue: "स्वास्थ्य", status: "कार्यवाही में", days: 11 },
  { id: 504, title: "ट्रांसफॉर्मर जला, 3 दिन से बिजली नहीं", citizen: "रामकली पटेल", block: "बीना", issue: "बिजली", status: "नई", days: 3 },
  { id: 505, title: "फसल बीमा राशि नहीं मिली", citizen: "भगवानदास यादव", block: "देवरी", issue: "किसान", status: "हल", days: 15 },
  { id: 506, title: "विद्यालय में शिक्षक की कमी", citizen: "सरिता जैन", block: "सुरखी", issue: "शिक्षा", status: "नई", days: 2 },
];

export const membershipTargets = blocks.map((block, i) => ({ block, target: 3000 + i * 250, enrolled: 1400 + i * 311 }));

export const segments = ["सभी सदस्य", "ब्लॉक अध्यक्ष", "बूथ समन्वयक", "युवा प्रकोष्ठ", "महिला मोर्चा", "कमजोर बूथ के कार्यकर्ता"];
export const segmentSize: Record<string, number> = { "सभी सदस्य": 24376, "ब्लॉक अध्यक्ष": 8, "बूथ समन्वयक": 1712, "युवा प्रकोष्ठ": 3240, "महिला मोर्चा": 2980, "कमजोर बूथ के कार्यकर्ता": 640 };
