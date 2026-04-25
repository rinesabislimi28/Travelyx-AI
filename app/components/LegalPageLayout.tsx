"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  lastUpdated: string;
  active: "privacy" | "terms" | "cookies";
  children: ReactNode;
};


export default function LegalPageLayout({
  title,
  lastUpdated,
  active,
  children,
}: LegalPageLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="shell">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => router.back()} className="top-nav-link">
            <span aria-hidden="true">←</span>
            Go back
          </button>


        </div>

        <div className="panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Legal</p>
            <h1 className="section-title mt-5 text-4xl font-bold text-[var(--foreground)] sm:text-5xl">{title}</h1>
            <p className="mt-4 inline-flex rounded-full border border-[var(--line)] bg-white/6 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="mt-8 rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6 lg:p-8">
            <div className="space-y-6 text-sm font-medium leading-8 text-[var(--muted)] sm:text-base">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
