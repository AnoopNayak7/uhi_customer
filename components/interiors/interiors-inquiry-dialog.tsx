"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
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
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

const INTERIORS_WHATSAPP = "918217452498";

export function InteriorsInquiryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = (await apiClient.submitInteriorInquiry({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email || undefined,
        message: formData.message || undefined,
      })) as {
        success: boolean;
        data?: { message?: string };
        message?: string;
      };

      if (response.success) {
        toast.success("Inquiry submitted successfully!", {
          description:
            response.data?.message ||
            response.message ||
            "We'll contact you on WhatsApp shortly.",
        });

        const message = `Hello! I'm interested in interior design services.\n\nName: ${formData.name}\nWhatsApp: ${formData.whatsapp}${formData.email ? `\nEmail: ${formData.email}` : ""}${formData.message ? `\nMessage: ${formData.message}` : ""}`;
        window.open(
          `https://wa.me/${INTERIORS_WHATSAPP}?text=${encodeURIComponent(message)}`,
          "_blank"
        );

        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", whatsapp: "", email: "", message: "" });
          onOpenChange(false);
        }, 2000);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error("Failed to submit inquiry", {
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-[20px] border-[#EBEBEB] p-0">
        <div className="p-6 sm:p-8">
          <DialogHeader className="space-y-2 pb-6 text-center">
            <DialogTitle className="font-manrope text-xl font-semibold text-[#222222]">
              Get a free consultation
            </DialogTitle>
            <p className="font-manrope text-sm text-[#717171]">
              Share your details and we&apos;ll reach out on WhatsApp.
            </p>
          </DialogHeader>

          {submitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-[#EBEBEB] bg-[#FAFAFA]">
                <CheckCircle2 className="size-7 text-green-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-manrope text-lg font-semibold text-[#222222]">
                Thank you!
              </h3>
              <p className="mt-1 font-manrope text-sm text-[#717171]">
                We&apos;ll contact you on WhatsApp shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interior-name" className="font-manrope text-sm text-[#484848]">
                  Full name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="interior-name"
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
                <Label htmlFor="interior-whatsapp" className="font-manrope text-sm text-[#484848]">
                  WhatsApp number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="interior-whatsapp"
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interior-email" className="font-manrope text-sm text-[#484848]">
                  Email
                </Label>
                <Input
                  id="interior-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@email.com"
                  className="h-11 rounded-xl border-[#DDDDDD] font-manrope"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interior-message" className="font-manrope text-sm text-[#484848]">
                  Message
                </Label>
                <Textarea
                  id="interior-message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  placeholder="Tell us about your home and requirements..."
                  className="min-h-[88px] resize-none rounded-xl border-[#DDDDDD] font-manrope"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="property-btn-pill mt-2 w-full rounded-full bg-[#303030] text-white hover:bg-[#1a1a1a]"
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <MessageCircle className="mr-2 size-4" strokeWidth={1.5} />
                    Send inquiry
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
