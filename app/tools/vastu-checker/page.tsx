"use client";

import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Home,
  Wind,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Direction, RoomVastu, VastuInput, OpenSpaces, VastuScore } from "@/lib/vastu-types";
import { calculateVastuScore } from "@/lib/vastu-calculator";
import { EntryDirectionSelector } from "./components/DirectionGrid";
import { RoomInput } from "./components/RoomInput";
import { OpenSpaceSliders } from "./components/OpenSpaceSliders";
import { VastuResults } from "./components/VastuResults";

type Step = "entry" | "rooms" | "spaces" | "results";

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "entry", label: "Entry Direction", icon: <Compass className="w-5 h-5" /> },
  { id: "rooms", label: "Room Placement", icon: <Home className="w-5 h-5" /> },
  { id: "spaces", label: "Open Spaces", icon: <Wind className="w-5 h-5" /> },
  { id: "results", label: "Results", icon: <BarChart3 className="w-5 h-5" /> },
];

export default function VastuCheckerPage() {
  const [currentStep, setCurrentStep] = useState<Step>("entry");
  const [mainEntry, setMainEntry] = useState<Direction | null>(null);
  const [rooms, setRooms] = useState<RoomVastu[]>([]);
  const [openSpaces, setOpenSpaces] = useState<OpenSpaces>({
    north: 3,
    south: 3,
    east: 3,
    west: 3,
  });
  const [vastuScore, setVastuScore] = useState<VastuScore | null>(null);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case "entry":
        return mainEntry !== null;
      case "rooms":
        return rooms.length >= 1; // At least one room
      case "spaces":
        return true; // Spaces have defaults
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === "spaces") {
      // Calculate score and show results
      const input: VastuInput = {
        mainEntry: mainEntry!,
        rooms,
        openSpaces,
      };
      const score = calculateVastuScore(input);
      setVastuScore(score);
      setCurrentStep("results");
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[nextIndex].id);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleReset = () => {
    setCurrentStep("entry");
    setMainEntry(null);
    setRooms([]);
    setOpenSpaces({ north: 3, south: 3, east: 3, west: 3 });
    setVastuScore(null);
  };

  const getVastuInput = (): VastuInput => ({
    mainEntry: mainEntry!,
    rooms,
    openSpaces,
  });

  return (
    <>
      <Head>
        <title>
          Vastu Compliance Checker | Analyze Your Property&apos;s Vastu Score |
          Urbanhousein
        </title>
        <meta
          name="description"
          content="Free Vastu compliance checker tool. Analyze your property's Vastu score based on room placements, entry direction, and open spaces. Get personalized recommendations for better Vastu compliance."
        />
        <meta
          name="keywords"
          content="vastu checker, vastu compliance, vastu score, vastu shastra, property vastu, home vastu, room placement vastu, vastu tips, vastu analysis, free vastu tool, vastu calculator, bedroom vastu, kitchen vastu, entry direction vastu"
        />
        <meta name="robots" content="index,follow" />
        <link
          rel="canonical"
          href="https://urbanhousein.com/tools/vastu-checker"
        />

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Vastu Compliance Checker | Analyze Your Property's Vastu Score | Urbanhousein"
        />
        <meta
          property="og:description"
          content="Free Vastu compliance checker tool. Analyze your property's Vastu score based on room placements, entry direction, and open spaces."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://urbanhousein.com/tools/vastu-checker"
        />
        <meta property="og:site_name" content="Urbanhousein" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Vastu Compliance Checker | Analyze Your Property's Vastu Score | Urbanhousein"
        />
        <meta
          name="twitter:description"
          content="Free Vastu compliance checker tool. Analyze your property's Vastu score based on room placements, entry direction, and open spaces."
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Vastu Compliance Checker Tool",
              description:
                "Free Vastu compliance checker tool to analyze your property's Vastu score based on room placements, entry direction, and open spaces.",
              url: "https://urbanhousein.com/tools/vastu-checker",
              applicationCategory: "RealEstateApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              provider: {
                "@type": "Organization",
                name: "Urbanhousein",
                url: "https://urbanhousein.com",
              },
              featureList: [
                "Entry direction analysis",
                "Room placement scoring",
                "Sleeping direction recommendations",
                "Open space evaluation",
                "Personalized Vastu recommendations",
                "Overall Vastu compliance score",
              ],
            }),
          }}
        />
      </Head>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-10 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-orange-600 mb-6 animate-fade-in-up">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ancient Wisdom, Modern Analysis
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4 animate-fade-in-up animation-delay-100">
                  Vastu Compliance Checker
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                  Analyze your property&apos;s alignment with Vastu Shastra principles
                  and get personalized recommendations for harmony and prosperity
                </p>
              </div>

              {/* Step Indicator - Only show when not in results */}
              {currentStep !== "results" && (
                <div className="max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
                  <div className="flex items-center justify-between">
                    {STEPS.slice(0, -1).map((step, index) => (
                      <div key={step.id} className="flex items-center flex-1">
                        <button
                          onClick={() => {
                            if (index < currentStepIndex) {
                              setCurrentStep(step.id);
                            }
                          }}
                          disabled={index > currentStepIndex}
                          className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300",
                            currentStep === step.id
                              ? "bg-white shadow-lg scale-105"
                              : index < currentStepIndex
                              ? "opacity-80 hover:opacity-100 cursor-pointer"
                              : "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                              currentStep === step.id
                                ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg"
                                : index < currentStepIndex
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            )}
                          >
                            {index < currentStepIndex ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              step.icon
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-xs font-medium hidden sm:block",
                              currentStep === step.id
                                ? "text-orange-600"
                                : "text-gray-500"
                            )}
                          >
                            {step.label}
                          </span>
                        </button>
                        {index < STEPS.length - 2 && (
                          <div
                            className={cn(
                              "flex-1 h-1 mx-2 rounded-full transition-all duration-300",
                              index < currentStepIndex
                                ? "bg-green-500"
                                : "bg-gray-200"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Step Content */}
              {currentStep === "entry" && (
                <Card className="border-0 shadow-2xl animate-fade-in-up">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Compass className="w-6 h-6 text-orange-600" />
                      Main Entry Direction
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Select the direction your main door/entrance faces
                    </p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <EntryDirectionSelector
                        selectedDirection={mainEntry}
                        onDirectionSelect={setMainEntry}
                      />

                      {/* Vastu Info */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-800 mb-1">
                              Entry Direction Tips
                            </h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                              <li>
                                <strong>Northeast (NE)</strong> - Most auspicious,
                                brings prosperity
                              </li>
                              <li>
                                <strong>North & East</strong> - Excellent for health
                                and success
                              </li>
                              <li>
                                <strong>South & Southwest</strong> - Generally
                                avoided in Vastu
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === "rooms" && (
                <Card className="border-0 shadow-2xl animate-fade-in-up">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Home className="w-6 h-6 text-orange-600" />
                      Room Placements
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Add the rooms in your property and their directions
                    </p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <RoomInput rooms={rooms} onRoomsChange={setRooms} />

                    {/* Vastu Info */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-800 mb-1">
                            Room Placement Tips
                          </h4>
                          <ul className="text-sm text-amber-700 space-y-1">
                            <li>
                              <strong>Master Bedroom</strong> - Southwest is ideal
                            </li>
                            <li>
                              <strong>Kitchen</strong> - Southeast (fire element)
                            </li>
                            <li>
                              <strong>Puja Room</strong> - Northeast for spiritual
                              energy
                            </li>
                            <li>
                              <strong>Living Room</strong> - North, East, or
                              Northeast
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === "spaces" && (
                <Card className="border-0 shadow-2xl animate-fade-in-up">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Wind className="w-6 h-6 text-orange-600" />
                      Open Space Distribution
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Rate the amount of open space around your property in each
                      direction
                    </p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <OpenSpaceSliders
                      openSpaces={openSpaces}
                      onOpenSpacesChange={setOpenSpaces}
                    />
                  </CardContent>
                </Card>
              )}

              {currentStep === "results" && vastuScore && (
                <VastuResults
                  score={vastuScore}
                  input={getVastuInput()}
                  onReset={handleReset}
                />
              )}

              {/* Navigation Buttons */}
              {currentStep !== "results" && (
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStepIndex === 0}
                    className="px-6 py-3"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  >
                    {currentStep === "spaces" ? (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analyze Vastu Score
                      </>
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Benefits Section */}
          {currentStep === "entry" && (
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
                  Why Check Vastu Compliance?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Compass className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Positive Energy Flow
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Proper Vastu alignment ensures positive cosmic energy flows
                      through your home, promoting health and prosperity.
                    </p>
                  </Card>

                  <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Better Property Value
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Vastu-compliant properties often command better resale value
                      as many buyers prioritize these principles.
                    </p>
                  </Card>

                  <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Harmony & Well-being
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Following Vastu principles creates a harmonious living
                      environment that supports mental peace and family bonding.
                    </p>
                  </Card>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
