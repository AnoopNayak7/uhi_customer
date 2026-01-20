"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PropertyVastu, getRoomConfig, getDirectionConfig } from "@/lib/vastu-types";
import { getScoreGradient } from "@/lib/vastu-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  Star,
  Home,
  Bed,
  Wind,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface VastuScoreSectionProps {
  vastu?: PropertyVastu;
  propertyId?: string;
  compact?: boolean;
}

export function VastuScoreSection({ vastu, propertyId, compact = false }: VastuScoreSectionProps) {
  const [expanded, setExpanded] = React.useState(false);

  if (!vastu) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center py-4">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700 mb-2">Vastu Score Not Available</h3>
            <p className="text-sm text-gray-500 mb-4">
              Vastu compliance data is not available for this property yet.
            </p>
            <Link href="/tools/vastu-checker">
              <Button variant="outline" size="sm" className="gap-2">
                <Compass className="w-4 h-4" />
                Check Vastu Compliance
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { score, data } = vastu;
  const entryDirection = getDirectionConfig(data.mainEntry);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Excellent":
        return "bg-green-100 text-green-700 border-green-200";
      case "Good":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Average":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Poor":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br", getScoreGradient(score.overall))}>
          <span className="text-white font-bold text-sm">{score.overall}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Vastu Score</span>
            <Badge className={cn("text-xs", getGradeColor(score.grade))}>
              {score.grade}
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            Entry: {entryDirection?.fullName} | {data.rooms.length} rooms analyzed
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Header with gradient based on score */}
      <div className={cn("p-6 bg-gradient-to-r text-white", getScoreGradient(score.overall))}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{score.overall}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Vastu Compliance Score</h3>
              <Badge className="mt-1 bg-white/20 text-white border-white/30">
                {score.grade}
              </Badge>
            </div>
          </div>
          <Compass className="w-10 h-10 opacity-50" />
        </div>
      </div>

      <CardContent className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <Compass className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600">{score.breakdown.entryScore}</div>
            <div className="text-xs text-gray-600">Entry</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <Home className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">{score.breakdown.roomPlacementScore}</div>
            <div className="text-xs text-gray-600">Rooms</div>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-xl">
            <Bed className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-indigo-600">{score.breakdown.sleepingDirectionScore}</div>
            <div className="text-xs text-gray-600">Sleeping</div>
          </div>
          <div className="text-center p-3 bg-teal-50 rounded-xl">
            <Wind className="w-5 h-5 text-teal-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-teal-600">{score.breakdown.openSpaceScore}</div>
            <div className="text-xs text-gray-600">Spaces</div>
          </div>
        </div>

        {/* Entry Direction */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-700">Main Entry Direction</span>
          </div>
          <Badge className={cn(
            score.breakdown.entryScore >= 90 ? "bg-green-100 text-green-700" :
            score.breakdown.entryScore >= 60 ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          )}>
            {entryDirection?.fullName}
          </Badge>
        </div>

        {/* Compliant/Non-compliant summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-700">Compliant</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {score.compliantItems.length}
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-700">Needs Attention</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {score.nonCompliantItems.length}
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-between"
        >
          <span>View Details</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {expanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
            {/* Room Analysis */}
            {score.roomScores.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Room Analysis</h4>
                <div className="space-y-2">
                  {score.roomScores.map((room) => {
                    const config = getRoomConfig(room.roomType);
                    const dirConfig = getDirectionConfig(room.direction);
                    return (
                      <div
                        key={room.roomId}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg",
                          room.isIdeal ? "bg-green-50" :
                          room.isAcceptable ? "bg-yellow-50" :
                          "bg-red-50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {room.isIdeal ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : room.isAcceptable ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">{config?.label}</span>
                        </div>
                        <span className="text-sm text-gray-600">{dirConfig?.fullName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Recommendations */}
            {score.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Top Recommendations</h4>
                <div className="space-y-2">
                  {score.recommendations.slice(0, 3).map((rec) => (
                    <div
                      key={rec.id}
                      className={cn(
                        "p-3 rounded-lg text-sm",
                        rec.severity === "high" ? "bg-red-50 border border-red-200" :
                        rec.severity === "medium" ? "bg-yellow-50 border border-yellow-200" :
                        "bg-blue-50 border border-blue-200"
                      )}
                    >
                      <div className="font-medium">{rec.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{rec.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/tools/vastu-checker">
            <Button variant="outline" className="w-full gap-2">
              <Compass className="w-4 h-4" />
              Analyze Your Own Property
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact badge for property cards
export function VastuScoreBadge({ score, size = "sm" }: { score?: number; size?: "sm" | "md" }) {
  if (score === undefined || score === null) return null;

  const getGrade = (s: number) => {
    if (s >= 85) return { label: "Excellent", color: "bg-green-500" };
    if (s >= 70) return { label: "Good", color: "bg-emerald-500" };
    if (s >= 50) return { label: "Average", color: "bg-yellow-500" };
    if (s >= 30) return { label: "Poor", color: "bg-orange-500" };
    return { label: "Critical", color: "bg-red-500" };
  };

  const grade = getGrade(score);

  if (size === "sm") {
    return (
      <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium", grade.color)}>
        <Compass className="w-3 h-3" />
        <span>{score}</span>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium", grade.color)}>
      <Compass className="w-4 h-4" />
      <span>Vastu: {score}/100</span>
    </div>
  );
}
