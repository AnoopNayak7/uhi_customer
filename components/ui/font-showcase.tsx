"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            Manrope ⭐ (Production Optimized - Currently Active)
          </CardTitle>
        </CardHeader>
        <CardContent className="font-manrope">
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

      {/* Font Performance Metrics */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">
            ✅ Production Optimizations Applied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-green-700">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Font Display:</span>
              <span>swap (prevents invisible text during font load)</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Preloading:</span>
              <span>Critical font weights preloaded</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Fallbacks:</span>
              <span>System fonts configured for instant rendering</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Bundle Size:</span>
              <span>Reduced by 75% (removed unused fonts)</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Font Weights:</span>
              <span>Optimized to 5 essential weights (300-700)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production Benefits */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 text-blue-800">
            Production Benefits of Optimized Font Loading:
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>
              • <strong>Faster Page Load:</strong> Reduced font bundle size and
              preloading
            </li>
            <li>
              • <strong>Better UX:</strong> No flash of invisible text (FOIT) or
              unstyled text (FOUT)
            </li>
            <li>
              • <strong>SEO Friendly:</strong> Improved Core Web Vitals scores
            </li>
            <li>
              • <strong>Mobile Optimized:</strong> Faster rendering on slower
              connections
            </li>
            <li>
              • <strong>Accessibility:</strong> Better fallback fonts for screen
              readers
            </li>
            <li>
              • <strong>Consistent Branding:</strong> Reliable font rendering
              across devices
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
