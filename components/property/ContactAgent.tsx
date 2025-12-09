import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Mail, User, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  openWhatsAppChat,
  openPhoneCall,
  getContactPhone,
} from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/property/WhatsAppButton";

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
  const [message, setMessage] = useState("");

  const handleCallAgent = () => {
    const phone = getContactPhone(property);
    openPhoneCall(phone, {
      onSuccess: () => {
        toast.success("Calling agent...");
      },
      onError: () => {
        toast.error("Failed to initiate call");
      },
    });
  };

  const handleSendMessage = () => {
    openWhatsAppChat(property, undefined, {
      onSuccess: () => {
        toast.success("Opening WhatsApp...");
      },
      onError: () => {
        toast.error("Failed to open WhatsApp");
      },
    });
  };

  const handleCustomMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const customMessage = `Hi, regarding "${
      property.title || "Property"
    }": ${message}`;
    openWhatsAppChat(property, customMessage, {
      onSuccess: () => {
        toast.success("Message sent via WhatsApp!");
        setMessage("");
      },
      onError: () => {
        toast.error("Failed to send message");
      },
    });
  };

  return (
    <Card className="bg-orange-50 shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <h3 className="text-[14px] font-semibold mb-2">Contact Agent</h3>
        <hr className="mb-4" />

        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-[#303030] rounded-full mr-3 flex items-center justify-center overflow-hidden">
            {property.agent?.photo ? (
              <Image
                src={property.agent.photo}
                alt={property.agent.name || "Agent"}
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>

          <div>
            <h4 className="font-medium text-[14px]">
              {property.agent?.name || "Abhay Naik"}
            </h4>
            <p className="text-[12px] text-gray-600">
              {property.agent?.company || "Urbanhousein captain"}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <Button
            variant="default"
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600"
            onClick={handleCallAgent}
          >
            <Phone className="w-4 h-4 mr-2" />
            Request a call
          </Button>

          <WhatsAppButton
            property={property}
            className="w-full"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat on WhatsApp
          </WhatsAppButton>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center text-sm"
              >
                Custom Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-1">
                <h3 className="text-lg font-semibold mb-4">
                  Contact {property.agent?.name || "Agent"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Your Message
                    </label>
                    <Textarea
                      placeholder="I'm interested in this property and would like to schedule a viewing..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Your Name
                      </label>
                      <Input placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Your Phone
                      </label>
                      <Input placeholder="Enter your phone" />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleCustomMessage}>
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-[10px] text-gray-500 text-center">
          By contacting, you agree to our terms and privacy policy
        </div>
      </CardContent>
    </Card>
  );
};
