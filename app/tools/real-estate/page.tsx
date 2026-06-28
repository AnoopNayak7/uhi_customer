"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RealEstateToolsHub } from "@/components/tools/real-estate-tools-hub";

export default function RealEstateToolsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />
      <main className="flex-1">
        <RealEstateToolsHub />
      </main>
      <Footer />
    </div>
  );
}
