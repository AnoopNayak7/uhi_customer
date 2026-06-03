"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Scale,
  FileText,
  Star,
  MapPin,
  Building2,
  Calendar,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "in_progress" | "completed" | "error";

interface ReportStep {
  id: string;
  label: string;
  status: StepStatus;
  message?: string | null;
}

interface ReraReport {
  reraId: string;
  originalReraId?: string;
  reraDetails: {
    propertyName?: string;
    projectName?: string;
    promoterName?: string;
    address?: string;
    location?: string;
    district?: string;
    city?: string;
    possessionDate?: string;
    registrationDate?: string;
    projectStatus?: string;
    documents?: { name: string; description?: string; type?: string }[];
    summary?: string;
    reraPortalUrl?: string;
    dataFound?: boolean;
  };
  googleReviews: {
    source?: string;
    placeName?: string;
    address?: string;
    averageRating?: number | null;
    totalReviews?: number;
    reviews?: {
      author: string;
      rating: number;
      text: string;
      relativeTime?: string;
    }[];
  };
  litigations: {
    caseTitle: string;
    court: string;
    status: string;
    year?: string;
    summary?: string;
    sourceUrl?: string;
  }[];
  litigationSummary?: string;
  fetchedAt?: string;
}

const INITIAL_STEPS: ReportStep[] = [
  { id: "rera", label: "Fetching RERA registration & documents", status: "pending" },
  { id: "reviews", label: "Checking ratings & reviews", status: "pending" },
  { id: "litigations", label: "Checking court records & litigations", status: "pending" },
];

export default function ReraCheckPage() {
  const [reraId, setReraId] = useState("");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<ReportStep[]>(INITIAL_STEPS);
  const [report, setReport] = useState<ReraReport | null>(null);
  const [cached, setCached] = useState(false);

  const animateStepsWhileLoading = useCallback(() => {
    setSteps(
      INITIAL_STEPS.map((s, i) => ({
        ...s,
        status: i === 0 ? "in_progress" : "pending",
      }))
    );

    const t1 = setTimeout(() => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === "rera"
            ? { ...s, status: "completed" }
            : s.id === "reviews"
              ? { ...s, status: "in_progress" }
              : s
        )
      );
    }, 4000);

    const t2 = setTimeout(() => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === "reviews"
            ? { ...s, status: "completed" }
            : s.id === "litigations"
              ? { ...s, status: "in_progress" }
              : s
        )
      );
    }, 12000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const runSearch = async (forceRefresh = false) => {
    const trimmed = reraId.trim();
    if (trimmed.length < 8) {
      toast.error("Please enter a valid RERA registration number");
      return;
    }

    setLoading(true);
    setReport(null);
    const clearTimers = animateStepsWhileLoading();

    try {
      const res: any = await apiClient.lookupReraCheck(trimmed, forceRefresh);
      if (!res?.success) {
        toast.error(res?.message || "Failed to fetch report");
        setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "error" })));
        return;
      }

      let data = res.data;
      let reportData = data?.report || null;

      if (reportData && !reportData.reraDetails?.dataFound && data?.cached && !forceRefresh) {
        toast.message("Refreshing outdated report…");
        const refreshRes: any = await apiClient.lookupReraCheck(trimmed, true);
        if (refreshRes?.success) {
          data = refreshRes.data;
          reportData = data?.report || null;
        }
      }

      setCached(!!data?.cached);
      setReport(reportData);

      if (data?.steps?.length) {
        setSteps(
          data.steps.map((s: ReportStep) => ({
            ...s,
            status: (s.status as StepStatus) || "completed",
          }))
        );
      } else {
        setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "completed" })));
      }

      toast.success(
        data?.cached
          ? "Loaded saved report"
          : "Property report ready"
      );
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
      setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "error" })));
    } finally {
      clearTimers();
      setLoading(false);
    }
  };

  const rd = report?.reraDetails;
  const gr = report?.googleReviews;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>

          <div className="text-center mb-8">
            <Badge className="mb-3 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Karnataka RERA
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              RERA Property Check
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
              Enter your RERA registration number to view project details,
              documents, reviews, and litigation records.
            </p>
          </div>

          <Card className="mb-8 border-emerald-100 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={reraId}
                    onChange={(e) => setReraId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && runSearch()}
                    placeholder="e.g. PRM/KA/RERA/1251/308/PR/171220/005988"
                    className="pl-10 h-12 text-base"
                    style={{ fontSize: "16px" }}
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={() => runSearch()}
                  disabled={loading}
                  className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {(loading || steps.some((s) => s.status !== "pending")) && (
            <Card className="mb-8 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {loading && <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />}
                  Getting all the details for you
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <StepIcon status={step.status} index={index + 1} />
                      {index < steps.length - 1 && (
                        <div className="w-px flex-1 min-h-[24px] bg-border my-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p
                        className={cn(
                          "font-medium text-sm",
                          step.status === "in_progress" && "text-emerald-700",
                          step.status === "completed" && "text-gray-900",
                          step.status === "error" && "text-destructive"
                        )}
                      >
                        Step {index + 1}: {step.label}
                      </p>
                      {step.message && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {report && !loading && !report.reraDetails?.dataFound && (
            <Card className="border-amber-200 bg-amber-50/80 mb-6">
              <CardContent className="p-6 text-center space-y-4">
                <AlertCircle className="h-10 w-10 text-amber-600 mx-auto" />
                <div>
                  <p className="font-medium text-gray-900">No project found for this RERA ID</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.reraDetails?.summary ||
                      "Double-check the registration number on the Karnataka RERA portal."}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => runSearch(true)}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Search again
                  </Button>
                  <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                    <a
                      href="https://rera.karnataka.gov.in/viewAllProjects"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Karnataka RERA
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {report && !loading && report.reraDetails?.dataFound && (
            <div className="space-y-6">
              {cached && (
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm">
                  <span className="text-muted-foreground">
                    Cached report — instant load
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => runSearch(true)}
                    className="h-8"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    {rd?.propertyName || rd?.projectName || "Property details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {rd?.promoterName && (
                    <p>
                      <span className="text-muted-foreground">Promoter: </span>
                      {rd.promoterName}
                    </p>
                  )}
                  {(rd?.address || rd?.location) && (
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                      {[rd.address, rd.location, rd.district, rd.city]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4">
                    {rd?.possessionDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Possession: {rd.possessionDate}
                      </span>
                    )}
                    {rd?.registrationDate && (
                      <span className="text-muted-foreground">
                        Registered: {rd.registrationDate}
                      </span>
                    )}
                    {rd?.projectStatus && (
                      <Badge variant="secondary">{rd.projectStatus}</Badge>
                    )}
                  </div>
                  {rd?.summary && (
                    <p className="text-muted-foreground border-t pt-3">{rd.summary}</p>
                  )}
                  {rd?.reraPortalUrl && (
                    <a
                      href={rd.reraPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-emerald-700 hover:underline text-sm"
                    >
                      View on Karnataka RERA
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </CardContent>
              </Card>

              {rd?.documents && rd.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      RERA documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {rd.documents.map((doc, i) => (
                        <li
                          key={i}
                          className="rounded-lg border p-3 bg-muted/30"
                        >
                          <p className="font-medium">{doc.name}</p>
                          {doc.description && (
                            <p className="text-muted-foreground text-xs mt-1">
                              {doc.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Ratings & reviews
                    {gr?.averageRating != null && (
                      <Badge variant="outline" className="ml-2 font-normal">
                        {gr.averageRating.toFixed(1)} ★ · {gr.totalReviews || 0}{" "}
                        reviews
                      </Badge>
                    )}
                  </CardTitle>
                  {gr?.placeName && (
                    <p className="text-sm text-muted-foreground">{gr.placeName}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {gr?.reviews && gr.reviews.length > 0 ? (
                    <ul className="space-y-4">
                      {gr.reviews.map((review, i) => (
                        <li key={i} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm">{review.author}</span>
                            <span className="text-xs text-amber-600">
                              {"★".repeat(Math.min(5, Math.round(review.rating || 0)))}
                            </span>
                          </div>
                          {review.relativeTime && (
                            <p className="text-xs text-muted-foreground">{review.relativeTime}</p>
                          )}
                          <p className="text-sm text-gray-700 mt-1">{review.text}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No reviews found for this project.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5 text-red-600" />
                    Litigations &amp; court records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.litigationSummary && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {report.litigationSummary}
                    </p>
                  )}
                  {report.litigations && report.litigations.length > 0 ? (
                    <ul className="space-y-3">
                      {report.litigations.map((c, i) => (
                        <li
                          key={i}
                          className="rounded-lg border border-red-100 bg-red-50/50 p-4 text-sm"
                        >
                          <p className="font-medium">{c.caseTitle}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {c.court}
                            {c.year ? ` · ${c.year}` : ""} · {c.status}
                          </p>
                          {c.summary && (
                            <p className="mt-2 text-gray-700">{c.summary}</p>
                          )}
                          {c.sourceUrl && (
                            <a
                              href={c.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-700 hover:underline mt-2 inline-flex items-center"
                            >
                              Source <ExternalLink className="h-3 w-3 ml-0.5" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-emerald-700 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      No public litigation records found for this project.
                    </p>
                  )}
                </CardContent>
              </Card>

              <p className="text-xs text-center text-muted-foreground pb-8">
                Please verify important details on official RERA and government
                portals before making a purchase decision.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function StepIcon({
  status,
  index,
}: {
  status: StepStatus;
  index: number;
}) {
  if (status === "completed") {
    return <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />;
  }
  if (status === "in_progress") {
    return <Loader2 className="h-6 w-6 text-emerald-600 animate-spin shrink-0" />;
  }
  if (status === "error") {
    return <AlertCircle className="h-6 w-6 text-destructive shrink-0" />;
  }
  return (
    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground shrink-0">
      {index}
    </div>
  );
}
