"use client";

import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthTest() {
  const { data: session, status } = useSession();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Status Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">NextAuth Session:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p>
                <strong>Status:</strong> {status}
              </p>
              <p>
                <strong>User:</strong> {session?.user?.email || "Not signed in"}
              </p>
              <p>
                <strong>Provider:</strong>{" "}
                {session?.user?.googleId ? "Google" : "None"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Auth Store:</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p>
                <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
              </p>
              <p>
                <strong>User:</strong> {user?.email || "Not signed in"}
              </p>
              <p>
                <strong>Provider:</strong> {user?.authProvider || "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">User Details:</h3>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">Session Details:</h3>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
