import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
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
} from "lucide-react";
import { useRbac } from "@/lib/rbac";
import { RegisterMemberModal, type RegisterMemberData } from "@/components/RegisterMemberModal";
import { type Member } from "@/lib/data";
import logo from "@/assets/congress-logo.png";

interface NavItem {
  to?: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}

const nav: NavItem[] = [
  { to: "/", label: "डैशबोर्ड", icon: Home, exact: true },
  { to: "/members", label: "कार्यकर्ता निर्देशिका", icon: Contact },
  { to: "/organization", label: "संगठनात्मक संरचना", icon: Network },
  { to: "/broadcast", label: "संदेश एवं अभियान", icon: Megaphone },
  { to: "/tasks", label: "बूथ एवं BLA", icon: Vote },
  { to: "/war-room", label: "कार्य एवं ट्रैकिंग", icon: ListChecks },
  { to: "/grievances", label: "जन समस्याएं", icon: MessageCircleWarning },
  { to: "/outreach", label: "सदस्यता अभियान", icon: CalendarCheck },
  { to: "/events", label: "आयोजन", icon: CalendarDays },
  { to: "/reports", label: "रिपोर्ट एवं विश्लेषण", icon: BarChart3 },
  { label: "प्रशासन", icon: Landmark },
  { label: "मास्टर डेटा", icon: Database },
  { label: "सहायता", icon: HelpCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { currentRole, setCurrentRoleId, allRoles, switchToSuperAdmin, isScoped, scopedMembersCount, totalMembersCount } =
    useRbac();
  const [isRbacOpen, setIsRbacOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleMemberSave = (_formData: RegisterMemberData, newMember: Member) => {
    setIsAddMemberOpen(false);
    alert(`नया कार्यकर्ता ${newMember.name} सफलतापूर्वक पंजीकृत किया गया।`);
  };

  const itemCls =
    "flex items-center justify-between gap-3 px-4 py-2.5 text-[15px] rounded-lg text-sidebar-foreground/90 hover:bg-sidebar-accent transition-colors";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 tricolor-wash border-b border-border shadow-sm px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="कांग्रेस चिन्ह" width={56} height={56} className="size-14 rounded-full bg-card shadow" />
            <div>
              <div className="font-serif text-xl lg:text-2xl font-bold text-primary leading-tight">
                संगठन सेतु - जिला कांग्रेस कमेटी सागर
              </div>
              <div className="text-sm text-primary/80">मध्यप्रदेश | संगठन प्रबंधन CRM</div>
            </div>
          </div>

          <div className="hidden xl:flex flex-1 max-w-md items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            <Search className="size-4" />
            <input
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="कार्यकर्ता, बूथ, विधानसभा, ग्राम/वार्ड खोजें..."
            />
            <kbd className="text-[11px] border border-border rounded px-1.5 py-0.5">Ctrl + K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
              <MapPin className="size-5 text-primary" />
              <div className="leading-tight">
                <div className="text-[11px] text-muted-foreground">वर्तमान क्षेत्र</div>
                <div className="text-sm font-semibold text-primary">{currentRole.scopeBadge}</div>
              </div>
              <ChevronDown className="size-4 text-muted-foreground ml-2" />
            </div>

            <button type="button" className="relative p-2 text-primary" title="सूचनाएं">
              <Bell className="size-6" />
              <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                12
              </span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRbacOpen(!isRbacOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-2.5 py-1.5 shadow-sm hover:bg-muted/60 text-left"
              >
                <img src={currentRole.avatarUrl} alt={currentRole.name} className="size-10 rounded-full object-cover" />
                <div className="hidden sm:block leading-tight">
                  <div className="font-semibold text-sm text-foreground">{currentRole.name}</div>
                  <div className="text-xs text-muted-foreground max-w-44 truncate">{currentRole.designation}</div>
                </div>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              {isRbacOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRbacOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] rounded-xl border border-border bg-card shadow-2xl z-50 p-2">
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
                          className={`w-full text-left p-3 flex gap-3 items-start hover:bg-muted/60 ${
                            role.id === currentRole.id ? "bg-primary/5 border-l-4 border-primary" : ""
                          }`}
                        >
                          <img src={role.avatarUrl} alt={role.name} className="size-9 rounded-full object-cover" />
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
            className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[11px]"
          >
            सुपर एडमिन
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside className="bg-sidebar text-sidebar-foreground md:w-56 shrink-0 flex flex-col">
          <nav className="flex md:flex-col overflow-x-auto p-2 gap-1 pt-4">
            {nav.map((n) => {
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
              <span className="size-9 rounded-full bg-saffron grid place-items-center">
                <User className="size-5" />
              </span>
              <div className="leading-tight text-xs">
                <div>मध्यप्रदेश</div>
                <div className="text-sm">जिला: सागर</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="size-4" /> {currentRole.scopeBadge}
            </div>
            <button
              type="button"
              onClick={() => setIsRbacOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent py-2 text-xs font-semibold"
            >
              क्षेत्र बदलें <ArrowRight className="size-3.5" />
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>

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
