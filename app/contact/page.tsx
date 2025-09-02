"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Building,
  Users,
  HeadphonesIcon,
} from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 7676345978",
      description: "Mon-Fri from 8am to 5pm",
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@urbanhousein.com",
      description: "Online support",
    },
    {
      icon: MapPin,
      title: "Office",
      details: "Bangalore, Karnataka",
      description: "India",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Mon-Fri: 9AM-6PM",
      description: "Sat: 10AM-4PM",
    },
  ];

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "property", label: "Property Related" },
    { value: "technical", label: "Technical Support" },
    { value: "partnership", label: "Partnership" },
    { value: "feedback", label: "Feedback" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our services? We're here to help you find
              your perfect property.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <p className="text-gray-600">
                    Reach out to us through any of the following channels. We're
                    always ready to assist you.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {info.title}
                        </h3>
                        <p className="text-gray-700 font-medium">
                          {info.details}
                        </p>
                        <p className="text-sm text-gray-500">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Building className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      1000+
                    </div>
                    <div className="text-sm text-gray-600">
                      Properties Listed
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>Send us a Message</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            {...form.register("name")}
                            placeholder="Your full name"
                            className="mt-1"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            {...form.register("email")}
                            type="email"
                            placeholder="your.email@example.com"
                            className="mt-1"
                          />
                          {form.formState.errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            {...form.register("phone")}
                            placeholder="+91 9876543210"
                            className="mt-1"
                          />
                          {form.formState.errors.phone && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.phone.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            onValueChange={(value) =>
                              form.setValue("category", value)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.category && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.category.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          {...form.register("subject")}
                          placeholder="Brief subject of your inquiry"
                          className="mt-1"
                        />
                        {form.formState.errors.subject && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          {...form.register("message")}
                          placeholder="Please describe your inquiry in detail..."
                          rows={6}
                          className="mt-1"
                        />
                        {form.formState.errors.message && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-red-500 hover:bg-red-600"
                        disabled={loading}
                      >
                        {loading ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "How do I list my property?",
                  answer:
                    "Simply sign up for an account and use our property listing wizard to add your property details, photos, and pricing information.",
                },
                {
                  question: "Is there a fee for listing properties?",
                  answer:
                    "Basic property listing is free. We offer premium packages with additional features for enhanced visibility.",
                },
                {
                  question: "How do I contact interested buyers?",
                  answer:
                    "You'll receive leads directly in your dashboard with contact information of interested buyers.",
                },
                {
                  question: "Can I edit my property listing?",
                  answer:
                    "Yes, you can edit your property details, photos, and pricing anytime from your dashboard.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
