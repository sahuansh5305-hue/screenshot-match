import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, btn } from "@/components/AppShell";
import {
  CalendarDays,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  CheckCircle2,
  List,
  Sparkles,
  X,
  Share2,
  Megaphone,
  UserCheck,
  Building,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "आयोजन कैलेंडर – संगठन प्रबंधन" },
      { name: "description", content: "सागर जिले के सभी राजनीतिक कार्यक्रम, रैलियां, बैठकें व कैलेंडर।" },
      { property: "og:title", content: "आयोजन कैलेंडर – संगठन प्रबंधन" },
      { property: "og:description", content: "सागर जिले के सभी राजनीतिक कार्यक्रम, रैलियां, बैठकें व कैलेंडर।" },
    ],
  }),
  component: EventsPage,
});

export type EventCategory = "rally" | "meeting" | "review" | "training" | "padayatra";

export interface EventItem {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  place: string;
  category: EventCategory;
  constituency: string;
  expected: number;
  rsvp: number;
  organizer: string;
  description?: string;
}

const CATEGORY_MAP: Record<
  EventCategory,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  rally: {
    label: "रैली व जनसभा",
    bg: "bg-orange-500/10 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-300 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  meeting: {
    label: "कार्यकर्ता सम्मेलन",
    bg: "bg-blue-500/10 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  review: {
    label: "समीक्षा संवाद",
    bg: "bg-emerald-500/10 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  training: {
    label: "प्रशिक्षण व BLA",
    bg: "bg-purple-500/10 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  padayatra: {
    label: "जन-सम्पर्क पदयात्रा",
    bg: "bg-rose-500/10 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
  },
};

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 1,
    title: "जिला कार्यकर्ता सम्मेलन 2026",
    date: "2026-10-27",
    time: "11:00 पूर्वाह्न",
    place: "सागर, नगर सभागार (टाउन हॉल)",
    category: "meeting",
    constituency: "041 - सागर",
    expected: 850,
    rsvp: 612,
    organizer: "डॉ. आनंद अहिरवार (जिलाध्यक्ष)",
    description: "आगामी रणनीति, बूथ सुदृढ़ीकरण और मंडल पदाधिकारियों का मार्गदर्शन।",
  },
  {
    id: 2,
    title: "BLA-2 बूथ सत्यापन कार्यशाला",
    date: "2026-10-29",
    time: "02:00 अपराह्न",
    place: "रहली ब्लॉक कांग्रेस कार्यालय",
    category: "training",
    constituency: "039 - रहली",
    expected: 160,
    rsvp: 142,
    organizer: "सुरेश चंदेल (ब्लॉक अध्यक्ष)",
    description: "मतदाता सूची पुनरीक्षण व प्रत्येक बूथ पर BLA-2 की नियुक्ति सत्यापन।",
  },
  {
    id: 3,
    title: "महिला मोर्चा संवाद एवं सम्मान समारोह",
    date: "2026-10-31",
    time: "12:00 दोपहर",
    place: "बीना सामुदायिक केंद्र, खुरई रोड",
    category: "review",
    constituency: "035 - बीना",
    expected: 320,
    rsvp: 245,
    organizer: "श्रीमती सुनीता यादव",
    description: "महिला कार्यकर्ताओं का सशक्तिकरण व बूथ स्तर पर 33% भागीदारी पर चर्चा।",
  },
  {
    id: 4,
    title: "ब्लॉक अध्यक्षों की संगठनात्मक समीक्षा बैठक",
    date: "2026-11-03",
    time: "03:30 अपराह्न",
    place: "जिला कांग्रेस कार्यालय, तीनबत्ती सागर",
    category: "review",
    constituency: "सागर जिला (समस्त)",
    expected: 30,
    rsvp: 28,
    organizer: "संगठन मंत्री एवं जिला प्रभारी",
    description: "सभी 11 ब्लॉक अध्यक्षों द्वारा अपने कार्यक्षेत्र की प्रगति रिपोर्ट प्रस्तुत करना।",
  },
  {
    id: 5,
    title: "सुरखी विधानसभा जन-सम्पर्क पदयात्रा",
    date: "2026-11-06",
    time: "09:00 पूर्वाह्न",
    place: "राहतगढ़ मुख्य बाजार से सीहोरा",
    category: "padayatra",
    constituency: "037 - सुरखी",
    expected: 650,
    rsvp: 480,
    organizer: "नीरज शर्मा (विधानसभा अध्यक्ष)",
    description: "गाँव-गाँव जनसंपर्क, चौपाल बैठकें व किसानों की समस्याओं का संकलन।",
  },
  {
    id: 6,
    title: "विशाल युवा मोर्चा रैली एवं रोजगार संवाद",
    date: "2026-11-09",
    time: "01:00 अपराह्न",
    place: "खुरई खेल मैदान, स्टेशन रोड",
    category: "rally",
    constituency: "036 - खुरई",
    expected: 1500,
    rsvp: 920,
    organizer: "अमित कटारे (युवा कांग्रेस)",
    description: "युवा बेरोजगारी के विरोध में विशाल पदयात्रा एवं जनसभा।",
  },
  {
    id: 7,
    title: "नेहरू जयंती विचार संगोष्ठी एवं छात्र संवाद",
    date: "2026-11-14",
    time: "11:30 पूर्वाह्न",
    place: "पद्माकर सभागार, सिविल लाइन्स, सागर",
    category: "meeting",
    constituency: "041 - सागर",
    expected: 400,
    rsvp: 310,
    organizer: "विचार विभाग, सागर",
    description: "लोकतांत्रिक मूल्यों व आधुनिक भारत के निर्माण पर प्रबुद्ध वर्ग संवाद।",
  },
  {
    id: 8,
    title: "देवरी किसान अधिकार महापंचायत",
    date: "2026-11-20",
    time: "12:00 दोपहर",
    place: "देवरी कृषि उपज मंडी प्रांगण",
    category: "rally",
    constituency: "038 - देवरी",
    expected: 1800,
    rsvp: 1150,
    organizer: "किसान कांग्रेस समिति",
    description: "फसल बीमा, खाद-बीज उपलब्धता एवं समर्थन मूल्य पर विशाल किसान सम्मेलन।",
  },
];

const HINDI_MONTHS = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

const WEEKDAYS = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"];

function EventsPage() {
  const [eventList, setEventList] = useState<EventItem[]>(INITIAL_EVENTS);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 9 = October (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-27");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    date: "2026-10-27",
    time: "11:00 पूर्वाह्न",
    place: "",
    category: "meeting" as EventCategory,
    constituency: "041 - सागर",
    expected: 250,
    rsvp: 50,
    organizer: "जिला कांग्रेस कमेटी",
    description: "",
  });

  // Calendar Calculations
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Monday-based index: Sunday = 6, Monday = 0, ..., Saturday = 5
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    const days: Array<{
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, prevDay);
      const m = String(prevDate.getMonth() + 1).padStart(2, "0");
      const d = String(prevDay).padStart(2, "0");
      days.push({
        dateStr: `${prevDate.getFullYear()}-${m}-${d}`,
        dayNum: prevDay,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const m = String(currentMonth + 1).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      const dateStr = `${currentYear}-${m}-${d}`;
      const isToday = currentYear === 2026 && currentMonth === 9 && day === 27;
      days.push({
        dateStr,
        dayNum: day,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month filler days to complete grid of rows of 7
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let nextDay = 1; nextDay <= remainingDays; nextDay++) {
        const nextDate = new Date(currentYear, currentMonth + 1, nextDay);
        const m = String(nextDate.getMonth() + 1).padStart(2, "0");
        const d = String(nextDay).padStart(2, "0");
        days.push({
          dateStr: `${nextDate.getFullYear()}-${m}-${d}`,
          dayNum: nextDay,
          isCurrentMonth: false,
          isToday: false,
        });
      }
    }

    return days;
  }, [currentYear, currentMonth]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventList.filter((e) => {
      if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
      return true;
    });
  }, [eventList, selectedCategory]);

  // Events grouped by date string
  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    filteredEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date]!.push(e);
    });
    return map;
  }, [filteredEvents]);

  // Selected Date Events
  const selectedDateEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.date === selectedDate);
  }, [filteredEvents, selectedDate]);

  // Overall Stats
  const stats = useMemo(() => {
    const thisMonthEvents = eventList.filter((e) => {
      const parts = e.date.split("-");
      return Number(parts[0]) === currentYear && Number(parts[1]) === currentMonth + 1;
    });
    const totalExpected = thisMonthEvents.reduce((acc, e) => acc + e.expected, 0);
    const totalRsvp = thisMonthEvents.reduce((acc, e) => acc + e.rsvp, 0);
    return {
      count: thisMonthEvents.length,
      expected: totalExpected,
      rsvp: totalRsvp,
      pct: totalExpected ? Math.round((totalRsvp / totalExpected) * 100) : 0,
    };
  }, [eventList, currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleTodayJump = () => {
    setCurrentYear(2026);
    setCurrentMonth(9); // October
    setSelectedDate("2026-10-27");
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.place.trim()) return;

    const newEvent: EventItem = {
      id: Date.now(),
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time.trim() || "11:00 पूर्वाह्न",
      place: formData.place.trim(),
      category: formData.category,
      constituency: formData.constituency.trim() || "सागर जिला",
      expected: Number(formData.expected) || 100,
      rsvp: Number(formData.rsvp) || 0,
      organizer: formData.organizer.trim() || "जिला कांग्रेस कमेटी",
      description: formData.description.trim(),
    };

    setEventList([newEvent, ...eventList]);
    setSelectedDate(newEvent.date);

    // If month changed, navigate to it
    const [y, m] = newEvent.date.split("-");
    if (y && m) {
      setCurrentYear(Number(y));
      setCurrentMonth(Number(m) - 1);
    }

    setIsModalOpen(false);
    setNotification(`नया आयोजन "${newEvent.title}" सफलतापूर्वक कैलेंडर में जोड़ा गया!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const inputClass =
    "border border-border bg-card px-3 py-2 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground";

  return (
    <div className="pb-12">
      <PageHeader
        title="आयोजन कैलेंडर एवं कार्यक्रम"
        subtitle="सागर जिले के समस्त राजनीतिक कार्यक्रम, रैलियां, कार्यकर्ता बैठकें एवं अभियान"
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-card p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "calendar"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarIcon className="size-3.5" /> कैलेंडर दृश्य
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" /> सूची दृश्य
              </button>
            </div>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, date: selectedDate }));
                setIsModalOpen(true);
              }}
              className={btn}
            >
              <Plus className="size-4 mr-1" /> नया आयोजन
            </button>
          </div>
        }
      />

      {notification && (
        <div className="mx-6 mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm px-4 py-3 rounded-lg flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" /> {notification}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-muted-foreground hover:text-foreground font-bold ml-2 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* QUICK SUMMARY KPI CARDS */}
      <div className="p-4 sm:p-6 pb-2 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">मासिक कुल कार्यक्रम</span>
            <CalendarDays className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-serif text-foreground">{stats.count}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {HINDI_MONTHS[currentMonth]} {currentYear} में निर्धारित
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">कुल अपेक्षित उपस्थिति</span>
            <Users className="size-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-foreground">
            {stats.expected.toLocaleString("hi-IN")}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">कार्यकर्ता व नागरिक भागीदारी</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">पुष्ट उपस्थिति (RSVP)</span>
            <UserCheck className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-foreground">
            {stats.rsvp.toLocaleString("hi-IN")}{" "}
            <span className="text-xs font-normal text-muted-foreground">({stats.pct}%)</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.pct}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">सक्रिय विधानसभाएं</span>
            <Building className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-foreground">8 / 8</div>
          <p className="text-[11px] text-muted-foreground mt-1">सागर, सुरखी, बीना, खुरई, रहली आदि</p>
        </div>
      </div>

      {/* CATEGORY FILTER BAR */}
      <div className="px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-muted-foreground flex items-center gap-1 shrink-0 font-medium mr-1">
          <Filter className="size-3.5" /> फ़िल्टर:
        </span>
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border hover:bg-muted text-foreground"
          }`}
        >
          सभी कार्यक्रम ({eventList.length})
        </button>
        {(Object.keys(CATEGORY_MAP) as EventCategory[]).map((cat) => {
          const cfg = CATEGORY_MAP[cat];
          const count = eventList.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? `${cfg.bg} ${cfg.text} border ${cfg.border} font-bold shadow-xs`
                  : "bg-card border border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              <span className={`size-2 rounded-full ${cfg.dot}`} />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* MAIN VIEW: CALENDAR OR LIST */}
      <div className="p-4 sm:p-6 pt-3">
        {viewMode === "calendar" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* LEFT 2 COLUMNS: INTERACTIVE 7-DAY CALENDAR GRID */}
            <div className="xl:col-span-2 rounded-xl border border-border bg-card shadow-xs overflow-hidden">
              {/* CALENDAR CONTROLS HEADER */}
              <div className="p-4 border-b border-border flex items-center justify-between gap-3 flex-wrap bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="font-serif text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                    <CalendarDays className="size-5 text-primary" />
                    {HINDI_MONTHS[currentMonth]} {currentYear}
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border font-medium">
                    {stats.count} कार्यक्रम
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleTodayJump}
                    className="px-2.5 py-1 text-xs font-semibold rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors"
                  >
                    आज
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors"
                    title="पिछला महीना"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors"
                    title="अगला महीना"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* WEEKDAY LABELS */}
              <div className="grid grid-cols-7 border-b border-border text-center text-xs font-bold text-muted-foreground bg-muted/40 py-2.5">
                {WEEKDAYS.map((w, idx) => (
                  <div key={w} className={idx >= 5 ? "text-orange-600 dark:text-orange-400" : ""}>
                    {w}
                  </div>
                ))}
              </div>

              {/* CALENDAR DAYS GRID */}
              <div className="grid grid-cols-7 divide-x divide-y divide-border/60 bg-border/20">
                {calendarDays.map((cd) => {
                  const dayEvents = eventsByDate[cd.dateStr] || [];
                  const isSelected = selectedDate === cd.dateStr;

                  return (
                    <div
                      key={cd.dateStr}
                      onClick={() => setSelectedDate(cd.dateStr)}
                      className={`min-h-[92px] sm:min-h-[105px] p-1.5 transition-all cursor-pointer relative flex flex-col justify-between ${
                        !cd.isCurrentMonth
                          ? "bg-muted/30 text-muted-foreground/40 opacity-50"
                          : "bg-card hover:bg-muted/40"
                      } ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
                    >
                      {/* TOP: DAY NUMBER & BADGES */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-semibold rounded-full size-6 grid place-items-center ${
                            cd.isToday
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : isSelected
                              ? "bg-primary/20 text-primary font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {cd.dayNum}
                        </span>

                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-bold text-primary px-1.5 py-0.2 rounded-full bg-primary/10">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* MIDDLE: EVENT CHIPS INSIDE CALENDAR CELL */}
                      <div className="space-y-1 my-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const cat = CATEGORY_MAP[ev.category];
                          return (
                            <div
                              key={ev.id}
                              title={`${ev.title} (${ev.time} · ${ev.place})`}
                              className={`truncate text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded font-medium border flex items-center gap-1 ${cat.bg} ${cat.text} ${cat.border}`}
                            >
                              <span className={`size-1.5 rounded-full shrink-0 ${cat.dot}`} />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-muted-foreground px-1 font-semibold">
                            +{dayEvents.length - 2} और...
                          </div>
                        )}
                      </div>

                      {/* BOTTOM: SMALL INDICATOR BAR IF HAS EVENTS */}
                      <div className="h-0.5">
                        {dayEvents.length > 0 && (
                          <div className="h-0.5 w-full bg-primary/40 rounded-full" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT 1 COLUMN: SELECTED DAY EVENT DETAILS / AGENDA */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      चयनित तिथि का विवरण
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif text-foreground mt-0.5">
                      {new Date(`${selectedDate}T00:00:00+05:30`).toLocaleString("hi-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Asia/Kolkata",
                      })}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, date: selectedDate }));
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="इस तिथि पर नया आयोजन जोड़ें"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>

                {/* EVENTS ON THIS DATE */}
                {selectedDateEvents.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">
                    <CalendarDays className="size-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">इस तिथि को कोई कार्यक्रम निर्धारित नहीं है।</p>
                    <p className="text-xs mt-1 text-muted-foreground/80">
                      बैठक, रैली या सम्मेलन जोड़ने के लिए नीचे क्लिक करें
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, date: selectedDate }));
                        setIsModalOpen(true);
                      }}
                      className="mt-4 px-3 py-1.5 text-xs rounded-md bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="size-3.5" /> + इस तिथि पर नया आयोजन जोड़ें
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5 mt-3.5">
                    {selectedDateEvents.map((e) => {
                      const cat = CATEGORY_MAP[e.category];
                      const pct = Math.min(100, Math.round((e.rsvp / (e.expected || 1)) * 100));

                      return (
                        <div
                          key={e.id}
                          className="rounded-lg border border-border p-3.5 bg-muted/10 hover:bg-muted/20 transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${cat.bg} ${cat.text} ${cat.border}`}
                              >
                                {cat.label}
                              </span>
                              <h4 className="text-sm font-bold text-foreground leading-snug">
                                {e.title}
                              </h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                              {e.constituency}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="size-3.5 text-primary shrink-0" />
                              <span>{e.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="size-3.5 text-primary shrink-0" />
                              <span className="truncate">{e.place}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserCheck className="size-3.5 text-primary shrink-0" />
                              <span>संयोजक: {e.organizer}</span>
                            </div>
                          </div>

                          {e.description && (
                            <p className="text-xs text-foreground/80 bg-card p-2 rounded border border-border/60">
                              {e.description}
                            </p>
                          )}

                          {/* RSVP PROGRESS */}
                          <div className="pt-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">उपस्थिति स्थिति (RSVP)</span>
                              <span className="font-semibold text-foreground">
                                {e.rsvp} / {e.expected} ({pct}%)
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MONTHLY HIGHLIGHTS NOTICE */}
              <div className="rounded-xl border border-orange-200/60 dark:border-orange-950 bg-gradient-to-br from-orange-50 to-orange-100/30 dark:from-orange-950/30 dark:to-background p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-orange-900 dark:text-orange-300">
                  <Sparkles className="size-4 text-orange-600" /> महत्वपूर्ण संगठनात्मक निर्देश
                </div>
                <p className="text-orange-800/90 dark:text-orange-200/80 leading-relaxed">
                  सभी आयोजनों की सूचना संबंधित विधानसभा अध्यक्ष, ब्लॉक अध्यक्ष व मंडल संयोजकों को कम से कम 48 घंटे पूर्व व्हाट्सएप व SMS द्वारा प्रेषित की जानी अनिवार्य है।
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* LIST / AGENDA VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground pb-2">
              <span>कुल {filteredEvents.length} आयोजन सूचीबद्ध</span>
              <span>अपेक्षित उपस्थिति क्रम अनुसार</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredEvents.map((e) => {
                const cat = CATEGORY_MAP[e.category];
                const pct = Math.min(100, Math.round((e.rsvp / (e.expected || 1)) * 100));
                const d = new Date(`${e.date}T00:00:00+05:30`);

                return (
                  <article
                    key={e.id}
                    className="rounded-xl border border-border bg-card shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex">
                      {/* DATE BADGE */}
                      <div className="bg-primary text-primary-foreground w-20 sm:w-24 flex flex-col items-center justify-center shrink-0 p-3 text-center">
                        <span className="font-serif text-2xl sm:text-3xl font-bold">
                          {d.toLocaleString("hi-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}
                        </span>
                        <span className="text-xs uppercase tracking-wider font-semibold">
                          {d.toLocaleString("hi-IN", { month: "short", timeZone: "Asia/Kolkata" })}
                        </span>
                        <span className="text-[10px] opacity-80 mt-0.5">
                          {d.getFullYear()}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}
                          >
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {e.constituency}
                          </span>
                        </div>

                        <h2 className="text-base font-bold text-foreground leading-snug truncate">
                          {e.title}
                        </h2>

                        <div className="space-y-1 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-primary shrink-0" />
                            <span>{e.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-primary shrink-0" />
                            <span className="truncate">{e.place}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="size-3.5 text-primary shrink-0" />
                            <span className="truncate">प्रभारी: {e.organizer}</span>
                          </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="mt-3.5">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">पुष्ट उपस्थिति</span>
                            <span className="font-semibold text-foreground">
                              {e.rsvp} / {e.expected} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* EVENT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-card border border-border shadow-2xl rounded-xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">नया आयोजन जोड़ें</h3>
                <p className="text-xs text-muted-foreground">
                  रैली, कार्यकर्ता सम्मेलन, पदयात्रा या समीक्षा बैठक का विवरण दर्ज करें
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1">आयोजन का नाम (शीर्षक) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. सागर जिला कार्यकर्ता सम्मेलन"
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">आयोजन श्रेणी *</label>
                  <select
                    className={inputClass}
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as EventCategory })
                    }
                  >
                    <option value="rally">रैली व जनसभा</option>
                    <option value="meeting">कार्यकर्ता सम्मेलन</option>
                    <option value="review">समीक्षा संवाद</option>
                    <option value="training">प्रशिक्षण व BLA</option>
                    <option value="padayatra">जन-सम्पर्क पदयात्रा</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">विधानसभा / ब्लॉक</label>
                  <input
                    type="text"
                    placeholder="उदा. 041 - सागर"
                    className={inputClass}
                    value={formData.constituency}
                    onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">दिनांक *</label>
                  <input
                    type="date"
                    required
                    className={inputClass}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">समय</label>
                  <input
                    type="text"
                    placeholder="उदा. 11:00 पूर्वाह्न"
                    className={inputClass}
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">स्थान / स्थल का पता *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. पद्माकर सभागार, सिविल लाइन्स, सागर"
                  className={inputClass}
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">संयोजक / प्रभारी का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. डॉ. आनंद अहिरवार (जिलाध्यक्ष)"
                  className={inputClass}
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">अपेक्षित संख्या</label>
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={formData.expected}
                    onChange={(e) =>
                      setFormData({ ...formData, expected: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">पुष्ट उपस्थिति (RSVP)</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={formData.rsvp}
                    onChange={(e) => setFormData({ ...formData, rsvp: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">संक्षिप्त विवरण व एजेंडा</label>
                <textarea
                  rows={2}
                  placeholder="आयोजन के मुख्य बिंदु, वक्ता, व व्यवस्था संबंधी निर्देश..."
                  className={inputClass}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted font-medium transition-colors"
                >
                  रद्द करें
                </button>
                <button type="submit" className={btn}>
                  कैलेंडर में सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
