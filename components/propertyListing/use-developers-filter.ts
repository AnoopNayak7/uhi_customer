"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export type DeveloperOption = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

export function useDevelopersFilter(enabled = true) {
  const [developers, setDevelopers] = useState<DeveloperOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const loadDevelopers = async () => {
      setLoading(true);
      try {
        const response = (await apiClient.getDevelopers({
          limit: 200,
        })) as {
          success?: boolean;
          data?: { developers?: DeveloperOption[] };
        };

        if (!cancelled && response?.data?.developers) {
          setDevelopers(
            response.data.developers
              .filter((developer) => developer.id && developer.name)
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      } catch (error) {
        console.error("Failed to load developers:", error);
        if (!cancelled) {
          setDevelopers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDevelopers();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { developers, loading };
}
