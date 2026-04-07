import Link from "next/link";
import { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  lastUpdated: string;
  active: "privacy" | "terms" | "cookies";
  children: ReactNode;
};

const links = [
  { href: "/privacy", label: "Privacy", key: "privacy" },
  { href: "/terms", label: "Terms", key: "terms" },
  { href: "/cookies", label: "Cookies", key: "cookies" },
];

export default function LegalPageLayout({
  title,
  lastUpdated,
  active,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="shell">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="top-nav-link">
            <span aria-hidden="true">←</span>
            Back to home
          </Link>

          <div className="flex flex-wrap gap-2">
            {links.map((link) => {
              const isActive = link.key === active;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-white text-slate-950"
                      : "border border-white/12 bg-white/6 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Legal</p>
            <h1 className="section-title mt-5 text-4xl font-bold text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-slate-300">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/5 p-5 sm:p-6 lg:p-8">
            <div className="space-y-6 text-sm font-medium leading-8 text-slate-300 sm:text-base">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
