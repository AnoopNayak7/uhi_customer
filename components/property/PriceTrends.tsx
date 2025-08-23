import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface PriceTrendsProps {
  priceHistoryData: any[];
  formatPrice: (price: number) => string;
}

export const PriceTrends = ({
  priceHistoryData,
  formatPrice,
}: PriceTrendsProps) => {
  // Calculate statistics
  const currentPrice = priceHistoryData[priceHistoryData.length - 1].price;
  const initialPrice = priceHistoryData[0].price;
  const priceChange = currentPrice - initialPrice;
  const percentageChange = (priceChange / initialPrice) * 100;
  const isPositive = percentageChange >= 0;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const value = data.value;
      const growth = data.payload.growth;

      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <div
              className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                growth >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {growth >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {growth >= 0 ? "+" : ""}
              {growth}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Price</span>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(value)}
              </span>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="flex items-center justify-center pt-1">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  growth >= 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-gray-500">
                Year-over-year growth
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      id="price-trends"
      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div
            className={`p-2 rounded-lg mr-3 ${
              isPositive ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Price Trends
            </h3>
            <p className="text-sm text-gray-500">
              Historical price performance
            </p>
          </div>
        </div>

        <div className="flex items-center px-3 py-1.5 rounded-full bg-gray-50">
          <Activity className="w-4 h-4 mr-1.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50" />
          <div className="relative">
            <div className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wide">
              Current Price
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </div>
            <div className="text-xs text-blue-600 mt-1">Latest valuation</div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden p-4 rounded-xl border ${
            priceChange >= 0
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-100"
          }`}
        >
          <div
            className={`absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-50 ${
              priceChange >= 0 ? "bg-green-100" : "bg-red-100"
            }`}
          />
          <div className="relative">
            <div
              className={`text-xs font-medium mb-2 uppercase tracking-wide ${
                priceChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Price Change
            </div>
            <div
              className={`text-xl sm:text-2xl font-bold ${
                priceChange >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {formatPrice(Math.abs(priceChange))}
            </div>
            <div
              className={`text-xs mt-1 ${
                priceChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Since inception
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden p-4 rounded-xl border ${
            percentageChange >= 0
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-100"
          }`}
        >
          <div
            className={`absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-50 ${
              percentageChange >= 0 ? "bg-green-100" : "bg-red-100"
            }`}
          />
          <div className="relative">
            <div
              className={`text-xs font-medium mb-2 uppercase tracking-wide ${
                percentageChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Growth Rate
            </div>
            <div
              className={`text-xl sm:text-2xl font-bold flex items-center ${
                percentageChange >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {percentageChange >= 0 ? (
                <TrendingUp className="w-5 h-5 mr-1" />
              ) : (
                <TrendingDown className="w-5 h-5 mr-1" />
              )}
              {percentageChange >= 0 ? "+" : ""}
              {Math.abs(percentageChange).toFixed(1)}%
            </div>
            <div
              className={`text-xs mt-1 ${
                percentageChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Total return
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-transparent to-gray-50/50 rounded-xl" />
        <div className="relative h-[280px] sm:h-[320px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceHistoryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="50%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "#059669" : "#dc2626"}
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? "#10b981" : "#ef4444"}
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                dx={-10}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="price"
                stroke="url(#strokeGradient)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrice)"
                filter="url(#glow)"
                dot={{
                  fill: isPositive ? "#10b981" : "#ef4444",
                  strokeWidth: 3,
                  stroke: "#fff",
                  r: 4,
                  filter: "url(#glow)",
                }}
                activeDot={{
                  r: 6,
                  fill: isPositive ? "#10b981" : "#ef4444",
                  stroke: "#fff",
                  strokeWidth: 3,
                  filter: "url(#glow)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                isPositive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-600 font-medium">
              Price Movement
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {priceHistoryData.length} data points
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </section>
  );
};
