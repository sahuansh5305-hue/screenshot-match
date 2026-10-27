import { useState } from "react";
import { UserPlus, X, Save, CheckCircle2 } from "lucide-react";
import { type Member } from "@/lib/data";

export interface RegisterMemberData {
  // 1. Hierarchical Assignment
  areaType: "rural" | "urban"; // ग्रामीण | शहरी
  vidhanSabha: string;
  blockMunicipality: string;
  mandalam: string;
  gramPanchayatWard: string;
  boothNo: string;
  status: "सत्यापित (Verified)" | "सत्यापन लंबित (Pending)" | "अस्वीकृत (Rejected)";

  // 2. Personal & Contact Information
  hindiName: string;
  englishName: string;
  mobile: string;
  email: string;
  emergencyPhone: string;
  voterId: string;
  casteEquation: string;
  gender: string;
  bloodGroup: string;
  age: string;
  address: string;
  profession: string;
  education: string;

  // 3. Designation & BLA Authorization
  designation: string;
  wing: string;
  isBlaAuthorized: boolean;
  fieldNotes: string;
}

export const sagarVidhanSabhas = [
  "37 - सुरखी",
  "35 - बीना",
  "36 - खुरई",
  "38 - देवरी",
  "39 - रहली",
  "40 - नरयावली",
  "41 - सागर",
  "42 - बंडा",
];

export const casteCategories = [
  "OBC (अन्य पिछड़ा वर्ग)",
  "सामान्य (General)",
  "SC (अनुसूचित जाति)",
  "ST (अनुसूचित जनजाति)",
  "अल्पसंख्यक (Minority)",
  "अन्य",
];

export const designationsList = [
  "सक्रिय कार्यकर्ता",
  "बूथ संयोजक / बीएलए-1",
  "बीएलए-2 (सहायक बीएलए)",
  "मंडलम अध्यक्ष (Mandalam Adhyaksh)",
  "सेक्टर एवं पंचायत प्रभारी",
  "ब्लॉक एवं नगर अध्यक्ष",
  "जिला पदाधिकारी (DCC Office Bearer)",
  "युवा मोर्चा पदाधिकारी",
  "महिला मोर्चा पदाधिकारी",
  "आईटी एवं सोशल मीडिया प्रभारी",
  "किसान मोर्चा प्रतिनिधि",
];

export const wingsList = [
  "मुख्य संगठन",
  "युवा कांग्रेस (Youth Congress)",
  "महिला कांग्रेस (Mahila Congress)",
  "एनएसयूआई (NSUI)",
  "सेवा दल (Seva Dal)",
  "आईटी एवं सोशल मीडिया सेल",
  "किसान कांग्रेस",
  "एससी / एसटी विभाग",
  "ओबीसी विभाग",
  "अल्पसंख्यक विभाग",
];

interface RegisterMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: RegisterMemberData, convertedMember: Member) => void;
}

export function RegisterMemberModal({ isOpen, onClose, onSave }: RegisterMemberModalProps) {
  const [formData, setFormData] = useState<RegisterMemberData>({
    areaType: "rural",
    vidhanSabha: "37 - सुरखी",
    blockMunicipality: "राहतगढ़ ब्लॉक",
    mandalam: "सीहोरा मंडलम",
    gramPanchayatWard: "ग्राम पंचायत सीहोरा खास",
    boothNo: "101",
    status: "सत्यापित (Verified)",

    hindiName: "",
    englishName: "",
    mobile: "",
    email: "",
    emergencyPhone: "",
    voterId: "",
    casteEquation: "OBC (अन्य पिछड़ा वर्ग)",
    gender: "पुरुष (Male)",
    bloodGroup: "B+",
    age: "35",
    address: "",
    profession: "",
    education: "",

    designation: "सक्रिय कार्यकर्ता",
    wing: "मुख्य संगठन",
    isBlaAuthorized: true,
    fieldNotes: "कार्यकर्ता की जमीनी पकड़, चुनावी अनुभव, सामाजिक प्रभाव इत्यादि...",
  });

  const [touched, setTouched] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const cleanHindiName = formData.hindiName.trim();
    const displayName = cleanHindiName || formData.englishName.trim();
    const newId = `कजपा-सागर-${Math.floor(1000 + Math.random() * 9000)}`;

    const convertedStatus: Member["status"] =
      formData.status.includes("सत्यापित")
        ? "सक्रिय"
        : formData.status.includes("लंबित")
          ? "लंबित"
          : "निष्क्रिय";

    const convertedMember: Member = {
      id: newId,
      name: displayName,
      designation: formData.designation,
      unit: formData.vidhanSabha.split("-")[1]?.trim() || "सुरखी",
      phone: formData.mobile || "+91 9800000000",
      status: convertedStatus,
      joined: new Date().toISOString().split("T")[0]!,
    };

    onSave(formData, convertedMember);
    onClose();
  };

  const inputClass =
    "w-full bg-card border border-border text-foreground px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-colors";
  const selectClass =
    "w-full bg-card border border-border text-foreground px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-card border border-border shadow-2xl rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col my-auto text-card-foreground animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-border flex items-center justify-between bg-primary/5 rounded-t-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif leading-tight flex items-center gap-2">
                नया कार्यकर्ता पंजीकरण <span className="text-xs font-normal text-muted-foreground font-sans">(Register Member)</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                सागर जिला कांग्रेस कमेटी • संगठनात्मक एवं बीएलए डेटा प्रविष्टि
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
          {/* Section 1: Hierarchical Assignment */}
          <div className="border border-border/80 rounded-lg p-4 bg-muted/20 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-2.5">
              <span className="font-semibold text-xs tracking-wide uppercase text-primary">
                1. संगठनात्मक दायित्व एवं क्षेत्र (HIERARCHICAL ASSIGNMENT)
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">ट्रैक:</span>
                <div className="inline-flex rounded-md p-0.5 bg-muted border border-border">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaType: "rural" })}
                    className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                      formData.areaType === "rural"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ग्रामीण
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaType: "urban" })}
                    className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                      formData.areaType === "urban"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    शहरी
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  विधानसभा *
                </label>
                <select
                  className={selectClass}
                  value={formData.vidhanSabha}
                  onChange={(e) => setFormData({ ...formData, vidhanSabha: e.target.value })}
                >
                  {sagarVidhanSabhas.map((vs) => (
                    <option key={vs} value={vs}>
                      {vs}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  ब्लॉक / नगर पालिका
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.blockMunicipality}
                  onChange={(e) => setFormData({ ...formData, blockMunicipality: e.target.value })}
                  placeholder="उदा. राहतगढ़ ब्लॉक"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  मंडलम
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.mandalam}
                  onChange={(e) => setFormData({ ...formData, mandalam: e.target.value })}
                  placeholder="उदा. सीहोरा मंडलम"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  ग्राम पंचायत / वार्ड
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.gramPanchayatWard}
                  onChange={(e) => setFormData({ ...formData, gramPanchayatWard: e.target.value })}
                  placeholder="उदा. ग्राम पंचायत सीहोरा खास"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  मतदान केंद्र क्र (Booth No) *
                </label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  value={formData.boothNo}
                  onChange={(e) => setFormData({ ...formData, boothNo: e.target.value })}
                  placeholder="उदा. 101"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  सत्यापन स्थिति (Status)
                </label>
                <select
                  className={selectClass}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as RegisterMemberData["status"],
                    })
                  }
                >
                  <option value="सत्यापित (Verified)">सत्यापित (Verified)</option>
                  <option value="सत्यापन लंबित (Pending)">सत्यापन लंबित (Pending)</option>
                  <option value="अस्वीकृत (Rejected)">अस्वीकृत (Rejected)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Contact Information */}
          <div className="border border-border/80 rounded-lg p-4 bg-muted/20 space-y-4">
            <div className="font-semibold text-xs tracking-wide uppercase text-primary border-b border-border/60 pb-2">
              2. व्यक्तिगत विवरण (PERSONAL & CONTACT INFORMATION)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  हिंदी नाम (Hindi Name) *
                </label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  value={formData.hindiName}
                  onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                  placeholder="उदा. राजेंद्र सिंह यादव"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  अंग्रेजी नाम (English Name) *
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.englishName}
                  onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                  placeholder="e.g. Rajendra Singh Yadav"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  मोबाइल नंबर (Mobile) *
                </label>
                <input
                  type="tel"
                  required
                  minLength={10}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className={inputClass}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                  placeholder="10 अंक मोबाइल"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-foreground mb-1">
                  वोटर ID / EPIC संख्या
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.voterId}
                  onChange={(e) => setFormData({ ...formData, voterId: e.target.value })}
                  placeholder="MP/37/214/..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  जाति वर्ग (Caste Equation) *
                </label>
                <select
                  className={selectClass}
                  value={formData.casteEquation}
                  onChange={(e) => setFormData({ ...formData, casteEquation: e.target.value })}
                >
                  {casteCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  लिंग (Gender)
                </label>
                <select
                  className={selectClass}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="पुरुष (Male)">पुरुष (Male)</option>
                  <option value="महिला (Female)">महिला (Female)</option>
                  <option value="अन्य (Other)">अन्य (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  रक्त समूह / आयु
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    className={selectClass}
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    <option value="B+">B+</option>
                    <option value="A+">A+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="B-">B-</option>
                    <option value="A-">A-</option>
                    <option value="O-">O-</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    className={inputClass}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="35"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                स्थाई निवास पता (Full Address)
              </label>
              <input
                type="text"
                className={inputClass}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="सागर जिला (म.प्र.)"
              />
            </div>
          </div>

          {/* Section 3: Designation & BLA Authorization */}
          <div className="border border-border/80 rounded-lg p-4 bg-muted/20 space-y-4">
            <div className="font-semibold text-xs tracking-wide uppercase text-primary border-b border-border/60 pb-2">
              3. संगठनात्मक पद एवं बीएलए अधिकृतिकरण (DESIGNATION & BLA)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  पद (Designation) *
                </label>
                <select
                  className={selectClass}
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                >
                  {designationsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  संगठन मोर्चा / विंग (Wing) *
                </label>
                <select
                  className={selectClass}
                  value={formData.wing}
                  onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                >
                  {wingsList.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BLA Authorization Checkbox Box */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-3">
              <input
                type="checkbox"
                id="bla_auth"
                checked={formData.isBlaAuthorized}
                onChange={(e) => setFormData({ ...formData, isBlaAuthorized: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
              />
              <label htmlFor="bla_auth" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                मतदान केंद्र पर बूथ लेवल एजेंट (BLA) अधिकृत करें
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                संगठनात्मक टिप्पणी (Field Intel Notes)
              </label>
              <textarea
                rows={2}
                className={inputClass}
                value={formData.fieldNotes}
                onChange={(e) => setFormData({ ...formData, fieldNotes: e.target.value })}
                placeholder="कार्यकर्ता की जमीनी पकड़, चुनावी अनुभव, सामाजिक प्रभाव इत्यादि..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted font-medium transition-colors"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-95 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              कार्यकर्ता जोड़ें (Save Member)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
