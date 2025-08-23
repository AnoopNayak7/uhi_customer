"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FontShowcase } from "@/components/ui/font-showcase";
import { PageContent } from "@/components/animations/layout-wrapper";

export default function FontShowcasePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <PageContent>
          <div className="py-12">
            <FontShowcase />
          </div>
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
