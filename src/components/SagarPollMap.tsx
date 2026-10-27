import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ZoomIn, ZoomOut, RotateCcw, Search, ShieldCheck, Flame, AlertTriangle, Layers, MapPin, Users, Phone } from "lucide-react";
import { booths, boothLean, type Booth } from "@/lib/campaign";
import { sagarConstituencies } from "@/lib/sagarConstituencies";

// These locations only identify block/town areas. The demo booth records have no surveyed coordinates.
const blockCenters: Record<string, [number, number]> = {
  "सागर": [23.8388, 78.7378], "बंडा": [24.045, 78.956], "खुरई": [24.045, 78.331], "बीना": [24.177, 78.176],
  "रहली": [23.633, 79.062], "देवरी": [23.141, 78.746], "नरयावली": [23.881, 78.821], "सुरखी": [23.714, 78.895],
};
const colors = ["#dceee4", "#e8e6f5", "#f8e7ce", "#dceaf2", "#eee2d9", "#f4e7ec", "#dcebe9", "#ecebd8"];
const districtBounds: L.LatLngBoundsExpression = [[23.12, 78.01], [24.50, 79.41]];

type ConstituencyFeature = (typeof sagarConstituencies.features)[number];

export function SagarPollMap() {
  const mapHost = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);
  const boundaryLayer = useRef<L.GeoJSON | null>(null);
  const [activeBlock, setActiveBlock] = useState("सभी");
  const [sentimentFilter, setSentimentFilter] = useState<"सभी" | "मजबूत" | "कांटे की टक्कर" | "कमजोर">("सभी");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    if (!mapHost.current || mapRef.current) return;
    const map = L.map(mapHost.current, {
      center: [23.78, 78.72], zoom: 8, minZoom: 8, maxZoom: 15,
      zoomControl: false, scrollWheelZoom: true, maxBounds: districtBounds, maxBoundsViscosity: 1,
      attributionControl: true,
    });
    // No basemap tiles: the canvas is intentionally limited to Sagar district.
    const boundaries = L.geoJSON(sagarConstituencies as unknown as GeoJSON.FeatureCollection, {
      style: (feature) => {
        const props = feature?.properties as ConstituencyFeature["properties"] | undefined;
        const index = Math.max(0, (props?.ac_no ?? 35) - 35);
        return { color: "#566b64", weight: 1.6, opacity: 0.95, fillColor: colors[index % colors.length], fillOpacity: 0.9 };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as ConstituencyFeature["properties"];
        layer.bindTooltip(`<strong>${props.ac_no} · ${props.name_hi}</strong><br><small>${props.ac_name}</small>`, { sticky: true });
        layer.on("click", () => {
          setActiveBlock(props.name_hi);
          map.fitBounds((layer as L.Polygon).getBounds(), { padding: [36, 36], maxZoom: 10, animate: true });
        });
      },
    }).addTo(map);
    boundaryLayer.current = boundaries;
    sagarConstituencies.features.forEach((feature) => {
      const [lat, lng] = feature.properties.centroid;
      const label = L.divIcon({ className: "sagar-constituency-label", html: `<span>${feature.properties.ac_no} · ${feature.properties.name_hi}</span>`, iconSize: [120, 24], iconAnchor: [60, 12] });
      L.marker([lat, lng], { icon: label, interactive: false, keyboard: false }).addTo(map);
    });
    const markers = L.layerGroup().addTo(map);
    markerLayer.current = markers;
    map.on("zoomend", () => setZoom(map.getZoom()));
    map.fitBounds(boundaries.getBounds(), { padding: [28, 28] });
    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 100);
    return () => { map.remove(); mapRef.current = null; markerLayer.current = null; boundaryLayer.current = null; };
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
      const marker = L.circleMarker(coords, { radius: activeBlock === "सभी" ? 8 : 11, color: "white", weight: 2, fillColor: color, fillOpacity: 0.95 });
      marker.bindTooltip(`<strong>${block}</strong><br>${items.length} डेमो बूथ<br><small>क्षेत्र-स्तरीय संकेत, सटीक बूथ स्थान नहीं</small>`, { direction: "top" });
      marker.on("click", () => { setActiveBlock(block); setSelectedBooth(items[0] || null); mapRef.current?.flyTo(coords, 10); });
      marker.addTo(markerLayer.current!);
    });
  }, [visibleBooths, activeBlock]);

  const total = visibleBooths.length;
  const strongCount = visibleBooths.filter((b) => boothLean(b) === "मजबूत").length;
  const swingCount = visibleBooths.filter((b) => boothLean(b) === "कांटे की टक्कर").length;
  const weakCount = visibleBooths.filter((b) => boothLean(b) === "कमजोर").length;
  const resetMap = () => { setActiveBlock("सभी"); setSentimentFilter("सभी"); setSearchQuery(""); setSelectedBooth(null); if (boundaryLayer.current && mapRef.current) mapRef.current.fitBounds(boundaryLayer.current.getBounds(), { padding: [28, 28], animate: true }); };

  return <div className="panel p-5 bg-card border border-border rounded-xl shadow-xs space-y-4">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-4">
      <div><div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" /><h3 className="font-serif text-xl font-bold text-foreground">सागर जिला · विधानसभा मानचित्र</h3></div>
      <p className="text-xs text-muted-foreground mt-1">सागर जिले की 8 विधानसभा सीमाएँ · ज़ूम करें और क्षेत्र चुनें</p></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"><div className="md:col-span-6 flex flex-wrap items-center gap-1.5 text-xs"><span className="text-muted-foreground text-[11px]">विधानसभा:</span><button onClick={() => setActiveBlock("सभी")} className={`px-2.5 py-1 rounded-md border ${activeBlock === "सभी" ? "bg-primary text-primary-foreground" : "bg-background"}`}>सभी (8)</button>{sagarConstituencies.features.map((f) => <button key={f.properties.ac_no} onClick={() => { setActiveBlock(f.properties.name_hi); const layer = boundaryLayer.current?.getLayers().find((l) => (l as L.GeoJSON).feature && ((l as L.GeoJSON).feature as unknown as { properties?: ConstituencyFeature["properties"] }).properties?.ac_no === f.properties.ac_no); if (layer && mapRef.current) mapRef.current.fitBounds((layer as L.Polygon).getBounds(), { padding: [36, 36], maxZoom: 10 }); }} className={`px-2.5 py-1 rounded-md border ${activeBlock === f.properties.name_hi ? "bg-primary text-primary-foreground" : "bg-background"}`}>{f.properties.name_hi}</button>)}</div>
      <div className="md:col-span-3 flex items-center gap-1 text-xs"><span className="text-muted-foreground text-[11px]">रुझान:</span>{(["सभी", "मजबूत", "कांटे की टक्कर", "कमजोर"] as const).map((s) => <button key={s} onClick={() => setSentimentFilter(s)} className={`px-2 py-0.5 rounded border text-[10px] ${sentimentFilter === s ? "bg-foreground text-background" : "bg-background text-muted-foreground"}`}>{s}</button>)}</div>
      <div className="md:col-span-3 relative"><Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground"/><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="बूथ, स्कूल या BLO खोजें..." className="w-full bg-background border rounded-lg pl-8 pr-3 py-1.5 text-xs" /></div></div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"><div className="p-2.5 bg-muted/40 rounded-lg border flex justify-between"><span>डेमो बूथ</span><b>{total}</b></div><div className="p-2.5 bg-emerald-50 rounded-lg border flex justify-between"><span><ShieldCheck className="inline w-3.5 h-3.5"/> मजबूत</span><b>{strongCount}</b></div><div className="p-2.5 bg-amber-50 rounded-lg border flex justify-between"><span><Flame className="inline w-3.5 h-3.5"/> कांटे की टक्कर</span><b>{swingCount}</b></div><div className="p-2.5 bg-rose-50 rounded-lg border flex justify-between"><span><AlertTriangle className="inline w-3.5 h-3.5"/> कमजोर</span><b>{weakCount}</b></div></div>
    <div className="relative w-full h-[480px] border border-border rounded-xl overflow-hidden bg-[#f6f4ed]"><div ref={mapHost} className="absolute inset-0" aria-label="सागर जिले का विधानसभा मानचित्र" />
      <div className="absolute z-[500] top-3 right-3 flex flex-col bg-background/95 border rounded-lg shadow p-1"><button onClick={() => mapRef.current?.zoomIn()} title="ज़ूम इन" className="p-1.5"><ZoomIn className="w-4 h-4"/></button><span className="text-[10px] text-center">{zoom}</span><button onClick={() => mapRef.current?.zoomOut()} title="ज़ूम आउट" className="p-1.5"><ZoomOut className="w-4 h-4"/></button><button onClick={resetMap} title="सागर सीमा पर रीसेट" className="p-1.5 border-t"><RotateCcw className="w-3.5 h-3.5"/></button></div>
      <div className="absolute z-[500] bottom-3 left-3 bg-background/95 border p-2.5 rounded-xl text-[11px] space-y-1 shadow"><div className="font-semibold text-muted-foreground text-[9px] flex items-center gap-1"><Layers className="w-3 h-3"/> बूथ स्थिति · डेमो डेटा</div><div>🟢 मजबूत</div><div>🟠 कांटे की टक्कर</div><div>🔴 कमजोर</div><div className="text-[9px] text-muted-foreground max-w-48">बूथ मार्कर केवल ब्लॉक/क्षेत्र केंद्र दर्शाते हैं, मतदान केंद्र की सटीक जगह नहीं।</div></div>
      <div className="absolute z-[500] top-3 left-3 bg-background/95 border px-3 py-2 rounded-lg text-xs shadow flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary"/>सागर जिला · मध्य प्रदेश</div>
      <div className="absolute z-[500] bottom-3 right-3 bg-background/90 border px-2 py-1 rounded text-[9px] text-muted-foreground">सीमा डेटा: India Geodata · CC BY 4.0</div>
    </div>
    {selectedBooth && <div className="p-4 rounded-xl border border-primary/30 bg-card shadow-sm space-y-3"><div className="flex justify-between gap-3"><div><b>{selectedBooth.name} – {selectedBooth.pollingStation}</b><p className="text-xs text-muted-foreground mt-1">ब्लॉक: {selectedBooth.block} · प्रमुख मुद्दा: {selectedBooth.keyIssue} · केवल नमूना रिकॉर्ड</p></div><button onClick={() => setSelectedBooth(null)} className="text-xs">बंद करें ✕</button></div><div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs"><div className="p-3 bg-muted/40 rounded-lg">मतदाता <b className="block">{selectedBooth.voters}</b></div><div className="p-3 bg-emerald-50 rounded-lg">समर्थक <b className="block">{selectedBooth.support}%</b></div><div className="p-3 bg-amber-50 rounded-lg">तटस्थ <b className="block">{selectedBooth.neutral}%</b></div><div className="p-3 bg-rose-50 rounded-lg">विरोधी <b className="block">{selectedBooth.oppose}%</b></div><div className="p-3 bg-muted/40 rounded-lg">मतदान रुझान <b className="block">{selectedBooth.turnout}%</b></div></div><div className="flex items-center gap-2 text-xs"><Users className="w-3.5 h-3.5 text-primary"/>{selectedBooth.coordinator}<a href={`tel:${selectedBooth.coordinatorPhone}`} className="text-primary"><Phone className="inline w-3 h-3"/> {selectedBooth.coordinatorPhone}</a></div></div>}
  </div>;
}
