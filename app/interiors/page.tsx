import { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { InteriorsPageClient } from "@/components/interiors/interiors-page-client";

export const metadata: Metadata = {
  title: "Interior Design Services in Bengaluru | Urbanhousein",
  description:
    "End-to-end interior design for apartments and homes in Bengaluru. Custom layouts, 3D visualization, modular kitchens, wardrobes and complete home interiors.",
  keywords:
    "interior design Bengaluru, home interiors, modular kitchen, wardrobe design, apartment interiors, Urbanhousein interiors",
  openGraph: {
    title: "Interior Design Services | Urbanhousein",
    description:
      "Crafting dream spaces with end-to-end interior design solutions in Bengaluru.",
    type: "website",
  },
};

export default function InteriorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <InteriorsPageClient />
      <Footer />
    </div>
  );
}
