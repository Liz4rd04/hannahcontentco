import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const { about } = siteConfig;

  return (
    <>
      <section className="py-20">
        <div className="container-marketing text-center">
          <h1 className="text-4xl font-bold text-surface-900 sm:text-5xl">
            {about.headline}
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-marketing">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              {about.story.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-4 first:mt-0 leading-relaxed text-surface-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div>
              {/* Replace with your team photo at /public/images/team.jpg */}
              <div className="aspect-[4/3] rounded-2xl bg-surface-100" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-surface-100 py-16">
        <div className="container-marketing">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-600">{stat.value}</p>
                <p className="mt-1 text-sm text-surface-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
