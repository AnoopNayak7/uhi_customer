"use client";

import { useEffect, useState } from "react";
import { buildLocationMarkUrl } from "@/lib/location-mark/build-url";
import {
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "2:00 PM",
  "3:30 PM",
  "5:00 PM",
];

const BUDGET_RANGES = [
  { value: "under-50l", label: "Under ₹50 Lac" },
  { value: "50l-80l", label: "₹50 Lac – ₹80 Lac" },
  { value: "80l-1.2cr", label: "₹80 Lac – ₹1.2 Cr" },
  { value: "1.2cr-2cr", label: "₹1.2 Cr – ₹2 Cr" },
  { value: "2cr-3cr", label: "₹2 Cr – ₹3 Cr" },
  { value: "3cr-plus", label: "₹3 Cr & above" },
  { value: "flexible", label: "Flexible / not sure yet" },
] as const;

type TransportMode = "own_vehicle" | "pick_drop";

type VisitContext = {
  id: string;
  propertyTitle?: string;
  transportMode?: TransportMode;
  pickupLocation?: string;
  dropoffLocation?: string;
  locationMarkToken?: string;
};

const initialForm = {
  name: "",
  phone: "",
  email: "",
  preferredAreas: "",
  budget: "",
  preferredDate: "",
  preferredTime: "",
  pickupLocation: "",
  dropoffLocation: "",
  message: "",
};

export function SiteVisitBookingDialog({
  open,
  onOpenChange,
  visit,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit?: VisitContext | null;
  onSaved?: () => void;
}) {
  const { user } = useAuthStore();
  const isSetupMode = Boolean(visit?.id);

  const [formData, setFormData] = useState(initialForm);
  const [transportMode, setTransportMode] = useState<TransportMode | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [locationMarkUrl, setLocationMarkUrl] = useState("");
  const [locationMarkToken, setLocationMarkToken] = useState("");
  const [copied, setCopied] = useState(false);

  const resetForm = () => {
    setFormData(initialForm);
    setTransportMode("");
    setSubmitted(false);
    setLocationMarkUrl("");
    setLocationMarkToken("");
    setCopied(false);
  };

  useEffect(() => {
    if (!open) return;

    if (visit) {
      setTransportMode(visit.transportMode || "");
      setFormData((prev) => ({
        ...prev,
        pickupLocation: visit.pickupLocation || "",
        dropoffLocation: visit.dropoffLocation || "",
      }));
      if (visit.locationMarkToken) {
        setLocationMarkToken(visit.locationMarkToken);
        setLocationMarkUrl(buildLocationMarkUrl(visit.locationMarkToken));
      }
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: [user.firstName, user.lastName].filter(Boolean).join(" "),
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [open, user, visit]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(resetForm, 200);
    }
    onOpenChange(nextOpen);
  };

  const handleGenerateMapLink = async () => {
    if (!user) {
      toast.error("Please sign in to generate a map link");
      return;
    }

    setGeneratingLink(true);
    try {
      const response = (await apiClient.createLocationMarkLink()) as {
        success: boolean;
        data?: { token: string };
        message?: string;
      };

      if (response.success && response.data?.token) {
        const url = buildLocationMarkUrl(response.data.token);
        setLocationMarkToken(response.data.token);
        setLocationMarkUrl(url);
        toast.success("Map link ready — share or open to mark your location");
      } else {
        throw new Error(response.message || "Failed to generate link");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to generate map link");
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    if (!locationMarkUrl) return;
    await navigator.clipboard.writeText(locationMarkUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transportMode) {
      toast.error("Please choose how you'll travel to the visit");
      return;
    }

    if (transportMode === "pick_drop") {
      if (!formData.pickupLocation.trim() || !formData.dropoffLocation.trim()) {
        toast.error("Please enter both pick-up and drop-off locations");
        return;
      }
    }

    setSubmitting(true);

    try {
      if (isSetupMode && visit) {
        const response = (await apiClient.updateBookVisitDetails(visit.id, {
          transportMode,
          pickupLocation:
            transportMode === "pick_drop"
              ? formData.pickupLocation.trim()
              : undefined,
          dropoffLocation:
            transportMode === "pick_drop"
              ? formData.dropoffLocation.trim()
              : undefined,
          locationMarkToken: locationMarkToken || undefined,
          message: formData.message.trim() || undefined,
        })) as { success: boolean; message?: string };

        if (response.success) {
          toast.success("Visit details saved");
          setSubmitted(true);
          onSaved?.();
          setTimeout(() => handleOpenChange(false), 2000);
        } else {
          throw new Error(response.message || "Failed to save visit details");
        }
      } else {
        if (!formData.name.trim() || !formData.phone.trim()) {
          toast.error("Name and phone are required");
          setSubmitting(false);
          return;
        }

        const response = (await apiClient.submitSiteVisitRequest({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          preferredAreas: formData.preferredAreas || undefined,
          budget: formData.budget || undefined,
          preferredDate: formData.preferredDate || undefined,
          preferredTime: formData.preferredTime || undefined,
          transportMode,
          pickupLocation:
            transportMode === "pick_drop"
              ? formData.pickupLocation.trim()
              : undefined,
          dropoffLocation:
            transportMode === "pick_drop"
              ? formData.dropoffLocation.trim()
              : undefined,
          locationMarkToken: locationMarkToken || undefined,
          message: formData.message || undefined,
          city: "Bengaluru",
        })) as {
          success: boolean;
          data?: { message?: string; bookingNumber?: string };
          message?: string;
        };

        if (response.success) {
          toast.success("Site visit request submitted!", {
            description:
              response.data?.message ||
              response.message ||
              "Our team will contact you shortly.",
          });
          setSubmitted(true);
          onSaved?.();
          setTimeout(() => handleOpenChange(false), 2500);
        } else {
          throw new Error(response.message || "Failed to submit request");
        }
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        isSetupMode ? "Failed to save visit details" : "Failed to submit request",
        {
          description:
            err?.response?.data?.message ||
            err?.message ||
            "Please try again later.",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-5rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden overflow-y-auto rounded-[20px] border-[#EBEBEB] p-0 sm:w-full">
        <div className="p-5 sm:p-7">
          <DialogHeader className="space-y-1.5 pb-4 text-left">
            <DialogTitle className="font-manrope text-lg font-semibold text-[#222222] sm:text-xl">
              {isSetupMode ? "Set up your site visit" : "Book a site visit"}
            </DialogTitle>
            <p className="font-manrope text-xs text-[#717171] sm:text-sm">
              {isSetupMode
                ? `Plan your visit${visit?.propertyTitle ? ` to ${visit.propertyTitle}` : ""} — choose transport and share your locations.`
                : "Tell us what you're looking for and we'll plan your Bengaluru tour."}
            </p>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-[#EBEBEB] bg-[#FAFAFA]">
                <CheckCircle2
                  className="size-7 text-green-600"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-manrope text-lg font-semibold text-[#222222]">
                {isSetupMode ? "Visit details saved" : "Request received"}
              </h3>
              <p className="mt-1 font-manrope text-sm text-[#717171]">
                {transportMode === "pick_drop"
                  ? "We'll confirm your pick-up route and send a WhatsApp link a day before your visit."
                  : "We'll share visit details on WhatsApp before your scheduled date."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-lg border border-[#EBEBEB] bg-[#FAFAFA] px-3 py-2.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#303030]">
                  <MessageCircle
                    className="size-3 text-white"
                    strokeWidth={1.75}
                  />
                </span>
                <p className="font-manrope text-[11px] leading-relaxed text-[#717171]">
                  <span className="font-medium text-[#484848]">
                    WhatsApp before your visit
                  </span>
                  {" · "}
                  One day prior we&apos;ll send a link to mark your pick-up point
                  on the map.
                </p>
              </div>

              {!isSetupMode ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor="sv-name"
                        className="font-manrope text-sm text-[#484848]"
                      >
                        Full name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sv-name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your name"
                        className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="sv-phone"
                        className="font-manrope text-sm text-[#484848]"
                      >
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sv-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="sv-email"
                        className="font-manrope text-sm text-[#484848]"
                      >
                        Email
                      </Label>
                      <Input
                        id="sv-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@email.com"
                        className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sv-areas"
                      className="font-manrope text-sm text-[#484848]"
                    >
                      Preferred areas in Bengaluru
                    </Label>
                    <Input
                      id="sv-areas"
                      value={formData.preferredAreas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredAreas: e.target.value,
                        })
                      }
                      placeholder="e.g. Whitefield, Sarjapur, Hebbal"
                      className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-manrope text-sm text-[#484848]">
                        Budget range
                      </Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) =>
                          setFormData({ ...formData, budget: value })
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border-[#DDDDDD] font-manrope">
                          <SelectValue placeholder="Select your budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUDGET_RANGES.map((range) => (
                            <SelectItem key={range.value} value={range.label}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="sv-date"
                        className="font-manrope text-sm text-[#484848]"
                      >
                        Preferred date
                      </Label>
                      <Input
                        id="sv-date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredDate: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-manrope text-sm text-[#484848]">
                      Preferred time
                    </Label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) =>
                        setFormData({ ...formData, preferredTime: value })
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl border-[#DDDDDD] font-manrope">
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : null}

              <div className="space-y-3">
                <Label className="font-manrope text-sm text-[#484848]">
                  How will you travel? <span className="text-red-500">*</span>
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setTransportMode("own_vehicle")}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      transportMode === "own_vehicle"
                        ? "border-[#303030] bg-[#FAFAFA]"
                        : "border-[#E8E8E8] bg-white hover:border-[#D0D0D0]"
                    )}
                  >
                    <Car
                      className="mb-2 size-5 text-[#303030]"
                      strokeWidth={1.5}
                    />
                    <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                      Own vehicle
                    </p>
                    <p className="mt-1 font-manrope text-xs text-[#717171]">
                      I&apos;ll drive myself to the projects
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransportMode("pick_drop")}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      transportMode === "pick_drop"
                        ? "border-[#303030] bg-[#FAFAFA]"
                        : "border-[#E8E8E8] bg-white hover:border-[#D0D0D0]"
                    )}
                  >
                    <MapPin
                      className="mb-2 size-5 text-[#303030]"
                      strokeWidth={1.5}
                    />
                    <p className="font-manrope text-sm font-semibold text-[#1A1A1A]">
                      Pick-up &amp; drop
                    </p>
                    <p className="mt-1 font-manrope text-xs text-[#717171]">
                      Free complimentary ride across Bengaluru
                    </p>
                  </button>
                </div>
              </div>

              {transportMode === "pick_drop" ? (
                <div className="space-y-4 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] p-4">
                  <p className="font-manrope text-xs font-medium uppercase tracking-[0.06em] text-[#717171]">
                    Your locations
                  </p>
                  <div className="space-y-2">
                    <Label
                      htmlFor="sv-pickup"
                      className="font-manrope text-sm text-[#484848]"
                    >
                      Pick-up location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sv-pickup"
                      value={formData.pickupLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pickupLocation: e.target.value,
                        })
                      }
                      placeholder="Home, office, or landmark in Bengaluru"
                      className="h-11 rounded-xl border-[#DDDDDD] bg-white font-manrope"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="sv-dropoff"
                      className="font-manrope text-sm text-[#484848]"
                    >
                      Drop-off location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sv-dropoff"
                      value={formData.dropoffLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dropoffLocation: e.target.value,
                        })
                      }
                      placeholder="Where you'd like to be dropped after the tour"
                      className="h-11 rounded-xl border-[#DDDDDD] bg-white font-manrope"
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-3 rounded-xl border border-dashed border-[#D0D0D0] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-manrope text-sm font-medium text-[#1A1A1A]">
                      Mark location on map
                    </p>
                    <p className="mt-1 font-manrope text-xs text-[#717171]">
                      Generate a link to pin your exact pick-up point now, or wait
                      for the WhatsApp link a day before your visit.
                    </p>
                  </div>
                  <Link2 className="size-4 shrink-0 text-[#B0B0B0]" />
                </div>

                {locationMarkUrl ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      readOnly
                      value={locationMarkUrl}
                      className="h-10 flex-1 rounded-xl border-[#DDDDDD] font-manrope text-xs"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-full border-[#D0D0D0]"
                        onClick={handleCopyLink}
                      >
                        {copied ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-full border-[#D0D0D0]"
                        asChild
                      >
                        <a
                          href={locationMarkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-[#D0D0D0] font-manrope text-xs"
                    onClick={handleGenerateMapLink}
                    disabled={generatingLink || !user}
                  >
                    {generatingLink ? (
                      <>
                        <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-1.5 size-3.5" />
                        Generate map link
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sv-message"
                  className="font-manrope text-sm text-[#484848]"
                >
                  {isSetupMode ? "Notes for our team" : "Shortlisted projects or notes"}
                </Label>
                <Textarea
                  id="sv-message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  placeholder="Any projects you've shortlisted or specific requirements..."
                  className="min-h-[80px] resize-none rounded-xl border-[#DDDDDD] font-manrope"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="property-btn-pill mt-1 w-full rounded-full bg-[#303030] text-white hover:bg-[#1a1a1a]"
              >
                {submitting ? (
                  "Saving..."
                ) : (
                  <>
                    <CalendarDays className="mr-2 size-4" strokeWidth={1.5} />
                    {isSetupMode ? "Save visit details" : "Submit site visit request"}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
