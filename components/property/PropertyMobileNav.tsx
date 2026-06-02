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
import { Download, FileText, Layout, MessageCircle, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        toast.success("Request submitted! The document will be sent to your WhatsApp shortly.");
        
        // Reset form and close dialog after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: "", phone: "", email: "" });
          if (documentType === "brochure") {
            setBrochureDialogOpen(false);
          } else {
            setFloorPlanDialogOpen(false);
          }
        }, 3000);
      } else {
        throw new Error(response.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Error requesting document:", error);
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Always show the nav bar on mobile, even if documents aren't available yet
  // Users can still request documents

  const DownloadDialog = ({
    open,
    onOpenChange,
    documentType,
    documentName,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: "brochure" | "floor_plan";
    documentName: string;
  }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
        {!success ? (
          <>
            <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 pb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    Download {documentName}
                  </DialogTitle>
                  <p className="text-blue-100 text-sm mt-1">
                    We'll send it to your WhatsApp
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(documentType);
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500">
                  The document will be sent to this WhatsApp number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Send to WhatsApp</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Request Submitted!
              </h3>
              <p className="text-gray-600">
                The {documentName} will be sent to your WhatsApp number shortly.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {/* Mobile Bottom Navigation Bar - Always show on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-3">
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 flex-1 ${
              !hasBrochure ? 'opacity-50' : ''
            }`}
            onClick={() => setBrochureDialogOpen(true)}
            disabled={!hasBrochure}
          >
            <FileText className={`w-5 h-5 ${hasBrochure ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-medium ${hasBrochure ? 'text-gray-700' : 'text-gray-400'}`}>
              Brochure
            </span>
          </Button>
          
          <Button
            variant="ghost"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 flex-1 ${
              !hasFloorPlan ? 'opacity-50' : ''
            }`}
            onClick={() => setFloorPlanDialogOpen(true)}
            disabled={!hasFloorPlan}
          >
            <Layout className={`w-5 h-5 ${hasFloorPlan ? 'text-purple-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-medium ${hasFloorPlan ? 'text-gray-700' : 'text-gray-400'}`}>
              Floor Plan
            </span>
          </Button>
        </div>
      </div>

      {/* Download Dialogs */}
      <DownloadDialog
        open={brochureDialogOpen}
        onOpenChange={setBrochureDialogOpen}
        documentType="brochure"
        documentName="Brochure"
      />

      <DownloadDialog
        open={floorPlanDialogOpen}
        onOpenChange={setFloorPlanDialogOpen}
        documentType="floor_plan"
        documentName="Floor Plan"
      />
    </>
  );
}
