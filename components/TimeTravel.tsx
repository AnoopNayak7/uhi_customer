"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ChevronRight } from "lucide-react";

interface TimeTravelPoint {
  year: number;
  price: number;
  appreciation: number;
}

const TimeTravel = () => {
  // Mock data for time travel points
  const [timeTravelPoints] = useState<TimeTravelPoint[]>([
    { year: 2018, price: 8500000, appreciation: 0 },
    { year: 2020, price: 9800000, appreciation: 15.3 },
    { year: 2022, price: 11500000, appreciation: 17.3 },
    { year: 2024, price: 13000000, appreciation: 13.0 },
    { year: 2026, price: 14800000, appreciation: 13.8 },
  ]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center mb-4">
        <Clock className="w-5 h-5 mr-2 text-red-500" />
        <h2 className="text-xl font-semibold">Property Time Travel</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        See how this property&apos;s value has changed over time and projected
        future value
      </p>

      <div className="relative">
        {/* Timeline */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>

        {/* Time Points */}
        <div className="space-y-6">
          {timeTravelPoints.map((point, index) => (
            <div key={index} className="flex items-start">
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  index === timeTravelPoints.length - 1
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {index === timeTravelPoints.length - 1 ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>

              <Card
                className={`flex-1 ${
                  index === timeTravelPoints.length - 1
                    ? "border-red-200 bg-red-50"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{point.year}</div>
                      <div className="text-lg font-bold">
                        {formatPrice(point.price)}
                      </div>
                    </div>

                    {index > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Appreciation
                        </div>
                        <div className="text-green-600 font-medium">
                          +{point.appreciation}%
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Note: Historical values are based on market trends and actual
        transaction data. Future projections are estimates based on current
        growth rates and may vary.
      </p>
    </div>
  );
};

export default TimeTravel;
