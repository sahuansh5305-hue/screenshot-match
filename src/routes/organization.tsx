import { createFileRoute } from "@tanstack/react-router";
import { OrganizationTree } from "@/components/OrganizationTree";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "संगठन – संगठन सेतु" },
      { name: "description", content: "सागर जिले के ब्लॉक और पदाधिकारियों की संगठन संरचना।" },
      { property: "og:title", content: "संगठन – संगठन सेतु" },
      { property: "og:description", content: "सागर जिले के ब्लॉक और पदाधिकारियों की संगठन संरचना।" },
    ],
  }),
  component: Org,
});

function Org() {
  return (
    <>
      <PageHeader title="संगठन संरचना" subtitle="मध्य प्रदेश › सागर जिला › ब्लॉक › पदाधिकारी" />
      <div className="p-6"><OrganizationTree /></div>
    </>
  );
}
