import { useState, useMemo, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Users,
  Phone,
  Search,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
  AlertTriangle,
  Move
} from "lucide-react";
import { blocks } from "@/lib/data";
import { booths, boothLean, type Booth } from "@/lib/campaign";

// Sagar District 8 Assembly Constituencies (विधानसभा सीटें) layout
interface Segment {
  id: string;
  name: string;
  code: string;
  type: string;
  votersTotal: string;
  cx: number;
  cy: number;
  path: string;
  color: string;
}

const assemblySegments: Segment[] = [
  {
    id: "सागर",
    name: "सागर नगर",
    code: "36",
    type: "सामान्य",
    votersTotal: "2,18,450",
    cx: 250,
    cy: 215,
    path: "M 220 185 Q 275 180 285 210 Q 285 245 255 250 Q 220 250 215 220 Z",
    color: "#2563eb",
  },
  {
    id: "नरयावली",
    name: "नरयावली",
    code: "38",
    type: "अ.जा. (SC)",
    votersTotal: "2,35,120",
    cx: 215,
    cy: 155,
    path: "M 180 125 Q 240 120 260 150 Q 245 185 205 185 Q 170 170 180 125 Z",
    color: "#0891b2",
  },
  {
    id: "खुरई",
    name: "खुरई",
    code: "34",
    type: "सामान्य",
    votersTotal: "2,05,800",
    cx: 135,
    cy: 145,
    path: "M 100 110 Q 170 105 180 155 Q 165 190 120 185 Q 90 155 100 110 Z",
    color: "#059669",
  },
  {
    id: "बीना",
    name: "बीना",
    code: "35",
    type: "अ.जा. (SC)",
    votersTotal: "1,92,300",
    cx: 95,
    cy: 80,
    path: "M 65 50 Q 130 45 140 85 Q 125 120 80 115 Q 55 90 65 50 Z",
    color: "#d97706",
  },
  {
    id: "बंडा",
    name: "बंडा",
    code: "42",
    type: "सामान्य",
    votersTotal: "2,48,900",
    cx: 320,
    cy: 135,
    path: "M 265 100 Q 370 95 380 145 Q 360 190 300 180 Q 260 145 265 100 Z",
    color: "#7c3aed",
  },
  {
    id: "रहली",
    name: "रहली",
    code: "39",
    type: "सामान्य",
    votersTotal: "2,32,150",
    cx: 345,
    cy: 255,
    path: "M 290 205 Q 395 210 405 265 Q 385 315 315 305 Q 285 260 290 205 Z",
    color: "#db2777",
  },
  {
    id: "देवरी",
    name: "देवरी",
    code: "38",
    type: "सामान्य",
    votersTotal: "2,15,600",
    cx: 295,
    cy: 345,
    path: "M 240 295 Q 345 295 350 350 Q 325 395 260 395 Q 230 355 240 295 Z",
    color: "#ea580c",
  },
  {
    id: "सुरखी",
    name: "सुरखी",
    code: "37",
    type: "सामान्य",
    votersTotal: "2,24,700",
    cx: 195,
    cy: 285,
    path: "M 155 235 Q 240 235 245 285 Q 235 340 170 335 Q 140 290 155 235 Z",
    color: "#4f46e5",
  },
];

export function SagarPollMap() {
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [activeBlock, setActiveBlock] = useState<string>("सभी");
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [viewMode, setViewMode] = useState<"district" | "india">("district");
  const [sentimentFilter, setSentimentFilter] = useState<"सभी" | "मजबूत" | "कांटे की टक्कर" | "कमजोर">("सभी");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveMode, setLiveMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom helpers
  const handleZoomIn = () => setScale((s) => Math.min(Number((s + 0.25).toFixed(2)), 3.5));
  const handleZoomOut = () => setScale((s) => Math.max(Number((s - 0.25).toFixed(2)), 0.7));
  const handleReset = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveBlock("सभी");
    setSentimentFilter("सभी");
    setSearchQuery("");
    setSelectedBooth(null);
  };

  // Pan controls
  const handlePan = (dx: number, dy: number) => {
    setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  // Filter booths
  const visibleBooths = useMemo(() => {
    return booths.filter((b) => {
      const matchBlock = activeBlock === "सभी" || b.block === activeBlock;
      const lean = boothLean(b);
      const matchSentiment = sentimentFilter === "सभी" || lean === sentimentFilter;
      const matchSearch =
        !searchQuery ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery) ||
        b.block.includes(searchQuery) ||
        b.coordinator.includes(searchQuery) ||
        b.pollingStation.includes(searchQuery);

      return matchBlock && matchSentiment && matchSearch;
    });
  }, [activeBlock, sentimentFilter, searchQuery]);

  // Aggregate stats
  const totalInFilter = visibleBooths.length;
  const strongCount = visibleBooths.filter((b) => boothLean(b) === "मजबूत").length;
  const swingCount = visibleBooths.filter((b) => boothLean(b) === "कांटे की टक्कर").length;
  const weakCount = visibleBooths.filter((b) => boothLean(b) === "कमजोर").length;

  return (
    <div className="panel p-5 bg-card border border-border rounded-xl shadow-xs space-y-4">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${liveMode ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
            <h3 className="font-serif text-xl font-bold text-foreground">
              चुनावी नक्शा व मतदान केंद्र – सागर जिला
            </h3>
            {liveMode && (
              <span className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                लाइव मॉनिटरिंग चालू
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            मध्य प्रदेश (बुंदेलखंड संभाग) · 8 विधानसभा क्षेत्र · 96 निगरानी बूथ · वास्तविक समय जनमत विश्लेषण
          </p>
        </div>

        {/* View Switcher & Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-muted p-1 rounded-lg text-xs">
            <button
              onClick={() => setViewMode("district")}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewMode === "district" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              सागर जिला (बूथ स्तर)
            </button>
            <button
              onClick={() => setViewMode("india")}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewMode === "india" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              भारत व म.प्र. संदर्भ
            </button>
          </div>

          <button
            onClick={() => setLiveMode((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
              liveMode
                ? "bg-red-600 text-white border-red-700 shadow-xs"
                : "bg-background border-border text-foreground hover:bg-muted"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {liveMode ? "लाइव बंद करें" : "लाइव मतदान रुझान"}
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Block pills, Sentiment Filter, Search Box & Zoom Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Assembly Blocks */}
        <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-medium text-[11px] mr-1">विधानसभा:</span>
          <button
            onClick={() => setActiveBlock("सभी")}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition ${
              activeBlock === "सभी"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-foreground hover:bg-muted"
            }`}
          >
            सभी (8)
          </button>
          {blocks.map((b) => (
            <button
              key={b}
              onClick={() => setActiveBlock(b)}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium transition ${
                activeBlock === b
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Sentiment filters */}
        <div className="md:col-span-3 flex items-center gap-1 text-xs">
          <span className="text-muted-foreground font-medium text-[11px] mr-1">रुझान:</span>
          {(["सभी", "मजबूत", "कांटे की टक्कर", "कमजोर"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSentimentFilter(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition ${
                sentimentFilter === s
                  ? s === "मजबूत"
                    ? "bg-emerald-600 text-white border-emerald-700"
                    : s === "कांटे की टक्कर"
                    ? "bg-amber-600 text-white border-amber-700"
                    : s === "कमजोर"
                    ? "bg-rose-600 text-white border-rose-700"
                    : "bg-foreground text-background border-foreground"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="md:col-span-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="बूथ क्र., स्कूल या BLO खोजें..."
            className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* KPI Ribbon under filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-muted/40 rounded-lg border border-border flex items-center justify-between">
          <span className="text-muted-foreground">दर्शाए गए बूथ</span>
          <span className="font-bold text-foreground font-mono text-sm">{totalInFilter}</span>
        </div>
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> मजबूत बूथ
          </span>
          <span className="font-bold text-emerald-800 dark:text-emerald-200 font-mono text-sm">{strongCount}</span>
        </div>
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <span className="text-amber-700 dark:text-amber-300 flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5" /> कांटे की टक्कर
          </span>
          <span className="font-bold text-amber-800 dark:text-amber-200 font-mono text-sm">{swingCount}</span>
        </div>
        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <span className="text-rose-700 dark:text-rose-300 flex items-center gap-1 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> कमजोर (सक्रियता आवश्यक)
          </span>
          <span className="font-bold text-rose-800 dark:text-rose-200 font-mono text-sm">{weakCount}</span>
        </div>
      </div>

      {/* Canvas Area with Floating Zoom Tools */}
      <div
        ref={containerRef}
        className="relative w-full h-[480px] bg-gradient-to-b from-muted/30 to-muted/10 border border-border rounded-xl overflow-hidden select-none"
      >
        {/* Floating Zoom & Pan Controls on Canvas */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-center bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-md p-1 gap-1">
          <button
            onClick={handleZoomIn}
            title="ज़ूम इन करें (Zoom In)"
            className="p-1.5 hover:bg-muted rounded text-foreground transition active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="text-[10px] font-mono font-bold text-muted-foreground px-1">
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={handleZoomOut}
            title="ज़ूम आउट करें (Zoom Out)"
            className="p-1.5 hover:bg-muted rounded text-foreground transition active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px w-full bg-border my-0.5" />
          <button
            onClick={handleReset}
            title="रीसेट करें (Reset)"
            className="p-1.5 hover:bg-muted rounded text-foreground transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pan Directional Pad for Granular Navigation */}
        <div className="absolute bottom-3 right-3 z-20 hidden sm:flex flex-col items-center bg-background/90 backdrop-blur-md border border-border rounded-lg shadow-md p-1">
          <button
            onClick={() => handlePan(0, 30)}
            className="px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground font-mono"
            title="ऊपर खिसकाएँ"
          >
            ▲
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePan(30, 0)}
              className="px-1 text-[10px] text-muted-foreground hover:text-foreground font-mono"
              title="बाएँ खिसकाएँ"
            >
              ◀
            </button>
            <Move className="w-3 h-3 text-muted-foreground" />
            <button
              onClick={() => handlePan(-30, 0)}
              className="px-1 text-[10px] text-muted-foreground hover:text-foreground font-mono"
              title="दाएँ खिसकाएँ"
            >
              ▶
            </button>
          </div>
          <button
            onClick={() => handlePan(0, -30)}
            className="px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground font-mono"
            title="नीचे खिसकाएँ"
          >
            ▼
          </button>
        </div>

        {/* View Mode 1: India & MP Context View */}
        {viewMode === "india" ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-background/95 border border-border rounded-2xl p-6 shadow-lg backdrop-blur-md space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" /> भारत के केंद्र में सागर
              </div>

              {/* Stylized SVG Map of India with MP & Sagar Highlighted */}
              <div className="relative w-48 h-48 mx-auto my-2">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Stylized outline of India */}
                  <path
                    d="M 95 15 L 115 25 L 125 45 L 155 55 L 170 75 L 150 85 L 135 105 L 130 145 L 105 185 L 90 185 L 75 145 L 65 110 L 50 90 L 55 70 L 75 55 L 85 30 Z"
                    fill="currentColor"
                    className="text-muted/40"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  {/* Madhya Pradesh Highlight */}
                  <path
                    d="M 80 90 Q 115 80 130 95 Q 125 120 95 120 Q 75 110 80 90 Z"
                    fill="#f97316"
                    fillOpacity="0.4"
                    stroke="#ea580c"
                    strokeWidth="2"
                  />
                  {/* Sagar District Point with Animated Ping */}
                  <circle cx="102" cy="100" r="4" fill="#2563eb" />
                  <circle cx="102" cy="100" r="10" fill="#2563eb" fillOpacity="0.3" className="animate-ping" />
                  <text x="102" y="90" textAnchor="middle" className="text-[8px] font-bold fill-primary">
                    सागर (MP)
                  </text>
                </svg>
              </div>

              <div>
                <h4 className="font-serif text-xl font-bold text-foreground">सागर संसदीय व जिला क्षेत्र</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  अक्षांश 23.8388° N, देशांतर 78.7378° E · बुंदेलखंड संभाग का रणनीतिक केंद्र
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-left">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <div className="text-muted-foreground text-[10px]">कुल विधानसभा सीटें</div>
                  <div className="font-bold text-foreground">8 सीटें (2 सुरक्षित)</div>
                </div>
                <div className="p-2 bg-muted/50 rounded-lg">
                  <div className="text-muted-foreground text-[10px]">कुल मतदाता संख्या</div>
                  <div className="font-bold text-foreground">~17.8 लाख मतदाता</div>
                </div>
              </div>

              <button
                onClick={() => setViewMode("district")}
                className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-95 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                सागर जिले के बूथ नक्शे में ज़ूम करें <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* View Mode 2: Interactive Sagar District & Polling Booths Vector Canvas */
          <div
            className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform duration-150"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            <svg viewBox="0 0 460 420" className="w-full h-full max-h-[460px] drop-shadow-sm">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Outer District Boundary Reference */}
              <circle
                cx="230"
                cy="210"
                r="190"
                fill="none"
                stroke="currentColor"
                className="text-border"
                strokeWidth="1"
                strokeDasharray="4,4"
              />

              {/* Assembly Constituencies Geometries */}
              <g>
                {assemblySegments.map((seg) => {
                  const isBlockSelected = activeBlock === "सभी" || activeBlock === seg.id;
                  const isExplicitCurrent = activeBlock === seg.id;

                  return (
                    <g
                      key={seg.id}
                      onClick={() => setActiveBlock(seg.id)}
                      className="cursor-pointer transition-all duration-200"
                      opacity={isBlockSelected ? 1 : 0.2}
                    >
                      {/* Polygon / Shape */}
                      <path
                        d={seg.path}
                        fill={seg.color}
                        fillOpacity={isExplicitCurrent ? 0.35 : 0.15}
                        stroke={seg.color}
                        strokeWidth={isExplicitCurrent ? 2.5 : 1.5}
                        className="transition-colors hover:fill-opacity-30"
                      />

                      {/* Assembly Label */}
                      <text
                        x={seg.cx}
                        y={seg.cy - 12}
                        textAnchor="middle"
                        className="text-[12px] font-serif font-bold fill-foreground pointer-events-none drop-shadow-xs"
                      >
                        {seg.name}
                      </text>
                      <text
                        x={seg.cx}
                        y={seg.cy + 4}
                        textAnchor="middle"
                        className="text-[9px] fill-muted-foreground font-sans pointer-events-none"
                      >
                        वि.स. #{seg.code} ({seg.type})
                      </text>
                      <text
                        x={seg.cx}
                        y={seg.cy + 18}
                        textAnchor="middle"
                        className="text-[8px] font-mono fill-muted-foreground pointer-events-none"
                      >
                        {seg.votersTotal} मतदाता
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Exact Polling Booth Markers */}
              <g>
                {visibleBooths.map((b, idx) => {
                  const seg = assemblySegments.find((s) => s.id === b.block) ?? assemblySegments[0];
                  // Geometrically disperse booths inside the constituency polygon
                  const angle = ((idx % 12) * (360 / 12) * Math.PI) / 180;
                  const radius = 16 + (idx % 4) * 10;
                  const bx = seg.cx + Math.cos(angle) * radius;
                  const by = seg.cy + Math.sin(angle) * radius;

                  const lean = boothLean(b);
                  const isSelected = selectedBooth?.id === b.id;

                  const markerColor =
                    lean === "मजबूत" ? "#10b981" : lean === "कांटे की टक्कर" ? "#f59e0b" : "#ef4444";

                  return (
                    <g
                      key={b.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooth(b);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Pulsing ring on selected booth or live monitoring */}
                      {(isSelected || (liveMode && lean === "कांटे की टक्कर")) && (
                        <circle
                          cx={bx}
                          cy={by}
                          r={isSelected ? 11 : 8}
                          fill={markerColor}
                          fillOpacity="0.3"
                          className="animate-ping"
                        />
                      )}

                      {/* Pin Circle */}
                      <circle
                        cx={bx}
                        cy={by}
                        r={isSelected ? 6.5 : 4}
                        fill={markerColor}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2 : 1.2}
                        className="transition-transform group-hover:scale-150 shadow-sm"
                      />

                      {/* Booth label when zoomed in */}
                      {scale >= 1.35 && (
                        <text
                          x={bx}
                          y={by - 7}
                          textAnchor="middle"
                          className="text-[7.5px] font-mono font-bold fill-foreground pointer-events-none drop-shadow-xs"
                        >
                          #{b.id}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        )}

        {/* Floating Bottom-Left Legend */}
        {viewMode === "district" && (
          <div className="absolute bottom-3 left-3 z-20 bg-background/95 backdrop-blur-md border border-border p-2.5 rounded-xl text-[11px] space-y-1.5 shadow-md">
            <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px] flex items-center gap-1">
              <Layers className="w-3 h-3" /> बूथ स्थिति संकेत
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
              <span>मजबूत (&gt;15% बढ़त)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
              <span>कांटे की टक्कर (Swing)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
              <span>कमजोर (तत्काल ध्यान)</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Polling Booth Detail Card */}
      {selectedBooth && (
        <div className="p-4 rounded-xl border border-primary/30 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-foreground">
                  {selectedBooth.name} – {selectedBooth.pollingStation}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                    boothLean(selectedBooth) === "मजबूत"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : boothLean(selectedBooth) === "कांटे की टक्कर"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {boothLean(selectedBooth)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                विधानसभा क्षेत्र: <strong className="text-foreground">{selectedBooth.block}</strong> · प्रमुख जन मुद्दा:{" "}
                <span className="inline-block bg-muted px-1.5 py-0.5 rounded text-foreground font-medium">
                  {selectedBooth.keyIssue}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedBooth(null)}
              className="self-start sm:self-center text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-1 rounded hover:bg-muted"
            >
              बंद करें ✕
            </button>
          </div>

          {/* Demographic & Field Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <div className="text-muted-foreground text-[10px]">कुल मतदाता</div>
              <div className="font-mono font-bold text-base text-foreground mt-0.5">{selectedBooth.voters}</div>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="text-emerald-700 dark:text-emerald-300 text-[10px]">समर्थक वोट</div>
              <div className="font-mono font-bold text-base text-emerald-800 dark:text-emerald-200 mt-0.5">
                {selectedBooth.support}%
              </div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="text-amber-700 dark:text-amber-300 text-[10px]">तटस्थ (Swing)</div>
              <div className="font-mono font-bold text-base text-amber-800 dark:text-amber-200 mt-0.5">
                {selectedBooth.neutral}%
              </div>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800">
              <div className="text-rose-700 dark:text-rose-300 text-[10px]">विरोधी वोट</div>
              <div className="font-mono font-bold text-base text-rose-800 dark:text-rose-200 mt-0.5">
                {selectedBooth.oppose}%
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border border-border col-span-2 sm:col-span-1">
              <div className="text-muted-foreground text-[10px]">मतदान दिवस रुझान</div>
              <div className="font-mono font-bold text-base text-primary mt-0.5">{selectedBooth.turnout}% अपेक्षित</div>
            </div>
          </div>

          {/* Booth Coordinator & Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>बूथ समन्वयक (BLO): <strong>{selectedBooth.coordinator}</strong></span>
              </div>
              <a
                href={`tel:${selectedBooth.coordinatorPhone}`}
                className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[11px]"
              >
                <Phone className="w-3 h-3" /> {selectedBooth.coordinatorPhone}
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <a
                href={`/canvassing?booth=${selectedBooth.id}`}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition text-[11px]"
              >
                घर-घर जनसंपर्क दर्ज करें →
              </a>
              <a
                href={`/war-room?block=${selectedBooth.block}`}
                className="px-3 py-1.5 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition text-[11px]"
              >
                वॉर रूम में देखें
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
