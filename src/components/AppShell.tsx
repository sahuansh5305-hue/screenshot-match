import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Network,
  Send,
  ClipboardCheck,
  UserPlus,
  Shield,
  ShieldAlert,
  ChevronDown,
  RotateCw,
  Lock,
  Eye,
  Flame,
  MessageSquareWarning,
  UserCheck,
  Calendar,
  FileText,
} from "lucide-react";
import { useRbac } from "@/lib/rbac";
import { RegisterMemberModal, type RegisterMemberData } from "@/components/RegisterMemberModal";
import { type Member } from "@/lib/data";

interface NavItem {
  to: string;
  label: string;
  sublabel?: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

export function AppShell({ children }: { children: ReactNode }) {
  const {
    currentRole,
    setCurrentRoleId,
    allRoles,
    switchToSuperAdmin,
    isScoped,
    scopedMembersCount,
    totalMembersCount,
  } = useRbac();

  const [isRbacOpen, setIsRbacOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const mainNav: NavItem[] = [
    {
      to: "/",
      label: "संगठन अवलोकन",
      sublabel: "KPI Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/members",
      label: "कार्यकर्ता निर्देशिका",
      sublabel: "Cadre Directory",
      icon: Users,
      badge: scopedMembersCount,
    },
    {
      to: "/organization",
      label: "संगठनात्मक संरचना",
      sublabel: "Hierarchy & RBAC",
      icon: Network,
    },
    {
      to: "/broadcast",
      label: "संदेश एवं अभियान केंद्र",
      sublabel: "Broadcast & Campaign",
      icon: Send,
    },
    {
      to: "/tasks",
      label: "बूथ प्रबंधन एवं BLA",
      sublabel: "Booth & BLA Review",
      icon: ClipboardCheck,
    },
  ];

  const secondaryNav: NavItem[] = [
    { to: "/war-room", label: "वॉर रूम", icon: Flame },
    { to: "/grievances", label: "जन समस्या", icon: MessageSquareWarning },
    { to: "/outreach", label: "सदस्यता अभियान", icon: UserCheck },
    { to: "/events", label: "आयोजन", icon: Calendar },
    { to: "/reports", label: "प्रतिवेदन", icon: FileText },
  ];

  const handleMemberSave = (_formData: RegisterMemberData, newMember: Member) => {
    setIsAddMemberOpen(false);
    alert(`नया कार्यकर्ता ${newMember.name} सफलतापूर्वक पंजीकृत किया गया।`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" key={refreshKey}>
      {/* 1. TOP HEADER (Matches Screenshot) */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 py-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-xs shrink-0 select-none">
              ✋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-foreground leading-tight">
                  जिला कांग्रेस कमेटी सागर
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded border border-border bg-muted/60 text-muted-foreground">
                  म.प्र.
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                MPCC Karyakarta Connect | संगठनात्मक प्रबंधन पोर्टल (Cadre CRM)
              </p>
            </div>
          </div>

          {/* Center Jurisdiction Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs">
            <span className="text-muted-foreground">निर्धारित क्षेत्र:</span>
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span>{currentRole.scopeBadge}</span>
              <Lock className="size-3 text-muted-foreground" />
            </div>
          </div>

          {/* Right User & RBAC Pill */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRbacOpen(!isRbacOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors shadow-xs text-left"
              >
                <img
                  src={currentRole.avatarUrl}
                  alt={currentRole.name}
                  className="size-8 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs leading-none text-foreground">
                      {currentRole.name}
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-xs leading-none">
                      RBAC
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 font-medium leading-tight">
                    {currentRole.designation}
                  </div>
                </div>
                <ChevronDown className="size-3.5 text-muted-foreground ml-1" />
              </button>

              {/* RBAC SWITCHER DROPDOWN */}
              {isRbacOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsRbacOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] rounded-xl border border-border bg-card text-card-foreground shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in-50 zoom-in-95">
                    <div className="p-3 border-b border-border bg-muted/30 rounded-t-lg">
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Shield className="size-4 text-primary" />
                        <span>सिस्टम भूमिका चयन (RBAC SWITCHER)</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        विभिन्न संगठनात्मक स्तरों (जिला, वि.स., ब्लॉक, मंडलम, बूथ) के डेटा दृश्यता का लाइव परीक्षण करें।
                      </p>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60 py-1">
                      {allRoles.map((role) => {
                        const isSelected = role.id === currentRole.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => {
                              setCurrentRoleId(role.id);
                              setIsRbacOpen(false);
                            }}
                            className={`w-full text-left p-3 flex gap-3 items-start transition-colors hover:bg-muted/60 ${
                              isSelected ? "bg-primary/5 border-l-4 border-primary" : ""
                            }`}
                          >
                            <img
                              src={role.avatarUrl}
                              alt={role.name}
                              className="size-9 rounded-full object-cover shrink-0 ring-1 ring-border mt-0.5"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-xs text-foreground">
                                  {role.name}
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                    सक्रिय
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-medium text-primary mt-0.5">
                                {role.designation}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                                {role.scopeDescription}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              title="रिफ्रेश करें"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCw className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SCOPED RBAC NOTICE BANNER (Matches Screenshot) */}
      {isScoped && (
        <div className="border-b border-amber-200/60 bg-amber-50/80 dark:bg-amber-950/20 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 flex-wrap shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert className="size-4 text-amber-600 shrink-0" />
            <div className="leading-snug">
              <span className="font-semibold">प्रतिबंधित डाउनवर्ड स्कोप (Scoped RBAC View):</span>{" "}
              <span>
                सक्रिय भूमिका: <strong className="font-semibold">{currentRole.name}</strong> [
                {currentRole.designation}].
              </span>{" "}
              <span className="inline-flex items-center gap-1 font-medium bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded text-[11px]">
                <Eye className="size-3" /> दृश्य कार्यकर्ता: {scopedMembersCount} / {totalMembersCount}
              </span>{" "}
              <span className="text-amber-800 dark:text-amber-300">
                {currentRole.scopeDescription}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <span className="text-[11px] opacity-75">त्वरित रोल स्विच:</span>
            <button
              type="button"
              onClick={switchToSuperAdmin}
              className="px-2 py-0.5 rounded bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors text-[11px]"
            >
              सुपर एडमिन
            </button>
          </div>
        </div>
      )}

      {/* 3. APP BODY WITH SIDEBAR AND MAIN CONTENT */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="bg-card text-card-foreground md:w-64 md:min-h-[calc(100vh-65px)] shrink-0 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border/80">
            <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              मुख्य मेनू (MAIN MODULES)
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex md:flex-col overflow-x-auto p-2 gap-1">
            {mainNav.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-muted/70 transition-colors group"
                  activeProps={{
                    className:
                      "bg-primary/10 text-primary font-semibold border-l-4 border-primary rounded-l-none",
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="size-4 shrink-0 opacity-70 group-hover:opacity-100" />
                    <div>
                      <div className="leading-tight text-xs font-semibold">{n.label}</div>
                      {n.sublabel && (
                        <div className="text-[10px] text-muted-foreground leading-none mt-0.5 font-normal">
                          {n.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {n.badge !== undefined && (
                    <span className="text-[11px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full group-hover:bg-primary/20 group-hover:text-primary">
                      {n.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary Modules */}
          <div className="p-2 border-t border-border/60">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              अन्य सेवाएँ (SERVICES)
            </div>
            <div className="mt-1 flex md:flex-col gap-0.5">
              {secondaryNav.map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    activeProps={{
                      className: "bg-muted text-foreground font-medium",
                    }}
                  >
                    <Icon className="size-3.5 opacity-70" />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Add Member Action */}
          <div className="mt-auto p-4 border-t border-border/80">
            <button
              type="button"
              onClick={() => setIsAddMemberOpen(true)}
              disabled={!currentRole.capabilities.canAddMember}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                currentRole.capabilities.canAddMember
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              }`}
              title={
                currentRole.capabilities.canAddMember
                  ? "नया कार्यकर्ता जोड़ें"
                  : "इस भूमिका में नया कार्यकर्ता जोड़ने की अनुमति नहीं है"
              }
            >
              <UserPlus className="size-4" />
              <span>+ नया कार्यकर्ता जोड़ें (Add Member)</span>
            </button>
            {!currentRole.capabilities.canAddMember && (
              <p className="text-[10px] text-center text-muted-foreground mt-1.5">
                (वर्तमान भूमिका केवल पठन/सत्यापन स्तर पर है)
              </p>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <RegisterMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSave={handleMemberSave}
      />
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
