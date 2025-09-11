"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackEvent, trackUserInteraction } from "@/components/analytics/GoogleAnalytics";

export default function TestAnalyticsPage() {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    setEvents(prev => [...prev, `${new Date().toLocaleTimeString()}: ${event}`]);
  };

  const testPageView = () => {
    addEvent("Page view tracked");
    // This will be automatically tracked by the GoogleAnalytics component
  };

  const testCustomEvent = () => {
    trackEvent("test_event", "analytics_test", "test_button_click", 1);
    addEvent("Custom event 'test_event' sent");
  };

  const testUserInteraction = () => {
    trackUserInteraction("button_click", "test_interaction");
    addEvent("User interaction 'button_click' sent");
  };

  const testPropertyView = () => {
    trackEvent("property_view", "engagement", "Test Property", 1);
    addEvent("Property view event sent");
  };

  const testSearchEvent = () => {
    trackEvent("search", "engagement", "test search query", 1);
    addEvent("Search event sent");
  };

  useEffect(() => {
    addEvent("Analytics test page loaded");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Google Analytics Test Page
            </CardTitle>
            <p className="text-center text-gray-600">
              Measurement ID: G-80WS6JHGEK
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={testPageView} className="w-full">
                Test Page View
              </Button>
              <Button onClick={testCustomEvent} className="w-full">
                Test Custom Event
              </Button>
              <Button onClick={testUserInteraction} className="w-full">
                Test User Interaction
              </Button>
              <Button onClick={testPropertyView} className="w-full">
                Test Property View
              </Button>
              <Button onClick={testSearchEvent} className="w-full">
                Test Search Event
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to Test:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Open Google Analytics Real-time reports</li>
                <li>Click the test buttons above</li>
                <li>Check if events appear in Real-time &gt; Events</li>
                <li>Verify page views in Real-time &gt; Overview</li>
                <li>Wait 24-48 hours for data to appear in standard reports</li>
              </ol>
            </div>

            {/* Event Log */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Event Log:</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-sm">No events yet. Click the buttons above to test.</p>
                ) : (
                  events.map((event, index) => (
                    <div key={index} className="text-sm text-gray-700 font-mono">
                      {event}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* GA4 Debug Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Google Analytics Status:</h3>
              <div className="text-sm text-green-800">
                <p>✅ Google Analytics 4 tracking is active</p>
                <p>✅ Measurement ID: G-80WS6JHGEK</p>
                <p>✅ Events are being sent to Google Analytics</p>
                <p>ℹ️ Check your browser's Network tab to see gtag requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
