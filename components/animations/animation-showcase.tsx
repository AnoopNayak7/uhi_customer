"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
  HoverScale,
  AnimatedCounter,
} from "./motion-wrapper";
import {
  CardHover,
  ButtonAnimation,
  FloatingAnimation,
  PulseAnimation,
} from "./page-transitions";
import { MobileFadeIn, TouchButton, ParallaxScroll } from "./mobile-animations";
import { Heart, Star, TrendingUp, Zap } from "lucide-react";

export const AnimationShowcase = () => {
  const [counter, setCounter] = useState(0);
  const [showStagger, setShowStagger] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Header */}
      <MotionWrapper variant="fadeInDown">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Animation Showcase</h1>
          <p className="text-gray-600">
            Experience smooth animations throughout the app
          </p>
        </div>
      </MotionWrapper>

      {/* Basic Animations */}
      <section>
        <MotionWrapper variant="fadeInLeft" delay={0.2}>
          <h2 className="text-2xl font-semibold mb-6">Basic Animations</h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MotionWrapper variant="fadeInUp" delay={0.1}>
            <Card className="p-6 text-center">
              <h3 className="font-medium mb-2">Fade In Up</h3>
              <p className="text-sm text-gray-600">
                Smooth entrance from bottom
              </p>
            </Card>
          </MotionWrapper>

          <MotionWrapper variant="scaleIn" delay={0.2}>
            <Card className="p-6 text-center">
              <h3 className="font-medium mb-2">Scale In</h3>
              <p className="text-sm text-gray-600">Grows from center</p>
            </Card>
          </MotionWrapper>

          <MotionWrapper variant="slideInUp" delay={0.3}>
            <Card className="p-6 text-center">
              <h3 className="font-medium mb-2">Slide In Up</h3>
              <p className="text-sm text-gray-600">Slides from bottom</p>
            </Card>
          </MotionWrapper>
        </div>
      </section>

      {/* Interactive Animations */}
      <section>
        <MotionWrapper variant="fadeInRight" delay={0.4}>
          <h2 className="text-2xl font-semibold mb-6">
            Interactive Animations
          </h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardHover>
            <Card className="p-6 text-center cursor-pointer">
              <Heart className="w-8 h-8 mx-auto mb-3 text-red-500" />
              <h3 className="font-medium">Hover Card</h3>
              <p className="text-sm text-gray-600 mt-2">Hover for effect</p>
            </Card>
          </CardHover>

          <HoverScale>
            <Card className="p-6 text-center cursor-pointer">
              <Star className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-medium">Scale Hover</h3>
              <p className="text-sm text-gray-600 mt-2">Scales on hover</p>
            </Card>
          </HoverScale>

          <FloatingAnimation>
            <Card className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-medium">Floating</h3>
              <p className="text-sm text-gray-600 mt-2">Gentle float</p>
            </Card>
          </FloatingAnimation>

          <PulseAnimation>
            <Card className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-medium">Pulse</h3>
              <p className="text-sm text-gray-600 mt-2">Subtle pulse</p>
            </Card>
          </PulseAnimation>
        </div>
      </section>

      {/* Button Animations */}
      <section>
        <MotionWrapper variant="fadeInUp" delay={0.5}>
          <h2 className="text-2xl font-semibold mb-6">Button Animations</h2>
        </MotionWrapper>

        <div className="flex flex-wrap gap-4">
          <Button>Default Animated</Button>
          <Button animate={false}>No Animation</Button>
          <ButtonAnimation>
            <Button variant="outline">Custom Animation</Button>
          </ButtonAnimation>
          <TouchButton onClick={() => setCounter(counter + 1)}>
            Touch Button ({counter})
          </TouchButton>
        </div>
      </section>

      {/* Staggered Animations */}
      <section>
        <MotionWrapper variant="fadeInLeft" delay={0.6}>
          <h2 className="text-2xl font-semibold mb-6">Staggered Animations</h2>
        </MotionWrapper>

        <div className="space-y-4">
          <Button onClick={() => setShowStagger(!showStagger)}>
            {showStagger ? "Hide" : "Show"} Stagger Animation
          </Button>

          {showStagger && (
            <StaggerContainer>
              {Array.from({ length: 6 }).map((_, i) => (
                <StaggerItem key={i}>
                  <Card className="p-4 mb-2">
                    <div className="flex items-center justify-between">
                      <span>Staggered Item {i + 1}</span>
                      <Badge variant="outline">#{i + 1}</Badge>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Mobile Optimized */}
      <section>
        <MotionWrapper variant="fadeInRight" delay={0.7}>
          <h2 className="text-2xl font-semibold mb-6">Mobile Optimized</h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MobileFadeIn delay={0.1}>
            <Card className="p-6">
              <h3 className="font-medium mb-2">Mobile Fade In</h3>
              <p className="text-sm text-gray-600">
                Optimized animation duration and easing for mobile devices
              </p>
            </Card>
          </MobileFadeIn>

          <ParallaxScroll offset={30}>
            <Card className="p-6">
              <h3 className="font-medium mb-2">Parallax Scroll</h3>
              <p className="text-sm text-gray-600">
                Reduced parallax effect on mobile for better performance
              </p>
            </Card>
          </ParallaxScroll>
        </div>
      </section>

      {/* Counter Animation */}
      <section>
        <MotionWrapper variant="fadeInUp" delay={0.8}>
          <h2 className="text-2xl font-semibold mb-6">Animated Counter</h2>
        </MotionWrapper>

        <Card className="p-8 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            <AnimatedCounter from={0} to={1000} duration={2} />+
          </div>
          <p className="text-gray-600">Happy Customers</p>
        </Card>
      </section>

      {/* Performance Note */}
      <MotionWrapper variant="fadeInUp" delay={0.9}>
        <Card className="p-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Performance Optimized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              All animations are optimized for mobile devices with reduced
              motion, hardware acceleration, and efficient rendering. The system
              automatically detects mobile devices and adjusts animation
              parameters accordingly.
            </p>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
};
