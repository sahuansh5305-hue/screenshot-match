import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TaskChart } from "@/components/DataCharts";
import { PageHeader, Badge, btn } from "@/components/AppShell";
import { formatDate, tasks as initialTasks, blocks } from "@/lib/data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "कार्य – संगठन सेतु" },
      { name: "description", content: "जिले की इकाइयों के कार्य आवंटन और अनुवर्ती कार्य।" },
      { property: "og:title", content: "कार्य – संगठन सेतु" },
      { property: "og:description", content: "जिले की इकाइयों के कार्य आवंटन और अनुवर्ती कार्य।" },
    ],
  }),
  component: Tasks,
});

const cols = ["करना है", "प्रगति में", "समय सीमा पार", "पूर्ण"];

type TaskItem = {
  id: number;
  title: string;
  unit: string;
  owner: string;
  due: string;
  status: string;
  priority: string;
};

function Tasks() {
  const [taskList, setTaskList] = useState<TaskItem[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    unit: "सागर",
    owner: "",
    due: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]!,
    priority: "उच्च",
    status: "करना है",
  });

  const inputClass = "border bg-card px-3 py-2 text-sm rounded-sm w-full";

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.owner.trim()) return;

    const newTask: TaskItem = {
      id: Date.now(),
      title: formData.title.trim(),
      unit: formData.unit,
      owner: formData.owner.trim(),
      due: formData.due,
      status: formData.status,
      priority: formData.priority,
    };

    setTaskList([newTask, ...taskList]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      unit: "सागर",
      owner: "",
      due: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]!,
      priority: "उच्च",
      status: "करना है",
    });
    setNotification(`नया कार्य "${newTask.title}" सफलतापूर्वक सौंपा गया!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <>
      <PageHeader
        title="कार्य और जिम्मेदारियाँ"
        subtitle="ब्लॉकवार कार्य की स्थिति"
        action={
          <button className={btn} onClick={() => setIsModalOpen(true)}>
            + कार्य सौंपें
          </button>
        }
      />

      {notification && (
        <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm px-4 py-3 rounded-sm flex items-center justify-between">
          <span>✓ {notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-emerald-700 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <div className="px-6 pt-6"><TaskChart /></div>
      <div className="p-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cols.map((c) => (
          <section key={c} className="bg-muted rounded-sm p-3">
            <h2 className="text-sm font-sans font-semibold uppercase tracking-wider mb-3 px-1">
              {c} <span className="text-muted-foreground">({taskList.filter((t) => t.status === c).length})</span>
            </h2>
            <div className="space-y-2">
              {taskList.filter((t) => t.status === c).map((t) => (
                <div key={t.id} className="panel p-3 text-sm">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.unit} · {t.owner}</div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge tone={t.priority === "उच्च" ? "destructive" : t.priority === "मध्यम" ? "warning" : "muted"}>
                      {t.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">अंतिम तिथि {formatDate(t.due)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Task Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border shadow-xl rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold">नया कार्य सौंपें</h3>
                <p className="text-xs text-muted-foreground">ब्लॉक इकाई या कार्यकर्ता को नया दायित्व आवंटित करें</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-lg px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium mb-1">कार्य का शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. बूथ समिति सत्यापन – वार्ड 8"
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">जिम्मेदार व्यक्ति / प्रभारी *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल यादव"
                  className={inputClass}
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">ब्लॉक</label>
                  <select
                    className={inputClass}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    {blocks.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">प्राथमिकता</label>
                  <select
                    className={inputClass}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="उच्च">उच्च</option>
                    <option value="मध्यम">मध्यम</option>
                    <option value="निम्न">निम्न</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">अंतिम तिथि</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={formData.due}
                    onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">स्थिति</label>
                  <select
                    className={inputClass}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {cols.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-sm border hover:bg-muted"
                >
                  रद्द करें
                </button>
                <button type="submit" className={btn}>
                  कार्य सौंपें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
