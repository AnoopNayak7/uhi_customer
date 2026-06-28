import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import {
  getContactPhone,
  openPhoneCall,
  openWhatsAppChat,
} from "@/lib/whatsapp";

interface ContactAgentProps {
  property: {
    id: string;
    title: string;
    address?: string;
    city?: string;
    location?: {
      address?: string;
    };
    price?: number;
    contactPhone?: string;
    builderPhone?: string;
    agent?: {
      name?: string;
      phone?: string;
      photo?: string;
      company?: string;
    };
  };
}

export const ContactAgent = ({ property }: ContactAgentProps) => {
  const handleCallAgent = () => {
    const phone = getContactPhone(property);
    openPhoneCall(phone, {
      onSuccess: () => toast.success("Calling agent..."),
      onError: () => toast.error("Failed to initiate call"),
    });
  };

  const handleWhatsApp = () => {
    openWhatsAppChat(property, undefined, {
      onSuccess: () => toast.success("Opening WhatsApp..."),
      onError: () => toast.error("Failed to open WhatsApp"),
    });
  };

  return (
    <Card className="property-surface">
      <CardContent className="p-6">
        <p className="property-section-eyebrow">Get in touch</p>
        <div className="mb-6 flex items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#303030]">
            <Headphones className="size-4 text-white" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h3 className="font-manrope text-base font-semibold leading-snug tracking-[-0.02em] text-[#1A1A1A]">
              Interested in this property?
            </h3>
            <p className="mt-1 font-manrope text-sm leading-relaxed text-[#5C5C5C]">
              {property.agent?.company || "Urbanhousein captain"} · verified
              advisor
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleCallAgent}
            className="property-btn-pill h-11 w-full rounded-full bg-[#303030] text-white hover:bg-[#1a1a1a]"
          >
            <Phone className="mr-2 size-4" strokeWidth={1.75} />
            Request a call
          </Button>

          <Button
            type="button"
            onClick={handleWhatsApp}
            variant="outline"
            className="property-btn-pill h-11 w-full rounded-full border-[#DDDDDD] bg-white font-manrope text-[#3A3A3A] hover:bg-[#FAFAFA]"
          >
            <MessageCircle className="mr-2 size-4" strokeWidth={1.75} />
            Chat on WhatsApp
          </Button>
        </div>

        <p className="mt-5 text-center font-manrope text-[11px] leading-relaxed text-[#B0B0B0]">
          By contacting, you agree to our terms and privacy policy
        </p>
      </CardContent>
    </Card>
  );
};
