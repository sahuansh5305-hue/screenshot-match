import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, type ReactNode } from "react";
import {
  Home,
  Contact,
  Network,
  Megaphone,
  Vote,
  ListChecks,
  MessageCircleWarning,
  CalendarCheck,
  CalendarDays,
  BarChart3,
  Landmark,
  Database,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  MapPin,
  Shield,
  ShieldAlert,
  Eye,
  ArrowRight,
  User,
  X,
  UserPlus,
  Check,
  Building2,
  FileText,
} from "lucide-react";
import { useRbac } from "@/lib/rbac";
import { RegisterMemberModal, type RegisterMemberData } from "@/components/RegisterMemberModal";
import { members, type Member } from "@/lib/data";
import { booths } from "@/lib/campaign";
import { sagarConstituencies } from "@/lib/sagarConstituencies";

interface NavItem {
  to?: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
  minLevelRequired?: number; // 1 = DCC President only, 2 = Assembly+, 3 = Block+, etc.
  requiresCapability?: (cap: import("@/lib/rbac").UserRole["capabilities"]) => boolean;
}

const nav: NavItem[] = [
  { to: "/", label: "डैशबोर्ड", icon: Home, exact: true },
  { to: "/members", label: "कार्यकर्ता निर्देशिका", icon: Contact },
  { to: "/organization", label: "संगठनात्मक संरचना", icon: Network },
  {
    to: "/broadcast",
    label: "संदेश एवं अभियान",
    icon: Megaphone,
    requiresCapability: (cap) => cap.canBroadcast !== "अनुमति नहीं",
  },
  { to: "/tasks", label: "बूथ एवं BLA", icon: Vote },
  {
    to: "/war-room",
    label: "कार्य एवं ट्रैकिंग",
    icon: ListChecks,
    requiresCapability: (cap) => cap.canAssignTasks || cap.viewScope !== "बूथ 101 (सीहोरा)",
  },
  { to: "/grievances", label: "जन समस्याएं", icon: MessageCircleWarning },
  { to: "/outreach", label: "सदस्यता अभियान", icon: CalendarCheck },
  { to: "/events", label: "आयोजन", icon: CalendarDays },
  {
    to: "/reports",
    label: "रिपोर्ट एवं विश्लेषण",
    icon: BarChart3,
    requiresCapability: (cap) => cap.canExportReports,
  },
  {
    label: "प्रशासन",
    icon: Landmark,
    minLevelRequired: 1, // SuperAdmin / DCC President only
  },
  {
    label: "मास्टर डेटा",
    icon: Database,
    minLevelRequired: 2, // DCC & Vidhan Sabha presidents only
  },
  { label: "सहायता", icon: HelpCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { currentRole, setCurrentRoleId, allRoles, switchToSuperAdmin, isScoped, scopedMembersCount, totalMembersCount } =
    useRbac();
  const [isRbacOpen, setIsRbacOpen] = useState(false);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<"all" | "members" | "constituencies" | "booths" | "pages">("all");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Global Ctrl+K / Cmd+K and Esc listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsAreaDropdownOpen(false);
        setIsRbacOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleMemberSave = (_formData: RegisterMemberData, newMember: Member) => {
    setIsAddMemberOpen(false);
    alert(`नया कार्यकर्ता ${newMember.name} सफलतापूर्वक पंजीकृत किया गया।`);
  };

  const itemCls =
    "flex items-center justify-between gap-3 px-4 py-2.5 text-[15px] rounded-lg text-sidebar-foreground/90 hover:bg-sidebar-accent transition-colors";

  // Assembly constituencies list from sagarConstituencies GeoJSON
  const constituenciesList = useMemo(() => {
    return sagarConstituencies.features.map((f) => ({
      ac_no: f.properties.ac_no,
      ac_name: f.properties.ac_name,
      name_hi: f.properties.name_hi,
    })).sort((a, b) => a.ac_no - b.ac_no);
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { members: [], constituencies: [], booths: [], pages: [] };

    const matchedMembers = (searchCategory === "all" || searchCategory === "members")
      ? members.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.mobile.includes(q) ||
            m.role.toLowerCase().includes(q) ||
            m.booth.toLowerCase().includes(q) ||
            m.block.toLowerCase().includes(q)
        ).slice(0, 8)
      : [];

    const matchedConstituencies = (searchCategory === "all" || searchCategory === "constituencies")
      ? constituenciesList.filter(
          (c) =>
            c.name_hi.toLowerCase().includes(q) ||
            c.ac_name.toLowerCase().includes(q) ||
            c.ac_no.toString().includes(q)
        )
      : [];

    const matchedBooths = (searchCategory === "all" || searchCategory === "booths")
      ? booths.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.block.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q)
        ).slice(0, 6)
      : [];

    const matchedPages = (searchCategory === "all" || searchCategory === "pages")
      ? nav.filter(
          (n) => n.to && (n.label.toLowerCase().includes(q) || q.includes(n.label.toLowerCase()))
        )
      : [];

    return {
      members: matchedMembers,
      constituencies: matchedConstituencies,
      booths: matchedBooths,
      pages: matchedPages,
    };
  }, [searchQuery, searchCategory, constituenciesList]);

  const totalResultsCount =
    searchResults.members.length +
    searchResults.constituencies.length +
    searchResults.booths.length +
    searchResults.pages.length;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* TOP HEADER WITH WARM ORANGE GRADIENT FROM LEFT */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#FBD4B5] via-[#FFF3EB] to-card dark:from-orange-950/40 dark:via-background dark:to-card border-b border-border shadow-xs px-4 py-2">
        <div className="flex items-center gap-4">
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              aria-label="संगठन सेतु - कांग्रेस चुनाव चिन्ह"
              className="size-13 sm:size-14 rounded-full bg-white shadow-sm border border-orange-200/60 grid place-items-center shrink-0 overflow-hidden"
            >
              <img
                src="/logo.png"
                alt="संगठन सेतु - कांग्रेस चुनाव चिन्ह"
                className="size-11 sm:size-12 object-contain"
              />
            </span>
            <div>
              <div className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-primary leading-tight">
                संगठन सेतु - जिला कांग्रेस कमेटी सागर
              </div>
              <div className="text-xs sm:text-sm text-primary/80">मध्यप्रदेश | संगठन प्रबंधन CRM</div>
            </div>
          </div>

          {/* SEARCH BAR TRIGGER (DESKTOP) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsSearchOpen(true);
              }
            }}
            className="hidden xl:flex flex-1 max-w-md items-center gap-2 rounded-lg border border-border/80 bg-card/90 hover:bg-card hover:border-primary/50 px-3 py-2 text-sm text-muted-foreground cursor-pointer transition-all shadow-xs group"
          >
            <Search className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <span className="flex-1 text-sm text-muted-foreground/80 select-none truncate">
              कार्यकर्ता, बूथ, विधानसभा, ग्राम/वार्ड खोजें...
            </span>
            <kbd className="text-[11px] font-mono border border-border bg-muted/60 rounded px-1.5 py-0.5 text-muted-foreground shrink-0">
              Ctrl + K
            </kbd>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* MOBILE / TABLET SEARCH BUTTON */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="xl:hidden p-2 text-primary hover:bg-card/70 rounded-lg transition-colors"
              title="खोजें (Ctrl + K)"
            >
              <Search className="size-5" />
            </button>

            {/* VARTMAN CHETRA (CURRENT GEOGRAPHIC SCOPE) DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsAreaDropdownOpen(!isAreaDropdownOpen);
                  setIsRbacOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg border border-border/80 bg-card/90 hover:bg-card hover:border-primary/50 px-2.5 sm:px-3 py-1.5 shadow-xs transition-all text-left group"
                title="वर्तमान कार्यक्षेत्र देखें या बदलें"
              >
                <MapPin className="size-4 sm:size-4.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="leading-tight">
                  <div className="text-[10px] font-medium text-muted-foreground">वर्तमान क्षेत्र</div>
                  <div className="text-xs sm:text-sm font-semibold text-primary max-w-32 sm:max-w-40 truncate">
                    {currentRole.scopeBadge}
                  </div>
                </div>
                <ChevronDown
                  className={`size-3.5 sm:size-4 text-muted-foreground ml-1 transition-transform duration-200 ${
                    isAreaDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAreaDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAreaDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] rounded-xl border border-border bg-card shadow-2xl z-50 p-3 animate-in fade-in-50 zoom-in-95">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <MapPin className="size-4 text-primary" /> वर्तमान कार्यक्षेत्र (SCOPE SELECTION)
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {currentRole.scopeBadge}
                      </span>
                    </div>

                    {/* 5 Organizational Levels */}
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
                      संगठनात्मक स्तर अनुसार कार्यक्षेत्र
                    </div>
                    <div className="space-y-1 mb-3">
                      {allRoles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setCurrentRoleId(role.id);
                            setIsAreaDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg flex items-center justify-between gap-2.5 text-xs transition-colors ${
                            role.id === currentRole.id
                              ? "bg-primary/10 border border-primary/40 font-semibold text-primary"
                              : "hover:bg-muted/70 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={role.avatarUrl} alt={role.name} className="size-7 rounded-full object-cover shrink-0" />
                            <div className="truncate">
                              <div className="font-semibold text-xs">{role.scopeBadge}</div>
                              <div className="text-[11px] text-muted-foreground truncate">
                                {role.name} · {role.designation}
                              </div>
                            </div>
                          </div>
                          {role.id === currentRole.id ? (
                            <span className="text-[11px] text-primary shrink-0 font-bold flex items-center gap-1">
                              <Check className="size-3.5" /> सक्रिय
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/70 shrink-0">चुनें</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* 8 Assembly Constituencies Grid */}
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1 pt-2.5 border-t border-border">
                      सागर जिले की 8 विधानसभाएं (ASSEMBLY CONSTITUENCIES)
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {constituenciesList.map((ac) => {
                        const isSelectedAc =
                          currentRole.scopeBadge.includes(ac.name_hi) || currentRole.scopeBadge.includes(ac.ac_no.toString());
                        return (
                          <button
                            key={ac.ac_no}
                            type="button"
                            onClick={() => {
                              if (ac.ac_no === 37) {
                                setCurrentRoleId("assembly-president");
                              }
                              navigate({ to: "/" });
                              setIsAreaDropdownOpen(false);
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                              isSelectedAc
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : "border-border/70 hover:bg-muted/60 text-foreground"
                            }`}
                          >
                            <div className="truncate">
                              <div className="font-semibold">0{ac.ac_no} {ac.name_hi}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{ac.ac_name}</div>
                            </div>
                            <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0 ml-1" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* NOTIFICATIONS BELL */}
            <button type="button" className="relative p-2 text-primary hover:bg-card/70 rounded-lg transition-colors" title="सूचनाएं">
              <Bell className="size-5 sm:size-6" />
              <span className="absolute 0.5 top-0.5 right-0.5 size-4 sm:size-4.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                12
              </span>
            </button>

            {/* PROFILE / RBAC SWITCHER BUTTON */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsRbacOpen(!isRbacOpen);
                  setIsAreaDropdownOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-sm hover:bg-muted/60 text-left transition-colors"
              >
                <img src={currentRole.avatarUrl} alt={currentRole.name} className="size-8 sm:size-9 rounded-full object-cover" />
                <div className="hidden sm:block leading-tight">
                  <div className="font-semibold text-xs sm:text-sm text-foreground">{currentRole.name}</div>
                  <div className="text-[11px] text-muted-foreground max-w-36 truncate">{currentRole.designation}</div>
                </div>
                <ChevronDown className="size-3.5 sm:size-4 text-muted-foreground" />
              </button>

              {isRbacOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRbacOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] rounded-xl border border-border bg-card shadow-2xl z-50 p-2 animate-in fade-in-50 zoom-in-95">
                    <div className="p-3 border-b border-border">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Shield className="size-4 text-primary" /> सिस्टम भूमिका चयन (RBAC SWITCHER)
                      </div>
                    </div>
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60 py-1">
                      {allRoles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setCurrentRoleId(role.id);
                            setIsRbacOpen(false);
                          }}
                          className={`w-full text-left p-3 flex gap-3 items-start hover:bg-muted/60 transition-colors ${
                            role.id === currentRole.id ? "bg-primary/5 border-l-4 border-primary" : ""
                          }`}
                        >
                          <img src={role.avatarUrl} alt={role.name} className="size-9 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-xs">{role.name}</div>
                            <div className="text-xs text-primary">{role.designation}</div>
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{role.scopeDescription}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SCOPE BANNER */}
      {isScoped && (
        <div className="border-b border-border bg-warning/10 px-4 py-2 text-xs flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-warning" />
            <span>
              <strong>सक्रिय भूमिका:</strong> {currentRole.name} [{currentRole.designation}] ·{" "}
              <Eye className="inline size-3" /> दृश्य कार्यकर्ता: {scopedMembersCount} / {totalMembersCount}
            </span>
          </div>
          <button
            type="button"
            onClick={switchToSuperAdmin}
            className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[11px] hover:bg-primary/90 font-medium"
          >
            सुपर एडमिन
          </button>
        </div>
      )}

      {/* BODY CONTENT */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside className="bg-sidebar text-sidebar-foreground md:w-56 shrink-0 flex flex-col">
          <nav className="flex md:flex-col overflow-x-auto p-2 gap-1 pt-4">
            {nav
              .filter((n) => {
                if (n.minLevelRequired && currentRole.level > n.minLevelRequired) return false;
                if (n.requiresCapability && !n.requiresCapability(currentRole.capabilities)) return false;
                return true;
              })
              .map((n) => {
                const Icon = n.icon;
                const inner = (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon className="size-5 shrink-0" />
                      <span className="whitespace-nowrap">{n.label}</span>
                    </span>
                    {!n.exact && <ChevronRight className="size-4 opacity-60" />}
                  </>
                );
                return n.to ? (
                  <Link
                    key={n.label}
                    to={n.to}
                    activeOptions={{ exact: !!n.exact }}
                    className={itemCls}
                    activeProps={{
                      className: "!bg-sidebar-accent font-semibold border-l-4 border-saffron shadow",
                    }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button key={n.label} type="button" className={itemCls}>
                    {inner}
                  </button>
                );
              })}
          </nav>

          <div className="mt-auto m-3 rounded-lg border border-sidebar-border p-3 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="size-9 rounded-full bg-saffron grid place-items-center text-sidebar-foreground">
                <User className="size-5" />
              </span>
              <div className="leading-tight text-xs">
                <div>मध्यप्रदेश</div>
                <div className="text-sm font-semibold">जिला: सागर</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="size-4 text-saffron shrink-0" /> {currentRole.scopeBadge}
            </div>
            <button
              type="button"
              onClick={() => setIsAreaDropdownOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent hover:bg-sidebar-accent/80 py-2 text-xs font-semibold transition-colors"
            >
              क्षेत्र बदलें <ArrowRight className="size-3.5" />
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* GLOBAL SEARCH DIALOG MODAL (CTRL + K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-10 sm:pt-20 px-3 sm:px-4">
          <div
            className="fixed inset-0"
            onClick={() => setIsSearchOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in-50 zoom-in-95 z-10">
            {/* SEARCH INPUT BAR */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
              <Search className="size-5 text-primary shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="कार्यकर्ता, मोबाइल, बूथ संख्या, विधानसभा या पेज खोजें..."
                className="flex-1 bg-transparent text-sm sm:text-base outline-none text-foreground placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-muted-foreground hover:text-foreground rounded"
                >
                  <X className="size-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block text-[11px] font-mono border border-border bg-card px-2 py-0.5 rounded text-muted-foreground">
                ESC
              </kbd>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded sm:hidden"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* CATEGORY FILTER PILLS */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/60 bg-muted/10 overflow-x-auto text-xs">
              {[
                { id: "all", label: "सभी परिणाम" },
                { id: "members", label: "कार्यकर्ता (Members)" },
                { id: "constituencies", label: "विधानसभा (AC)" },
                { id: "booths", label: "बूथ (Booths)" },
                { id: "pages", label: "मॉड्यूल व पेज" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchCategory(tab.id as typeof searchCategory)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    searchCategory === tab.id
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SEARCH RESULTS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* DEFAULT STATE: SHORTCUTS & SUGGESTIONS */}
              {!searchQuery.trim() && (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      त्वरित नेविगेशन एवं पेज
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {nav
                        .filter((n) => n.to)
                        .slice(0, 6)
                        .map((n) => {
                          const Icon = n.icon;
                          return (
                            <button
                              key={n.label}
                              type="button"
                              onClick={() => {
                                if (n.to) navigate({ to: n.to });
                                setIsSearchOpen(false);
                              }}
                              className="flex items-center gap-3 p-2.5 rounded-lg border border-border/70 hover:bg-muted/70 text-left transition-colors"
                            >
                              <div className="size-8 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0">
                                <Icon className="size-4" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{n.label}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      सागर विधानसभा क्षेत्र (8 विधानसभाएं)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {constituenciesList.map((ac) => (
                        <button
                          key={ac.ac_no}
                          type="button"
                          onClick={() => {
                            if (ac.ac_no === 37) setCurrentRoleId("assembly-president");
                            navigate({ to: "/" });
                            setIsSearchOpen(false);
                          }}
                          className="p-2 rounded-lg border border-border/70 hover:bg-muted/70 text-left text-xs transition-colors"
                        >
                          <div className="font-semibold text-foreground">0{ac.ac_no} {ac.name_hi}</div>
                          <div className="text-[10px] text-muted-foreground">{ac.ac_name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentRole.capabilities.canAddMember && (
                    <div className="pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setIsAddMemberOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary font-semibold text-sm transition-colors border border-primary/20"
                      >
                        <UserPlus className="size-4" /> नया कार्यकर्ता पंजीकृत करें (+ सदस्य जोड़ें)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SEARCH RESULTS DISPLAY */}
              {searchQuery.trim() && (
                <>
                  {totalResultsCount === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Search className="size-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">"{searchQuery}" के लिए कोई परिणाम नहीं मिला</p>
                      <p className="text-xs mt-1 text-muted-foreground/80">
                        कृपया नाम, मोबाइल नंबर, विधानसभा या बूथ संख्या की जांच करें
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* MEMBERS */}
                      {searchResults.members.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Contact className="size-3.5 text-primary" /> कार्यकर्ता ({searchResults.members.length})
                          </div>
                          <div className="divide-y divide-border/60 rounded-lg border border-border overflow-hidden bg-card">
                            {searchResults.members.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  navigate({ to: "/members" });
                                  setIsSearchOpen(false);
                                }}
                                className="w-full p-2.5 flex items-center justify-between gap-3 text-left hover:bg-muted/60 transition-colors text-xs"
                              >
                                <div className="min-w-0">
                                  <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                                    {m.name}
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-normal">
                                      {m.role}
                                    </span>
                                  </div>
                                  <div className="text-muted-foreground text-[11px] mt-0.5">
                                    📞 {m.mobile} · {m.booth} ({m.block})
                                  </div>
                                </div>
                                <span className="text-[11px] text-primary shrink-0 font-medium">देखें →</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CONSTITUENCIES */}
                      {searchResults.constituencies.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Landmark className="size-3.5 text-primary" /> विधानसभा क्षेत्र ({searchResults.constituencies.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {searchResults.constituencies.map((ac) => (
                              <button
                                key={ac.ac_no}
                                type="button"
                                onClick={() => {
                                  if (ac.ac_no === 37) setCurrentRoleId("assembly-president");
                                  navigate({ to: "/" });
                                  setIsSearchOpen(false);
                                }}
                                className="p-2.5 rounded-lg border border-border hover:bg-muted/60 text-left transition-colors flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-semibold text-sm text-foreground">0{ac.ac_no} {ac.name_hi}</div>
                                  <div className="text-xs text-muted-foreground">{ac.ac_name} · सागर जिला</div>
                                </div>
                                <ChevronRight className="size-4 text-muted-foreground/60 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* BOOTHS */}
                      {searchResults.booths.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Vote className="size-3.5 text-primary" /> मतदान केंद्र / बूथ ({searchResults.booths.length})
                          </div>
                          <div className="divide-y divide-border/60 rounded-lg border border-border overflow-hidden bg-card">
                            {searchResults.booths.map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => {
                                  navigate({ to: "/tasks" });
                                  setIsSearchOpen(false);
                                }}
                                className="w-full p-2.5 flex items-center justify-between gap-3 text-left hover:bg-muted/60 transition-colors text-xs"
                              >
                                <div>
                                  <div className="font-semibold text-sm text-foreground">{b.name}</div>
                                  <div className="text-muted-foreground text-[11px] mt-0.5">
                                    ब्लॉक: {b.block} · मतदाता: {b.voters} · स्थिति: {b.status}
                                  </div>
                                </div>
                                <span className="text-[11px] text-primary shrink-0 font-medium">बूथ विवरण →</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PAGES */}
                      {searchResults.pages.length > 0 && (
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText className="size-3.5 text-primary" /> पृष्ठ व मॉड्यूल ({searchResults.pages.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {searchResults.pages.map((p) => {
                              const Icon = p.icon;
                              return (
                                <button
                                  key={p.label}
                                  type="button"
                                  onClick={() => {
                                    if (p.to) navigate({ to: p.to });
                                    setIsSearchOpen(false);
                                  }}
                                  className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/60 text-left transition-colors"
                                >
                                  <div className="size-7 rounded bg-primary/10 text-primary grid place-items-center shrink-0">
                                    <Icon className="size-4" />
                                  </div>
                                  <span className="text-sm font-semibold text-foreground">{p.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>सुझाव: त्वरित खोलने हेतु कीबोर्ड से <kbd className="font-mono bg-card px-1 rounded border">Ctrl + K</kbd> दबाएं</span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="hover:text-foreground font-medium"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      <RegisterMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} onSave={handleMemberSave} />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="border-b border-border bg-card px-6 py-5 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: "success" | "warning" | "destructive" | "muted";
  children: ReactNode;
}) {
  const map = {
    success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20",
    destructive: "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/20",
    muted: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export const btn =
  "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors";
