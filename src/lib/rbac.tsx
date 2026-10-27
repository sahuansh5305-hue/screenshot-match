import bhupendraPhoto from "@/assets/bhupendra-mohasa.png";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface RoleCapability {
  id: string;
  name: string;
  category: "data" | "cadre" | "campaign" | "tasks" | "admin";
  description: string;
}

export interface UserRole {
  id: string;
  name: string;
  designation: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelLabel: string;
  tierName: string;
  scopeBadge: string;
  scopeDescription: string;
  avatarUrl: string;
  isSuperAdmin: boolean;
  votersCount: number;
  boothsCount: number;
  vidhanSabha?: string;
  block?: string;
  mandal?: string;
  boothNo?: string;
  boothLocation?: string;
  capabilities: {
    viewScope: "सम्पूर्ण जिला (All 8)" | "विधानसभा (037 सुरखी)" | "ब्लॉक (राहतगढ़)" | "मंडलम (सीहोरा)" | "बूथ 101 (सीहोरा)";
    canAddMember: boolean;
    canEditCadre: boolean;
    canDeleteCadre: boolean;
    canVerifyBla: boolean;
    canBroadcast: "समस्त जिला व वि.स." | "विधानसभा स्तर" | "ब्लॉक स्तर" | "अनुमति नहीं";
    canAssignTasks: boolean;
    canExportReports: boolean;
    canManageRoles: boolean;
  };
}

export const USER_ROLES: UserRole[] = [
  {
    id: "dcc-president",
    name: "Bhupendra Mohasa",
    designation: "सिस्टम एडमिन (System Admin)",
    level: 1,
    levelLabel: "जिला स्तर (District Level)",
    tierName: "जिला कांग्रेस कमेटी (DCC)",
    scopeBadge: "सम्पूर्ण सागर जिला (All 8)",
    scopeDescription:
      "पूर्ण जिला अधिकार: सागर जिले की सभी 8 विधानसभाओं, 18 ब्लॉकों, 130 मंडलमों एवं 2,183 मतदान केंद्रों का पूर्ण नियंत्रण। प्रशासकीय, संपादन, संदेश प्रसारण, एवं सदस्य प्रबंधन के पूर्ण अधिकार।",
    avatarUrl: bhupendraPhoto,
    isSuperAdmin: true,
    votersCount: 1684500,
    boothsCount: 2183,
    capabilities: {
      viewScope: "सम्पूर्ण जिला (All 8)",
      canAddMember: true,
      canEditCadre: true,
      canDeleteCadre: true,
      canVerifyBla: true,
      canBroadcast: "समस्त जिला व वि.स.",
      canAssignTasks: true,
      canExportReports: true,
      canManageRoles: true,
    },
  },
  {
    id: "assembly-president",
    name: "Neeraj Sharma",
    designation: "विधानसभा अध्यक्ष (037 सुरखी)",
    level: 2,
    levelLabel: "विधानसभा स्तर (Assembly Level)",
    tierName: "विधानसभा ब्लॉक कांग्रेस",
    scopeBadge: "विधानसभा 037 - सुरखी",
    scopeDescription:
      "विधानसभा स्तर अधिकार: केवल 037-सुरखी क्षेत्र (राहतगढ़ एवं जैसीनगर ब्लॉक, 295 मतदान केंद्र)। अन्य विधानसभाओं का डेटा सीमित/रीड-ओनली। अपने वि.स. क्षेत्र के कार्यकर्ताओं का प्रबंधन व कार्य आवंटन।",
    avatarUrl: "https://images.unsplash.com/photo-1611619668988-9dd258b42ed3?w=200&auto=format&fit=crop&q=80",
    isSuperAdmin: false,
    votersCount: 224300,
    boothsCount: 295,
    vidhanSabha: "037-सुरखी",
    capabilities: {
      viewScope: "विधानसभा (037 सुरखी)",
      canAddMember: true,
      canEditCadre: true,
      canDeleteCadre: false,
      canVerifyBla: true,
      canBroadcast: "विधानसभा स्तर",
      canAssignTasks: true,
      canExportReports: true,
      canManageRoles: false,
    },
  },
  {
    id: "block-president",
    name: "Dilip Singh Rajput",
    designation: "ब्लॉक अध्यक्ष (राहतगढ़)",
    level: 3,
    levelLabel: "ब्लॉक स्तर (Block Level)",
    tierName: "ब्लॉक कांग्रेस कमेटी",
    scopeBadge: "राहतगढ़ ब्लॉक",
    scopeDescription:
      "ब्लॉक स्तर अधिकार: केवल राहतगढ़ विकासखंड के अंतर्गत आने वाले 3 मंडलमों (सीहोरा, बरखेड़ी, चंद्रपुर) एवं संबद्ध 42 ग्राम पंचायतों का प्रबंधन। ब्लॉक कार्यकर्ताओं का सत्यापन व स्थानीय अभियान संचालन।",
    avatarUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80",
    isSuperAdmin: false,
    votersCount: 94200,
    boothsCount: 118,
    vidhanSabha: "037-सुरखी",
    block: "राहतगढ़",
    capabilities: {
      viewScope: "ब्लॉक (राहतगढ़)",
      canAddMember: true,
      canEditCadre: true,
      canDeleteCadre: false,
      canVerifyBla: true,
      canBroadcast: "ब्लॉक स्तर",
      canAssignTasks: true,
      canExportReports: true,
      canManageRoles: false,
    },
  },
  {
    id: "mandal-president",
    name: "Kamal Kishore Dangi",
    designation: "मंडलम अध्यक्ष (सीहोरा)",
    level: 4,
    levelLabel: "मंडलम स्तर (Mandal Level)",
    tierName: "मंडलम कांग्रेस कमेटी",
    scopeBadge: "सीहोरा मंडलम",
    scopeDescription:
      "मंडलम स्तर अधिकार: सीहोरा मंडलम की 6 ग्राम पंचायतों एवं 18 मतदान केंद्रों (बूथ 101 से 118) तक सीमित प्रबंधन। बूथ कार्यकर्ताओं की नियुक्ति अनुशंसा एवं स्थानीय बैठकें।",
    avatarUrl: "https://plus.unsplash.com/premium_photo-1682092090968-3b9daa5ecdd0?w=200&auto=format&fit=crop&q=80",
    isSuperAdmin: false,
    votersCount: 15150,
    boothsCount: 18,
    vidhanSabha: "037-सुरखी",
    block: "राहतगढ़",
    mandal: "सीहोरा",
    capabilities: {
      viewScope: "मंडलम (सीहोरा)",
      canAddMember: true,
      canEditCadre: false,
      canDeleteCadre: false,
      canVerifyBla: true,
      canBroadcast: "अनुमति नहीं",
      canAssignTasks: false,
      canExportReports: false,
      canManageRoles: false,
    },
  },
  {
    id: "booth-coordinator",
    name: "Bhanu Pratap Singh Dangi",
    designation: "बूथ संयोजक / बीएलए-1",
    level: 5,
    levelLabel: "बूथ स्तर (Booth Level)",
    tierName: "बूथ प्रबंधन समिति",
    scopeBadge: "बूथ 101 - सीहोरा",
    scopeDescription:
      "बूथ स्तर अधिकार: केवल बूथ 101 (शासकीय उ.मा. विद्यालय सीहोरा कक्ष 1) के 842 मतदाताओं एवं स्थानीय कार्यकर्ताओं की सूची दृश्यमान। केवल पठन/सत्यापन अधिकार।",
    avatarUrl: "https://plus.unsplash.com/premium_photo-1770660306212-ab28df3a7dfa?w=200&auto=format&fit=crop&q=80",
    isSuperAdmin: false,
    votersCount: 842,
    boothsCount: 1,
    vidhanSabha: "037-सुरखी",
    block: "राहतगढ़",
    mandal: "सीहोरा",
    boothNo: "101",
    boothLocation: "शासकीय उ.मा. विद्यालय सीहोरा कक्ष 1",
    capabilities: {
      viewScope: "बूथ 101 (सीहोरा)",
      canAddMember: false,
      canEditCadre: false,
      canDeleteCadre: false,
      canVerifyBla: true,
      canBroadcast: "अनुमति नहीं",
      canAssignTasks: false,
      canExportReports: false,
      canManageRoles: false,
    },
  },
];

interface RbacContextType {
  currentRole: UserRole;
  setCurrentRoleId: (roleId: string) => void;
  allRoles: UserRole[];
  switchToSuperAdmin: () => void;
  isScoped: boolean;
  totalMembersCount: number;
  scopedMembersCount: number;
}

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export function RbacProvider({ children }: { children: ReactNode }) {
  // Default to Booth Coordinator as shown in the screenshot, or save in localStorage if available
  const [currentRoleId, setCurrentRoleIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sagar_cadre_role_v3");
      if (saved && USER_ROLES.some((r) => r.id === saved)) {
        return saved;
      }
    }
    return "dcc-president"; // System Admin: Bhupendra Mohasa
  });

  const setCurrentRoleId = (id: string) => {
    setCurrentRoleIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("sagar_cadre_role_v3", id);
    }
  };

  const currentRole = USER_ROLES.find((r) => r.id === currentRoleId) || USER_ROLES[0]!;

  const switchToSuperAdmin = () => {
    setCurrentRoleId("dcc-president");
  };

  const isScoped = currentRole.level > 1;

  // Total members in database is 35; for booth-coordinator it is 5 (matching 5 / 35 in screenshot)
  const totalMembersCount = 35;
  const scopedMembersCount =
    currentRole.level === 5 ? 5 : currentRole.level === 4 ? 12 : currentRole.level === 3 ? 18 : currentRole.level === 2 ? 26 : 35;

  return (
    <RbacContext.Provider
      value={{
        currentRole,
        setCurrentRoleId,
        allRoles: USER_ROLES,
        switchToSuperAdmin,
        isScoped,
        totalMembersCount,
        scopedMembersCount,
      }}
    >
      {children}
    </RbacContext.Provider>
  );
}

export function useRbac() {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error("useRbac must be used within an RbacProvider");
  }
  return context;
}
