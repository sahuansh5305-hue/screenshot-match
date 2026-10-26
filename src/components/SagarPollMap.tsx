import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ZoomIn, ZoomOut, RotateCcw, Search, Activity, ShieldCheck, Flame, AlertTriangle, Layers, MapPin, Users, Phone } from "lucide-react";
import { blocks } from "@/lib/data";
import { booths, boothLean, type Booth } from "@/lib/campaign";

// Block-town anchor points for visual orientation only. The synthetic booth records
// do not contain surveyed polling-station coordinates and must not be presented as exact.
const blockCenters: Record<string, [number, number]> = {
  "सागर": [23.8388, 78.7378], "बंडा": [24.045, 78.956], "खुरई": [24.045, 78.331], "बीना": [24.177, 78.176],
  "रहली": [23.633, 79.062], "देवरी": [23.141, 78.746], "नरयावली": [23.881, 78.821], "सुरखी": [23.714, 78.895],
};
const indiaCenter: L.LatLngExpression = [22.8, 79.0];
const sagarCenter: L.LatLngExpression = [23.78, 78.72];
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export function SagarPollMap() {
  const mapHost = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);
  const [viewMode, setViewMode] = useState<"district" | "india">("district");
  const [activeBlock, setActiveBlock] = useState("सभी");
  const [sentimentFilter, setSentimentFilter] = useState<"सभी" | "मजबूत" | "कांटे की टक्कर" | "कमजोर">("सभी");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [zoom, setZoom] = useState(6);

  useEffect(() => {
    if (!mapHost.current || mapRef.current) return;
    const map = L.map(mapHost.current, { center: sagarCenter, zoom: 8, minZoom: 4, maxZoom: 17, zoomControl: false, scrollWheelZoom: true });
    L.tileLayer(tileUrl, { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map);
    const layer = L.layerGroup().addTo(map);
    map.on("zoomend", () => setZoom(map.getZoom()));
    mapRef.current = map;
    markerLayer.current = layer;
    window.setTimeout(() => map.invalidateSize(), 100);
    return () => { map.remove(); mapRef.current = null; markerLayer.current = null; };
  }, []);

  const visibleBooths = useMemo(() => booths.filter((b) => {
    const matchesBlock = activeBlock === "सभी" || b.block === activeBlock;
    const lean = boothLean(b);
    const matchesLean = sentimentFilter === "सभी" || lean === sentimentFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || b.name.toLowerCase().includes(q) || String(b.id).includes(q) || b.block.toLowerCase().includes(q) || b.coordinator.toLowerCase().includes(q) || b.pollingStation.toLowerCase().includes(q);
    return matchesBlock && matchesLean && matchesQuery;
  }), [activeBlock, sentimentFilter, searchQuery]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(viewMode === "india" ? indiaCenter : sagarCenter, viewMode === "india" ? 5 : 8, { animate: true });
  }, [viewMode]);

  useEffect(() => {
    if (!markerLayer.current) return;
    markerLayer.current.clearLayers();
    const grouped = new Map<string, Booth[]>();
    visibleBooths.forEach((b) => grouped.set(b.block, [...(grouped.get(b.block) || []), b]));
    grouped.forEach((items, block) => {
      const coords = blockCenters[block];
      if (!coords) return;
      const strong = items.filter((b) => boothLean(b) === "मजबूत").length;
      const swing = items.filter((b) => boothLean(b) === "कांटे की टक्कर").length;
      const weak = items.filter((b) => boothLean(b) === "कमजोर").length;
      const color = strong >= swing && strong >= weak ? "#059669" : swing >= weak ? "#d97706" : "#e11d48";
      const marker = L.circleMarker(coords, { radius: activeBlock === "सभी" ? 10 : 13, color: "white", weight: 2, fillColor: color, fillOpacity: 0.95 });
      marker.bindTooltip(`<strong>${block}</strong><br>${items.length} डेमो बूथ<br><small>ब्लॉक केंद्र, सटीक केंद्र-स्थान नहीं</small>`, { direction: "top" });
      marker.on("click", () => { setActiveBlock(block); setSelectedBooth(items[0] || null); mapRef.current?.flyTo(coords, 11); });
      marker.addTo(markerLayer.current!);
      L.marker(coords, { opacity: 0, interactive: false }).bindTooltip(block, { permanent: true, direction: "bottom", className: "sagar-map-label", offset: [0, 8] }).addTo(markerLayer.current!);
    });
  }, [visibleBooths, activeBlock]);

  const total = visibleBooths.length;
  const strongCount = visibleBooths.filter((b) => boothLean(b) === "मजबूत").length;
  const swingCount = visibleBooths.filter((b) => boothLean(b) === "कांटे की टक्कर").length;
  const weakCount = visibleBooths.filter((b) => boothLean(b) === "कमजोर").length;

  const resetMap = () => { setActiveBlock("सभी"); setSentimentFilter("सभी"); setSearchQuery(""); setSelectedBooth(null); setViewMode("district"); mapRef.current?.flyTo(sagarCenter, 8); };

  return <div className="panel p-5 bg-card border border-border rounded-xl shadow-xs space-y-4">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-4">
      <div><div className="flex items-center gap-2"><span className={`inline-block w-2.5 h-2.5 rounded-full ${liveMode ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} /><h3 className="font-serif text-xl font-bold text-foreground">सागर जिला चुनावी मानचित्र</h3>{liveMode && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">डेमो</span>}</div>
      <p className="text-xs text-muted-foreground mt-1">भारत से सागर तक ज़ूम करें · OpenStreetMap भू-नक्शा · मतदान केंद्र निर्देशांक सत्यापित नहीं हैं</p></div>
      <div className="flex flex-wrap items-center gap-2"><div className="flex bg-muted p-1 rounded-lg text-xs"><button onClick={() => setViewMode("district")} className={`px-3 py-1.5 rounded-md font-semibold ${viewMode === "district" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"}`}>सागर जिला</button><button onClick={() => setViewMode("india")} className={`px-3 py-1.5 rounded-md font-semibold ${viewMode === "india" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"}`}>भारत</button></div><button onClick={() => setLiveMode((v) => !v)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" />{liveMode ? "डेमो बंद" : "लाइव मतदान डेमो"}</button></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"><div className="md:col-span-6 flex flex-wrap items-center gap-1.5 text-xs"><span className="text-muted-foreground text-[11px]">विधानसभा / ब्लॉक:</span><button onClick={() => setActiveBlock("सभी")} className={`px-2.5 py-1 rounded-md border ${activeBlock === "सभी" ? "bg-primary text-primary-foreground" : "bg-background"}`}>सभी ({blocks.length})</button>{blocks.map((b) => <button key={b} onClick={() => setActiveBlock(b)} className={`px-2.5 py-1 rounded-md border ${activeBlock === b ? "bg-primary text-primary-foreground" : "bg-background"}`}>{b}</button>)}</div>
      <div className="md:col-span-3 flex items-center gap-1 text-xs"><span className="text-muted-foreground text-[11px]">रुझान:</span>{(["सभी", "मजबूत", "कांटे की टक्कर", "कमजोर"] as const).map((s) => <button key={s} onClick={() => setSentimentFilter(s)} className={`px-2 py-0.5 rounded border text-[10px] ${sentimentFilter === s ? "bg-foreground text-background" : "bg-background text-muted-foreground"}`}>{s}</button>)}</div>
      <div className="md:col-span-3 relative"><Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground"/><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="बूथ, स्कूल या BLO खोजें..." className="w-full bg-background border rounded-lg pl-8 pr-3 py-1.5 text-xs" /></div></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"><div className="p-2.5 bg-muted/40 rounded-lg border flex justify-between"><span>डेमो बूथ</span><b>{total}</b></div><div className="p-2.5 bg-emerald-50 rounded-lg border flex justify-between"><span><ShieldCheck className="inline w-3.5 h-3.5"/> मजबूत</span><b>{strongCount}</b></div><div className="p-2.5 bg-amber-50 rounded-lg border flex justify-between"><span><Flame className="inline w-3.5 h-3.5"/> कांटे की टक्कर</span><b>{swingCount}</b></div><div className="p-2.5 bg-rose-50 rounded-lg border flex justify-between"><span><AlertTriangle className="inline w-3.5 h-3.5"/> कमजोर</span><b>{weakCount}</b></div></div>
    <div className="relative w-full h-[480px] border border-border rounded-xl overflow-hidden bg-slate-100"><div ref={mapHost} className="absolute inset-0" aria-label="Interactive map of India and Sagar" />
      <div className="absolute z-[500] top-3 right-3 flex flex-col bg-background/95 border rounded-lg shadow p-1"><button onClick={() => mapRef.current?.zoomIn()} title="ज़ूम इन" className="p-1.5"><ZoomIn className="w-4 h-4"/></button><span className="text-[10px] text-center">{zoom}</span><button onClick={() => mapRef.current?.zoomOut()} title="ज़ूम आउट" className="p-1.5"><ZoomOut className="w-4 h-4"/></button><button onClick={resetMap} title="सागर पर रीसेट" className="p-1.5 border-t"><RotateCcw className="w-3.5 h-3.5"/></button></div>
      <div className="absolute z-[500] bottom-3 left-3 bg-background/95 border p-2.5 rounded-xl text-[11px] space-y-1 shadow"><div className="font-semibold text-muted-foreground text-[9px] flex items-center gap-1"><Layers className="w-3 h-3"/> बूथ स्थिति · डेमो डेटा</div><div>🟢 मजबूत</div><div>🟠 कांटे की टक्कर</div><div>🔴 कमजोर</div><div className="text-[9px] text-muted-foreground max-w-48">मार्कर ब्लॉक केंद्रों पर हैं, वास्तविक polling station स्थान नहीं।</div></div>
      <div className="absolute z-[500] top-3 left-3 bg-background/95 border px-3 py-2 rounded-lg text-xs shadow flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary"/>{viewMode === "india" ? "भारत · मध्य प्रदेश · सागर" : "सागर जिला · मध्य प्रदेश"}</div>
    </div>
    {selectedBooth && <div className="p-4 rounded-xl border border-primary/30 bg-card shadow-sm space-y-3"><div className="flex justify-between gap-3"><div><b>{selectedBooth.name} – {selectedBooth.pollingStation}</b><p className="text-xs text-muted-foreground mt-1">ब्लॉक: {selectedBooth.block} · प्रमुख मुद्दा: {selectedBooth.keyIssue} · केवल नमूना रिकॉर्ड</p></div><button onClick={() => setSelectedBooth(null)} className="text-xs">बंद करें ✕</button></div><div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs"><div className="p-3 bg-muted/40 rounded-lg">मतदाता <b className="block">{selectedBooth.voters}</b></div><div className="p-3 bg-emerald-50 rounded-lg">समर्थक <b className="block">{selectedBooth.support}%</b></div><div className="p-3 bg-amber-50 rounded-lg">तटस्थ <b className="block">{selectedBooth.neutral}%</b></div><div className="p-3 bg-rose-50 rounded-lg">विरोधी <b className="block">{selectedBooth.oppose}%</b></div><div className="p-3 bg-muted/40 rounded-lg">मतदान रुझान <b className="block">{selectedBooth.turnout}%</b></div></div><div className="flex items-center gap-2 text-xs"><Users className="w-3.5 h-3.5 text-primary"/>{selectedBooth.coordinator}<a href={`tel:${selectedBooth.coordinatorPhone}`} className="text-primary"><Phone className="inline w-3 h-3"/> {selectedBooth.coordinatorPhone}</a></div></div>}
  </div>;
}
