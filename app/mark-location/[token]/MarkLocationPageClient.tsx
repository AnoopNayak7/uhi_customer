"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LocationSelectionPanel } from "@/components/mark-location/location-selection-panel";
import { apiClient } from "@/lib/api";
import {
  equivalentRadiusFromArea,
  formatLatLng,
  getPolygonAreaSqMeters,
  getPolygonCentroid,
} from "@/lib/location-mark/geo-utils";
import type {
  GeoPoint,
  LocationAreaMode,
  MapInteractionTool,
} from "@/lib/location-mark/types";
import { getMapCenterForCity } from "@/lib/location-mark/types";
import { toast } from "sonner";

const LocationMarkMap = dynamic(
  () => import("@/components/mark-location/location-mark-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(52dvh,420px)] min-h-[280px] items-center justify-center rounded-xl border border-[#EBEBEB] bg-[#F5F5F5]">
        <Loader2 className="size-6 animate-spin text-[#B0B0B0]" />
      </div>
    ),
  }
);

type Step = "mark" | "confirm" | "success";

const DEFAULT_RADIUS = 1500;

export function MarkLocationPageClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("there");
  const [userCity, setUserCity] = useState<string | undefined>("Bengaluru");
  const [step, setStep] = useState<Step>("mark");
  const [areaMode, setAreaMode] = useState<LocationAreaMode>("circle");
  const [mapTool, setMapTool] = useState<MapInteractionTool>("pan");
  const [center, setCenter] = useState<GeoPoint>(getMapCenterForCity("Bengaluru"));
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_RADIUS);
  const [polygonPath, setPolygonPath] = useState<GeoPoint[]>([]);
  const [addressLabel, setAddressLabel] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = (await apiClient.getPublicLocationMark(token)) as {
          success: boolean;
          data?: {
            userName?: string;
            userCity?: string;
            status?: string;
            areaMode?: LocationAreaMode;
            center?: GeoPoint;
            radiusMeters?: number;
            polygonPath?: GeoPoint[];
            addressLabel?: string;
          };
          message?: string;
        };

        if (!response.success || !response.data) {
          throw new Error(response.message || "Invalid or expired link");
        }

        const data = response.data;
        if (data.userName) setUserName(data.userName);
        if (data.userCity) setUserCity(data.userCity);

        const defaultCenter = getMapCenterForCity(data.userCity);
        setCenter(data.center || defaultCenter);

        if (data.status === "submitted") {
          setStep("success");
          if (data.areaMode) setAreaMode(data.areaMode);
          if (data.radiusMeters) setRadiusMeters(data.radiusMeters);
          if (data.polygonPath) setPolygonPath(data.polygonPath);
          if (data.addressLabel) setAddressLabel(data.addressLabel);
        } else if (data.status === "expired") {
          setError("This location link has expired. Please request a new one.");
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "This link is invalid or expired";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const handleAreaModeChange = useCallback((mode: LocationAreaMode) => {
    setAreaMode(mode);
    setMapTool("pan");
    if (mode === "circle") {
      setPolygonPath([]);
    }
  }, []);

  const handleCenterChange = useCallback((next: GeoPoint) => {
    setCenter(next);
    setAddressLabel(formatLatLng(next));
  }, []);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(next);
        setAddressLabel(formatLatLng(next));
        toast.success("Location updated on map");
      },
      () =>
        toast.error("Could not get your location. Please tap the map instead.")
    );
  }, []);

  const handleContinue = useCallback(() => {
    if (areaMode === "freehand" && polygonPath.length >= 3) {
      const centroid = getPolygonCentroid(polygonPath);
      setCenter(centroid);
      setAddressLabel(`Custom area near ${formatLatLng(centroid)}`);
    }
    setStep("confirm");
  }, [areaMode, polygonPath]);

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const submitCenter =
        areaMode === "freehand" && polygonPath.length >= 3
          ? getPolygonCentroid(polygonPath)
          : center;
      const submitRadius =
        areaMode === "freehand" && polygonPath.length >= 3
          ? equivalentRadiusFromArea(getPolygonAreaSqMeters(polygonPath))
          : radiusMeters;

      const response = (await apiClient.submitLocationMark(token, {
        areaMode,
        center: submitCenter,
        radiusMeters: submitRadius,
        polygonPath: areaMode === "freehand" ? polygonPath : undefined,
        addressLabel:
          addressLabel ||
          (areaMode === "freehand"
            ? `Custom drawn area (${polygonPath.length} points)`
            : formatLatLng(submitCenter)),
        note: note.trim() || undefined,
      })) as { success: boolean; message?: string };

      if (response.success) {
        setStep("success");
        toast.success("Location submitted successfully");
      } else {
        throw new Error(response.message || "Failed to submit location");
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit location"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const defaultCenter = getMapCenterForCity(userCity);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="mr-2 size-5 animate-spin text-[#717171]" />
            <span className="font-manrope text-sm text-[#717171]">
              Loading your link…
            </span>
          </div>
        ) : error ? (
          <div className="compare-surface p-8 text-center">
            <MapPin className="mx-auto mb-3 size-8 text-[#B0B0B0]" />
            <h1 className="property-section-title mb-2">link unavailable</h1>
            <p className="font-manrope text-sm text-[#717171]">{error}</p>
          </div>
        ) : step === "success" ? (
          <div className="compare-surface p-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-[#EBEBEB] bg-white">
              <CheckCircle2 className="size-7 text-green-600" strokeWidth={1.5} />
            </div>
            <h1 className="property-section-title mb-2">location saved</h1>
            <p className="font-manrope text-sm text-[#717171]">
              Thanks{userName !== "there" ? `, ${userName}` : ""}! Your{" "}
              {areaMode === "freehand" ? "preferred area" : "pick-up point"} has
              been shared with our team.
            </p>
            {addressLabel ? (
              <p className="mt-3 font-manrope text-sm font-medium text-[#303030]">
                {addressLabel}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="property-section-eyebrow">Site visit</p>
              <h1 className="property-section-title">
                {step === "confirm"
                  ? "confirm your selection"
                  : "mark your pick-up point"}
              </h1>
              <p className="mt-2 font-manrope text-sm text-[#717171]">
                Hi {userName},{" "}
                {step === "mark"
                  ? areaMode === "circle"
                    ? "tap the map to place your pin or draw a custom area around your neighbourhood."
                    : "move the map to your area, then trace your preferred boundary."
                  : "check that the shaded area on the map looks right before submitting."}
              </p>
            </div>

            <LocationMarkMap
              areaMode={areaMode}
              mapTool={mapTool}
              center={center}
              radiusMeters={radiusMeters}
              polygonPath={polygonPath}
              defaultCenter={defaultCenter}
              readOnly={step === "confirm"}
              fitPreview={step === "confirm"}
              onCenterChange={handleCenterChange}
              onPolygonChange={setPolygonPath}
              onMapToolChange={setMapTool}
            />

            <LocationSelectionPanel
              areaMode={areaMode}
              mapTool={mapTool}
              center={center}
              radiusMeters={radiusMeters}
              polygonPath={polygonPath}
              addressLabel={addressLabel}
              note={note}
              mode={step}
              onAreaModeChange={handleAreaModeChange}
              onMapToolChange={setMapTool}
              onRadiusChange={setRadiusMeters}
              onNoteChange={setNote}
              onClearDrawing={() => setPolygonPath([])}
              onContinue={handleContinue}
              onBack={() => setStep("mark")}
              onSubmit={handleSubmit}
              onUseMyLocation={step === "mark" ? handleUseMyLocation : undefined}
              submitting={submitting}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
