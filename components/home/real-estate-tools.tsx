"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building,
  Calculator,
  Crown,
  Loader2,
  MapPin,
  Phone,
  Scale,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CITIES } from "@/lib/config";
import { apiClient } from "@/lib/api";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/home-section";

const CTA_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&h=700&fit=crop&crop=center&auto=format&q=85";

const tools = [
  {
    icon: TrendingUp,
    label: "Market",
    title: "Price Trends",
    description: "Track property prices and market movement.",
    href: "/tools/price-trends",
  },
  {
    icon: Calculator,
    label: "Valuation",
    title: "Property Value",
    description: "Estimate what a property is worth today.",
    href: "/tools/property-value",
  },
  {
    icon: MapPin,
    label: "Areas",
    title: "Area Insights",
    description: "Explore neighbourhood stats and livability.",
    href: "/tools/area-insights",
  },
  {
    icon: Calculator,
    label: "Budget",
    title: "Home Affordability",
    description: "See how much home fits your budget.",
    href: "/tools/home-affordability",
  },
  {
    icon: Scale,
    label: "Compliance",
    title: "RERA Check",
    description: "Verify registration and project details.",
    href: "/tools/rera-check",
  },
];

export function RealEstateTools() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    phone: "",
    city: "Bengaluru",
  });
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "Bengaluru",
    propertyTypes: "",
    experience: "",
    message: "",
    website: "",
    employeeCount: "",
    annualRevenue: "",
    targetMarkets: "",
  });

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationForm.name || !consultationForm.phone || !consultationForm.city) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Consultation request submitted! Our team will contact you soon.");
    setConsultationForm({ name: "", phone: "", city: "Bengaluru" });
    setConsultationOpen(false);
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.email || !partnerForm.phone || !partnerForm.company) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.createBusinessPartnership(partnerForm);
      if (response && typeof response === "object" && "success" in response && response.success) {
        toast.success("Partnership application submitted successfully!");
        setPartnerForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          city: "Bengaluru",
          propertyTypes: "",
          experience: "",
          message: "",
          website: "",
          employeeCount: "",
          annualRevenue: "",
          targetMarkets: "",
        });
        setPartnerOpen(false);
      } else {
        toast.error("Failed to submit application");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to submit partnership application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeSection className="bg-[#FAFAFA]">
      <HomeSectionHeader
        eyebrow="Tools & insights"
        title="Real estate tools"
        subtitle="Powerful tools and insights to help you make informed property decisions."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex h-full flex-col rounded-[20px] border border-[#EBEBEB] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#DDDDDD] hover:shadow-[0_10px_36px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#F0F0F0] bg-[#FAFAFA] px-2.5 py-1">
                <Icon className="size-2.5 text-[#484848]" strokeWidth={1} />
                <span className="font-manrope text-[10px] font-medium uppercase tracking-[0.1em] text-[#8A8A8A]">
                  {tool.label}
                </span>
              </div>
              <h3 className="font-manrope text-[15px] font-semibold text-[#222222]">
                {tool.title}
              </h3>
              <p className="mt-2 flex-grow font-manrope text-xs leading-relaxed text-[#717171]">
                {tool.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-manrope text-[13px] font-medium text-[#222222] transition-colors group-hover:text-red-500">
                Explore
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Button
          asChild
          className="property-btn-pill rounded-full bg-[#303030] px-6 text-white hover:bg-[#1a1a1a]"
        >
          <Link href="/tools/real-estate">
            <Crown className="mr-2 size-4" strokeWidth={1.5} />
            Explore all tools
            <ArrowRight className="ml-2 size-4" strokeWidth={1.5} />
          </Link>
        </Button>
      </div>

      <div className="mt-12 overflow-hidden rounded-[24px] border border-[#EBEBEB] bg-white">
        <div className="grid lg:grid-cols-[340px_1fr]">
          <div className="relative min-h-[240px] lg:min-h-full">
            <Image
              src={CTA_IMAGE}
              alt="Modern home consultation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 340px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/5 lg:to-black/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:hidden">
              <p className="font-manrope text-sm font-medium text-white">
                Expert guidance at every step
              </p>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-[#F0F0F0] p-8 md:border-b-0 md:border-r">
              <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0B0B0]">
                For customers
              </p>
              <h3 className="mt-2 font-manrope text-lg font-semibold tracking-[-0.02em] text-[#222222]">
                Find your perfect home
              </h3>
              <p className="mt-2 font-manrope text-sm leading-relaxed text-[#717171]">
                Get expert guidance from our property consultants — free, personalised, and
                hassle-free.
              </p>
              <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
                <DialogTrigger asChild>
                  <Button className="property-btn-pill mt-6 rounded-full bg-red-500 text-white hover:bg-red-600">
                    <Phone className="mr-2 size-4" strokeWidth={1.5} />
                    Speak to consultant
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[20px] border-[#EBEBEB] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-manrope">Request consultation</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleConsultationSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="consultation-name">Full name</Label>
                      <Input
                        id="consultation-name"
                        value={consultationForm.name}
                        onChange={(e) =>
                          setConsultationForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="mt-1 rounded-xl border-[#DDDDDD]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="consultation-phone">Phone number</Label>
                      <Input
                        id="consultation-phone"
                        value={consultationForm.phone}
                        onChange={(e) =>
                          setConsultationForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="mt-1 rounded-xl border-[#DDDDDD]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="consultation-city">City</Label>
                      <Select
                        value={consultationForm.city}
                        onValueChange={(city) =>
                          setConsultationForm((prev) => ({ ...prev, city }))
                        }
                      >
                        <SelectTrigger className="mt-1 rounded-xl border-[#DDDDDD]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="property-btn-pill w-full rounded-full bg-red-500 hover:bg-red-600"
                    >
                      Submit request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="p-8">
              <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0B0B0]">
                For business
              </p>
              <h3 className="mt-2 font-manrope text-lg font-semibold tracking-[-0.02em] text-[#222222]">
                Grow with Urbanhousein
              </h3>
              <p className="mt-2 font-manrope text-sm leading-relaxed text-[#717171]">
                Partner with us to showcase your properties to serious buyers across Bengaluru.
              </p>
              <Dialog open={partnerOpen} onOpenChange={setPartnerOpen}>
                <DialogTrigger asChild>
                  <Button className="property-btn-pill mt-6 rounded-full bg-[#303030] text-white hover:bg-[#1a1a1a]">
                    <Building className="mr-2 size-4" strokeWidth={1.5} />
                    Become partner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[20px] border-[#EBEBEB] sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-manrope">
                      Business partnership application
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePartnerSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        placeholder="Full name *"
                        value={partnerForm.name}
                        onChange={(e) =>
                          setPartnerForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="rounded-xl border-[#DDDDDD]"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email *"
                        value={partnerForm.email}
                        onChange={(e) =>
                          setPartnerForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="rounded-xl border-[#DDDDDD]"
                        required
                      />
                      <Input
                        placeholder="Phone *"
                        value={partnerForm.phone}
                        onChange={(e) =>
                          setPartnerForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="rounded-xl border-[#DDDDDD]"
                        required
                      />
                      <Input
                        placeholder="Company *"
                        value={partnerForm.company}
                        onChange={(e) =>
                          setPartnerForm((prev) => ({ ...prev, company: e.target.value }))
                        }
                        className="rounded-xl border-[#DDDDDD]"
                        required
                      />
                    </div>
                    <Textarea
                      placeholder="Why partner with us?"
                      value={partnerForm.message}
                      onChange={(e) =>
                        setPartnerForm((prev) => ({ ...prev, message: e.target.value }))
                      }
                      className="rounded-xl border-[#DDDDDD]"
                      rows={3}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="property-btn-pill w-full rounded-full bg-red-500 hover:bg-red-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit application"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
