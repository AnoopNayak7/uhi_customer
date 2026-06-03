"use client";

import { motion } from "framer-motion";
import { ArrowRight, Scale, FileSearch, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ReraCheckSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-lg">
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/4 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              RERA verification
            </div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
              Check litigations &amp; property details by{" "}
              <span className="text-emerald-700">RERA ID</span>
            </h2>
            <p className="mt-4 text-sm text-gray-600 md:text-base">
              Check RERA registration, project documents, reviews,
              and litigation records — in one report.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-emerald-600" />
                Official RERA project &amp; possession details
              </li>
              <li className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-600" />
                Court records &amp; litigation scan
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="text-sm text-gray-500 md:text-right">
              Example: PRM/KA/RERA/1251/308/PR/171220/005988
            </p>
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            >
              <Link href="/tools/rera-check">
                Check by RERA ID
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
