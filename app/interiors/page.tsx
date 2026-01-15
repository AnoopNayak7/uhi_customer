"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Home,
  Palette,
  Hammer,
  Award,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Star,
  Quote,
  Lightbulb,
  Eye,
  Heart,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

const features = [
  {
    icon: Palette,
    title: "Customized Designs",
    description: "Personalized design solutions tailored to your lifestyle and preferences",
  },
  {
    icon: Award,
    title: "Up to 5 Years Warranty",
    description: "Comprehensive warranty coverage for peace of mind",
  },
  {
    icon: Home,
    title: "End-to-End Interior Services",
    description: "Complete interior solutions from design to execution",
  },
  {
    icon: CheckCircle2,
    title: "Assured Quality",
    description: "Premium materials and craftsmanship guaranteed",
  },
  {
    icon: Clock,
    title: "45-60 Days Delivery",
    description: "Fast and efficient project completion timeline",
  },
  {
    icon: Hammer,
    title: "State of the Art Production",
    description: "Modern manufacturing and installation processes",
  },
];

const processSteps = [
  {
    title: "Brainstorm",
    description: "We understand your needs wherein you open up with all your requirements, brainstorm on different ideas and offer personalized design options",
    icon: Lightbulb,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Visualize",
    description: "Our expert designers, make you visualize your dream home with all the intricacies involved suiting your lifestyle before the actual implementation",
    icon: Eye,
    color: "from-blue-400 to-cyan-500",
  },
  {
    title: "Craft It",
    description: "Once we collaborate and finalize the designs, we build your dream home with all the zeal and rigor.",
    icon: Hammer,
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "Celebrate",
    description: "We strive hard to realize your dreams and celebrate the transformation of your home from a blank canvas to a beautiful painting just the way you envisioned.",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
  },
];

const testimonial = {
  name: "Mr. Madhu Shivanna",
  location: "Prestige Falcon City",
  content:
    "In August 2019, we got our flat handed over at Prestige Falcon City and had no clue how to get interior work done for our two bed apartment. Many designers reached out to us, but it was difficult to choose because most of them seemed too good to be true and the samples they showed us never matched their actual designs. Luckily Zealworks was recommended to us by my nephew. Both Shashanka and Subhodh were very calm and listened to all our requirements, and carefully crafted design work that was exactly what we wanted. They catered to all our inputs and easily incorporated all of our changes. They worked with the Prestige builder without any complaints and the handover was completed with the apartment being mint clean!! We are looking forward to having more work done by Zealworks in the future and recommend them to anyone without hesitation! Truly, they provided an amazing service! If you are looking for the finest quality of work with complete satisfaction, then definitely go with Zealworks!",
};

export default function InteriorsPage() {
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Submit inquiry to API
      const response = await apiClient.submitInteriorInquiry({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email || undefined,
        message: formData.message || undefined,
      }) as { success: boolean; data?: { message?: string }; message?: string };

      if (response.success) {
        // Show success message
        toast.success("Inquiry submitted successfully!", {
          description: response.data?.message || response.message || "We'll contact you on WhatsApp shortly.",
        });

        // Create WhatsApp message for immediate contact
        const message = `Hello! I'm interested in interior design services.\n\nName: ${formData.name}\nWhatsApp: ${formData.whatsapp}${formData.email ? `\nEmail: ${formData.email}` : ""}${formData.message ? `\nMessage: ${formData.message}` : ""}`;
        const whatsappUrl = `https://wa.me/918310173142?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");

        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", whatsapp: "", email: "", message: "" });
          setDialogOpen(false);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to submit inquiry", {
        description: error?.response?.data?.message || error?.message || "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950">
      {/* Custom Header - Different from UrbanHouseIn */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-orange-200 dark:border-orange-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* UrbanHouseIn Logo */}
              <Link href="/" className="flex items-center">
                <img 
                  src="/logo/urbanhousein.svg" 
                  alt="UrbanHouseIn" 
                  className="h-8 w-auto dark:hidden"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/newLogo.svg";
                  }}
                />
                <img 
                  src="/logo/darkmodeuhi.svg" 
                  alt="UrbanHouseIn" 
                  className="h-8 w-auto hidden dark:block"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/newLogo.svg";
                  }}
                />
              </Link>
              
              {/* Separator */}
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
              
              {/* Zealworks Logo - Black */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                  <span className="text-white dark:text-black font-bold text-lg">ZW</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-black dark:text-white">
                    Zealworks
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Interior Design Studio</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Warm, Inviting Theme */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/30 dark:bg-red-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full mb-8 shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Crafting Dream Spaces Since 2019
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight"
              >
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                  End to End
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Interior Services</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 mb-6"
              >
                Crafting with Passion
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              >
                Home is where the heart is. Home is where you are most comfortable, feel the
                warmth of your family and loved ones by creating lasting memories. We at Zealworks,
                help you feel at home by creating a dream space which is a reflection of your
                personality.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid - Warm Color Palette */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                What We Offer
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Comprehensive interior design solutions crafted with passion and precision
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group"
                >
                  <Card className="h-full border-2 border-orange-200 dark:border-orange-900 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-orange-400 dark:hover:border-orange-700 transition-all duration-300 shadow-lg hover:shadow-2xl">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Creative Design */}
        <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Our proven 4-step process to transform your space
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotate: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-950/30 rounded-3xl p-8 shadow-xl h-full border-2 border-orange-200 dark:border-orange-900">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial - Elegant Design */}
        {/* <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <Card className="border-4 border-orange-300 dark:border-orange-800 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-950/30 shadow-2xl">
                <CardContent className="p-12 md:p-16">
                  <div className="flex items-center gap-3 mb-8">
                    <Quote className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t-2 border-orange-200 dark:border-orange-900 pt-6">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {testimonial.name}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-5 h-5" />
                      <p className="text-lg">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section> */}


        {/* Contact Info - Warm Theme */}
        <section className="py-16 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Home className="w-8 h-8 mx-auto mb-4 text-orange-200" />
                <p className="text-sm text-orange-100 mb-2 font-semibold uppercase tracking-wide">Address</p>
                <p className="mt-2 leading-relaxed">
                  #85/A, 11th Main, 14th cross road
                  <br />
                  Sector 6 HSR layout
                  <br />
                  Bengaluru, Karnataka 560102
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Mail className="w-8 h-8 mx-auto mb-4 text-orange-200" />
                <p className="text-sm text-orange-100 mb-2 font-semibold uppercase tracking-wide">Email</p>
                <a
                  href="mailto:hello@zealworks.in"
                  className="mt-2 hover:text-orange-200 transition-colors block"
                >
                  hello@zealworks.in
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Phone className="w-8 h-8 mx-auto mb-4 text-orange-200" />
                <p className="text-sm text-orange-100 mb-2 font-semibold uppercase tracking-wide">Phone</p>
                <a
                  href="tel:+918310173142"
                  className="mt-2 hover:text-orange-200 transition-colors block text-lg font-semibold"
                >
                  +91 8310173142
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Custom Footer - Different Theme */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Zealworks. All rights reserved. | Interior Design Services
          </p>
        </div>
      </footer>

      {/* Floating Inquiry Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          onClick={() => setDialogOpen(true)}
          size="lg"
          className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center p-0"
        >
          <MessageCircle className="w-8 h-8" />
        </Button>
      </motion.div>

      {/* Inquiry Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden rounded-xl shadow-xl border-border/50">
          <div className="p-6 sm:p-8">
            
            {/* Header */}
            <DialogHeader className="text-center space-y-2 pb-6">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Get Started Today
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Please enter your details to get in touch
              </p>
            </DialogHeader>
            
            {/* Form */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200 dark:border-green-800 shadow-sm">
                    <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    Thank you!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We'll contact you on WhatsApp shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="modal-name" className="text-sm font-medium leading-none">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="modal-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ring/50 transition-colors"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-whatsapp" className="text-sm font-medium leading-none">
                      WhatsApp Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="modal-whatsapp"
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      placeholder="Enter your WhatsApp number"
                      className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ring/50 transition-colors"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-email" className="text-sm font-medium leading-none">
                      Email
                    </Label>
                    <Input
                      id="modal-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter your Email"
                      className="h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ring/50 transition-colors"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-message" className="text-sm font-medium leading-none">
                      Message
                    </Label>
                    <Textarea
                      id="modal-message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={3}
                      placeholder="Tell us about your requirements..."
                      className="resize-none min-h-[80px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-ring/50 transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-10 font-medium"
                      size="default"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
