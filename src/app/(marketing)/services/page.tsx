import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="py-20">
        <div className="container-marketing text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Services & Pricing
          </p>
          <h1 className="mt-3 text-4xl font-bold text-surface-900 sm:text-5xl">
            Social Content Packages
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-surface-600">
            Mostly hands-on, on-site support for food and drink businesses that want
            clean visuals, better consistency, and less stress around posting.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-marketing grid gap-8 lg:grid-cols-3">
          <article className="rounded-2xl border border-surface-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-surface-900">
              One-Time Content Session
            </h2>
            <p className="mt-2 text-2xl font-semibold text-brand-700">$150</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#cf9800]">
              Inclusions
            </p>
            <ul className="mt-3 space-y-2.5">
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                One on-site content session
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Curated collection of ready-to-post photos and videos
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Caption inspiration and posting guidance
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Content styled to reflect your brand and atmosphere
              </li>
            </ul>
            <p className="mt-5 text-sm font-medium text-surface-800">
              Perfect for businesses who are:
            </p>
            <p className="mt-2 text-sm text-surface-600">
              Newly considering how a social media presence could benefit their business
              or needing help coordinating their start on social media.
            </p>
            <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-800">
              One-time session booking is limited to 2 per year, per business.
            </p>
          </article>

          <article className="rounded-2xl border border-surface-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-surface-900">
              Seasonal Menu Content
            </h2>
            <p className="mt-2 text-2xl font-semibold text-brand-700">$200</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#cf9800]">
              Inclusions
            </p>
            <ul className="mt-3 space-y-2.5">
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                On-site content session
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Menu or seasonal offering-specific content
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Edited posts and reels highlighting new products
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Ready-to-use photo layouts with product name, price, and description
              </li>
            </ul>
            <p className="mt-5 text-sm font-medium text-surface-800">
              Perfect for businesses who are:
            </p>
            <p className="mt-2 text-sm text-surface-600">
              Launching a new or updated menu, or offering seasonal products and specials.
            </p>
          </article>

          <article className="rounded-2xl border border-brand-200 bg-gradient-to-b from-white to-brand-50 p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-surface-900">
              Monthly Content Support
            </h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#cf9800]">
              Pricing
            </p>
            <ul className="mt-2 space-y-1 text-surface-800">
              <li className="text-base font-semibold">1 session per month: $400</li>
              <li className="text-base font-semibold">2 sessions per month: $500</li>
            </ul>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#cf9800]">
              Inclusions
            </p>
            <ul className="mt-3 space-y-2.5">
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                On-site content session(s)
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Edited feed photos, reels, and story posts
              </li>
              <li className="flex items-start gap-2 text-sm text-surface-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                Partial management, including weekly posting and captions
              </li>
            </ul>
            <p className="mt-5 text-sm font-medium text-surface-800">
              Perfect for businesses who are:
            </p>
            <p className="mt-2 text-sm text-surface-600">
              Ready to step into a consistent social media presence, or already active
              but wanting a more cohesive feed.
            </p>
          </article>
        </div>
      </section>

      <section className="border-t border-brand-100 py-16 text-center">
        <div className="container-marketing">
          <h2 className="text-2xl font-bold text-surface-900">
            Need help choosing the right package?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-surface-500">
            Send a quick message and we can pick the best fit for your goals and schedule.
          </p>
          <Link href="/contact" className="btn-primary mt-6">
            Contact Hannah
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
