"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  FileText,
  Layout,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PropertyMobileNavProps {
  property: {
    id: string;
    title: string;
    brochureUrl?: string;
    floorPlanPdfUrl?: string;
  };
}

export function PropertyMobileNav({ property }: PropertyMobileNavProps) {
  const [brochureDialogOpen, setBrochureDialogOpen] = useState(false);
  const [floorPlanDialogOpen, setFloorPlanDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasBrochure = !!property.brochureUrl;
  const hasFloorPlan = !!property.floorPlanPdfUrl;

  if (!hasBrochure && !hasFloorPlan) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetDialog = () => {
    setSuccess(false);
    setFormData({ name: "", phone: "", email: "" });
  };

  const handleSubmit = async (documentType: "brochure" | "floor_plan") => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const response: any = await apiClient.requestDocumentDownload({
        propertyId: property.id,
        documentType,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
      });

      if (response.success) {
        setSuccess(true);
        toast.success("Request submitted! We'll send it on WhatsApp shortly.");

        setTimeout(() => {
          resetDialog();
          if (documentType === "brochure") {
            setBrochureDialogOpen(false);
          } else {
            setFloorPlanDialogOpen(false);
          }
        }, 2500);
      } else {
        throw new Error(response.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Error requesting document:", error);
      toast.error(
        error.message || "Failed to submit request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const DownloadDialog = ({
    open,
    onOpenChange,
    documentType,
    documentName,
    icon: Icon,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: "brochure" | "floor_plan";
    documentName: string;
    icon: typeof FileText;
  }) => (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetDialog();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-md gap-0 overflow-hidden overflow-y-auto rounded-[20px] border-[#EBEBEB] p-0">
        <div className="p-6 sm:p-7">
          {success ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-[#EBEBEB] bg-[#FAFAFA]">
                <CheckCircle2
                  className="size-7 text-green-600"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-manrope text-lg font-semibold text-[#222222]">
                Request received
              </h3>
              <p className="mt-2 font-manrope text-sm text-[#717171]">
                The {documentName.toLowerCase()} will be sent to your WhatsApp
                number shortly.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className="space-y-3 pb-5 text-left">
                <div className="flex items-start gap-3">
                  <span className="property-icon-pill size-11 shrink-0">
                    <Icon className="size-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <DialogTitle className="font-manrope text-lg font-semibold text-[#222222]">
                      Get {documentName.toLowerCase()}
                    </DialogTitle>
                    <p className="mt-1 line-clamp-2 font-manrope text-sm text-[#717171]">
                      {property.title}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="mb-5 rounded-xl border border-[#E8F4FD] bg-[#F7FBFF] p-3.5">
                <div className="flex gap-2.5">
                  <MessageCircle
                    className="mt-0.5 size-4 shrink-0 text-[#2563EB]"
                    strokeWidth={1.5}
                  />
                  <p className="font-manrope text-xs leading-relaxed text-[#484848]">
                    We&apos;ll send the {documentName.toLowerCase()} directly to
                    your WhatsApp — no download link on this page.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(documentType);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={`${documentType}-name`}
                    className="font-manrope text-sm text-[#484848]"
                  >
                    Full name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`${documentType}-name`}
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${documentType}-phone`}
                    className="font-manrope text-sm text-[#484848]"
                  >
                    WhatsApp number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`${documentType}-phone`}
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${documentType}-email`}
                    className="font-manrope text-sm text-[#484848]"
                  >
                    Email (optional)
                  </Label>
                  <Input
                    id={`${documentType}-email`}
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="property-btn-pill mt-1 h-11 w-full rounded-full bg-[#303030] text-white hover:bg-[#1a1a1a]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2 size-4" strokeWidth={1.5} />
                      Send to WhatsApp
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="border-t border-[#EBEBEB] bg-white/95 px-3 pt-2 backdrop-blur-md pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-lg gap-2">
            <button
              type="button"
              disabled={!hasBrochure}
              onClick={() => setBrochureDialogOpen(true)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full border py-3 font-manrope text-sm font-medium transition-colors",
                hasBrochure
                  ? "border-[#E8E8E8] bg-[#FAFAFA] text-[#303030] active:bg-[#F0F0F0]"
                  : "cursor-not-allowed border-[#F0F0F0] bg-[#FAFAFA] text-[#B0B0B0]"
              )}
            >
              <FileText className="size-4 shrink-0" strokeWidth={1.5} />
              Brochure
            </button>

            <button
              type="button"
              disabled={!hasFloorPlan}
              onClick={() => setFloorPlanDialogOpen(true)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full border py-3 font-manrope text-sm font-medium transition-colors",
                hasFloorPlan
                  ? "border-[#303030] bg-[#303030] text-white active:bg-[#1a1a1a]"
                  : "cursor-not-allowed border-[#F0F0F0] bg-[#FAFAFA] text-[#B0B0B0]"
              )}
            >
              <Layout className="size-4 shrink-0" strokeWidth={1.5} />
              Floor plan
            </button>
          </div>
        </div>
      </div>

      <DownloadDialog
        open={brochureDialogOpen}
        onOpenChange={setBrochureDialogOpen}
        documentType="brochure"
        documentName="Brochure"
        icon={FileText}
      />

      <DownloadDialog
        open={floorPlanDialogOpen}
        onOpenChange={setFloorPlanDialogOpen}
        documentType="floor_plan"
        documentName="Floor Plan"
        icon={Layout}
      />
    </>
  );
}
