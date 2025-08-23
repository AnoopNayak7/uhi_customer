"use client";

import { Inter, Montserrat, Manrope } from "next/font/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const FontShowcase = () => {
  const sampleText = "Find Your Dream Home";
  const bodyText =
    "Discover exceptional properties with our AI-powered search. Your perfect home is just a few clicks away.";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Font Comparison - Airbnb Cereal Alternatives
      </h1>

      {/* Manrope - Closest to Airbnb Cereal */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">
            Manrope ⭐ (Closest to Airbnb Cereal - Currently Active)
          </CardTitle>
        </CardHeader>
        <CardContent className={manrope.className}>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">{sampleText}</h2>
            <h3 className="text-2xl font-semibold">
              Modern • Clean • Friendly
            </h3>
            <p className="text-lg">{bodyText}</p>
            <div className="flex gap-4 text-sm">
              <span className="font-light">Light 200</span>
              <span className="font-normal">Regular 400</span>
              <span className="font-medium">Medium 500</span>
              <span className="font-semibold">Semibold 600</span>
              <span className="font-bold">Bold 700</span>
              <span className="font-extrabold">Extra Bold 800</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Montserrat */}
      <Card>
        <CardHeader>
          <CardTitle>Montserrat (Geometric Sans-serif)</CardTitle>
        </CardHeader>
        <CardContent className={montserrat.className}>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">{sampleText}</h2>
            <h3 className="text-2xl font-semibold">
              Geometric • Professional • Versatile
            </h3>
            <p className="text-lg">{bodyText}</p>
            <div className="flex gap-4 text-sm">
              <span className="font-light">Light</span>
              <span className="font-normal">Regular</span>
              <span className="font-medium">Medium</span>
              <span className="font-semibold">Semibold</span>
              <span className="font-bold">Bold</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inter */}
      <Card>
        <CardHeader>
          <CardTitle>Inter (UI Optimized)</CardTitle>
        </CardHeader>
        <CardContent className={inter.className}>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">{sampleText}</h2>
            <h3 className="text-2xl font-semibold">
              Screen Optimized • Readable • Technical
            </h3>
            <p className="text-lg">{bodyText}</p>
            <div className="flex gap-4 text-sm">
              <span className="font-light">Light</span>
              <span className="font-normal">Regular</span>
              <span className="font-medium">Medium</span>
              <span className="font-semibold">Semibold</span>
              <span className="font-bold">Bold</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Note */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">
            Why Manrope is closest to Airbnb Cereal:
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • <strong>Geometric structure:</strong> Similar rounded
              letterforms and consistent spacing
            </li>
            <li>
              • <strong>Friendly appearance:</strong> Approachable and modern
              feel like Cereal
            </li>
            <li>
              • <strong>Multiple weights:</strong> 7 weights from ExtraLight to
              ExtraBold
            </li>
            <li>
              • <strong>Great readability:</strong> Optimized for both display
              and body text
            </li>
            <li>
              • <strong>Professional yet warm:</strong> Perfect for real estate
              branding
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
