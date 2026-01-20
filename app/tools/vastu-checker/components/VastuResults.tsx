"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  VastuScore,
  VastuInput,
  getRoomConfig,
  getDirectionConfig,
} from "@/lib/vastu-types";
import {
  getScoreColor,
  getScoreBgColor,
  getScoreGradient,
} from "@/lib/vastu-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  Check,
  X,
  AlertTriangle,
  Info,
  Compass,
  Home,
  Bed,
  Sun,
  Wind,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";

interface VastuResultsProps {
  score: VastuScore;
  input: VastuInput;
  onReset: () => void;
}

export function VastuResults({ score, input, onReset }: VastuResultsProps) {
  // Prepare radar chart data
  const radarData = [
    { name: "Entry", score: score.breakdown.entryScore, fullMark: 100 },
    { name: "Rooms", score: score.breakdown.roomPlacementScore, fullMark: 100 },
    { name: "Sleeping", score: score.breakdown.sleepingDirectionScore, fullMark: 100 },
    { name: "Spaces", score: score.breakdown.openSpaceScore, fullMark: 100 },
  ];

  // Severity colors
  const severityColors = {
    high: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", icon: X },
    medium: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", icon: AlertTriangle },
    low: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", icon: Info },
  };

  // Pie chart data for room scores
  const roomPieData = score.roomScores.map((room) => {
    const config = getRoomConfig(room.roomType);
    return {
      name: config?.label || room.roomType,
      value: room.score,
      fill: room.isIdeal ? "#22c55e" : room.isAcceptable ? "#eab308" : "#ef4444",
    };
  });

  const getGradeColor = (grade: VastuScore["grade"]) => {
    switch (grade) {
      case "Excellent":
        return "text-green-600";
      case "Good":
        return "text-emerald-600";
      case "Average":
        return "text-yellow-600";
      case "Poor":
        return "text-orange-600";
      case "Critical":
        return "text-red-600";
    }
  };

  const getGradeBg = (grade: VastuScore["grade"]) => {
    switch (grade) {
      case "Excellent":
        return "from-green-500 to-emerald-600";
      case "Good":
        return "from-emerald-500 to-teal-600";
      case "Average":
        return "from-yellow-500 to-amber-600";
      case "Poor":
        return "from-orange-500 to-red-500";
      case "Critical":
        return "from-red-500 to-red-700";
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Vastu Compliance Score",
      text: `My property scored ${score.overall}/100 on Vastu compliance! Check your property's Vastu score.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`
      );
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall Score Card */}
      <Card className="overflow-hidden border-0 shadow-2xl">
        <div className={cn("p-8 bg-gradient-to-br", getGradeBg(score.grade))}>
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Vastu Analysis Complete
            </div>
            <div className="relative inline-block">
              <div className="text-8xl md:text-9xl font-bold mb-2">
                {score.overall}
              </div>
              <div className="absolute -right-8 top-4 text-3xl font-light opacity-80">
                /100
              </div>
            </div>
            <div className="text-2xl font-semibold mb-2">{score.grade}</div>
            <p className="text-white/80 max-w-md mx-auto">
              {score.grade === "Excellent" &&
                "Your property follows Vastu principles excellently!"}
              {score.grade === "Good" &&
                "Your property has good Vastu compliance with minor improvements possible."}
              {score.grade === "Average" &&
                "Your property has moderate Vastu compliance. Consider the recommendations below."}
              {score.grade === "Poor" &&
                "Your property needs significant Vastu corrections. Follow the recommendations."}
              {score.grade === "Critical" &&
                "Your property has major Vastu issues. Consult a Vastu expert."}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Compass className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {score.breakdown.entryScore}
              </div>
              <div className="text-xs text-gray-600">Entry Direction</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {score.breakdown.roomPlacementScore}
              </div>
              <div className="text-xs text-gray-600">Room Placement</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-xl">
              <Bed className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-600">
                {score.breakdown.sleepingDirectionScore}
              </div>
              <div className="text-xs text-gray-600">Sleeping Direction</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-xl">
              <Wind className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-600">
                {score.breakdown.openSpaceScore}
              </div>
              <div className="text-xs text-gray-600">Open Spaces</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}/100`, "Score"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Room Scores */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Room-wise Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {score.roomScores.length > 0 ? (
              <div className="space-y-3">
                {score.roomScores.map((room) => {
                  const config = getRoomConfig(room.roomType);
                  const dirConfig = getDirectionConfig(room.direction);

                  return (
                    <div
                      key={room.roomId}
                      className={cn(
                        "p-3 rounded-xl border-2 flex items-center justify-between",
                        room.isIdeal
                          ? "border-green-200 bg-green-50/50"
                          : room.isAcceptable
                          ? "border-yellow-200 bg-yellow-50/50"
                          : "border-red-200 bg-red-50/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            room.isIdeal
                              ? "bg-green-100"
                              : room.isAcceptable
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          )}
                        >
                          {room.isIdeal ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : room.isAcceptable ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{config?.label}</div>
                          <div className="text-sm text-gray-500">
                            {dirConfig?.fullName}
                          </div>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-xl font-bold",
                          room.isIdeal
                            ? "text-green-600"
                            : room.isAcceptable
                            ? "text-yellow-600"
                            : "text-red-600"
                        )}
                      >
                        {room.score}%
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No rooms were added to analyze
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compliant & Non-Compliant Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compliant Items */}
        <Card className="border-0 shadow-xl border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Shield className="w-5 h-5" />
              Vastu Compliant ({score.compliantItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {score.compliantItems.length > 0 ? (
                score.compliantItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-green-50 rounded-lg"
                  >
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No fully compliant items found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Non-Compliant Items */}
        <Card className="border-0 shadow-xl border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Needs Attention ({score.nonCompliantItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {score.nonCompliantItems.length > 0 ? (
                score.nonCompliantItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-800">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Great! No major issues found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {score.recommendations.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Recommendations ({score.recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {score.recommendations.map((rec, index) => {
                const styles = severityColors[rec.severity];
                const Icon = styles.icon;

                return (
                  <div
                    key={rec.id}
                    className={cn(
                      "p-4 rounded-xl border-2",
                      styles.bg,
                      styles.border
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          rec.severity === "high"
                            ? "bg-red-100"
                            : rec.severity === "medium"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            rec.severity === "high"
                              ? "text-red-600"
                              : rec.severity === "medium"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            {rec.title}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full font-medium uppercase",
                              rec.severity === "high"
                                ? "bg-red-200 text-red-800"
                                : rec.severity === "medium"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-blue-200 text-blue-800"
                            )}
                          >
                            {rec.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {rec.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 text-xs">
                          <div className="flex items-center gap-1 text-gray-500">
                            <span className="font-medium">Current:</span>
                            <span>{rec.currentState}</span>
                          </div>
                          <span className="hidden sm:inline text-gray-300">|</span>
                          <div className="flex items-center gap-1 text-green-600">
                            <span className="font-medium">Ideal:</span>
                            <span>{rec.idealState}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="px-8 py-6 text-lg border-2"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Analyze Another Property
        </Button>
        <Button
          onClick={handleShare}
          className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Results
        </Button>
      </div>
    </div>
  );
}
