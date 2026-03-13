import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Share2,
  BarChart3,
  Utensils,
  Palette,
  Users,
  ArrowRight,
  ExternalLink,
  Play,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// Map icon names from config to actual components
const iconMap: Record<string, React.ElementType> = {
  Camera,
  Share2,
  BarChart3,
  Utensils,
  Palette,
  Users,
};

export default function HomePage() {
  const instagramPosts = [
    {
      src: "/images/instagram/post-0.jpg",
      href: "https://www.instagram.com/p/DUrGF-0ksnX/",
      caption: "Some Feb. drink inspo",
      isVideo: false,
    },
    {
      src: "/images/instagram/post-1.jpg",
      href: "https://www.instagram.com/p/DUqn2vyCYlC/",
      caption: "Sample feed layout from a client content session",
      isVideo: false,
    },
    {
      src: "/images/instagram/post-2.jpg",
      href: "https://www.instagram.com/p/DUkFn6RkXoD/",
      caption: "Sneak peek from a recent content session",
      isVideo: false,
    },
    {
      src: "/images/instagram/post-3.jpg",
      href: "https://www.instagram.com/p/DUb04VgkkCt/",
      caption: "Official launch of Hannah Content Co",
      isVideo: false,
    },
    {
      src: "/images/instagram/post-4.jpg",
      href: "https://www.instagram.com/p/DUZPieVkvnK/",
      caption: "Valentine's Day color story",
      isVideo: false,
    },
    {
      src: "/images/instagram/post-5.jpg",
      href: "https://www.instagram.com/p/DUMvT__jbl5/",
      caption: "Reel teaser",
      isVideo: true,
    },
    {
      src: "/images/instagram/post-6.jpg",
      href: "https://www.instagram.com/p/DUJ21sIkkm5/",
      caption: "Crush digital diary reel",
      isVideo: true,
    },
    {
      src: "/images/instagram/post-7.jpg",
      href: "https://www.instagram.com/p/DUEDZjzjyWM/",
      caption: "Community spotlight",
      isVideo: false,
    },
    {
      src: "/images/instagram/post-8.jpg",
      href: "https://www.instagram.com/p/DUBauYOj_5D/",
      caption: "Why monthly content sessions work",
      isVideo: true,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#dceaff]/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#fff4bf]/60 blur-3xl" />
        <div className="container-marketing relative">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
                HannahContentCo
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-surface-900 sm:text-5xl">
                Content creation for
                <span className="block text-[#cf9800]">local eats and sips</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-surface-600 sm:text-lg">
                Spokane-based social content for food and drink brands that want
                scroll-stopping visuals and consistent growth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary px-7 py-3 text-base">
                  Start a Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary px-7 py-3 text-base"
                >
                  View Instagram
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 flex gap-8 text-sm text-surface-500">
                <div>
                  <p className="text-2xl font-semibold text-brand-700">110+</p>
                  <p>Following</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-brand-700">86+</p>
                  <p>Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-brand-700">60+</p>
                  <p>Posts</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-3xl border border-brand-100 bg-white p-3 shadow-sm">
              {instagramPosts.slice(0, 6).map((post, i) => (
                <a
                  key={post.href}
                  href={post.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative overflow-hidden rounded-2xl ${
                    i % 3 === 0 ? "row-span-2 aspect-[4/5]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={post.src}
                    alt={post.caption}
                    fill
                    sizes="(max-width: 1024px) 33vw, 260px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {post.isVideo && (
                    <span className="absolute right-2 top-2 rounded-full bg-black/55 p-1.5 text-white">
                      <Play className="h-3 w-3 fill-current" />
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-marketing">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
                Recent Work
              </p>
              <h2 className="mt-2 text-3xl font-bold text-surface-900 sm:text-4xl">
                Fresh from Instagram
              </h2>
              <p className="mt-3 max-w-2xl text-surface-600">
                Real posts from @hannahcontentco. Tap any tile to view the full post.
              </p>
            </div>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-medium text-brand-700 transition-colors hover:text-brand-800"
            >
              Open profile
              <ExternalLink className="ml-1.5 h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instagramPosts.map((post) => (
              <a
                key={post.href}
                href={post.href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={post.src}
                    alt={post.caption}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {post.isVideo && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm leading-relaxed text-surface-700">
                    {post.caption}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-brand-100 py-16 sm:py-20">
        <div className="container-marketing">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Services
            </p>
            <h2 className="mt-2 text-3xl font-bold text-surface-900 sm:text-4xl">
              What We Create
            </h2>
            <p className="mt-4 text-surface-600">
              Everything needed to plan, shoot, and publish content that feels
              consistent with your brand.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.services.map((service) => {
              const Icon = iconMap[service.icon] || Camera;
              return (
                <div
                  key={service.title}
                  className="group rounded-2xl border border-surface-200 bg-white p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-[#fff4bf]">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-surface-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-surface-600">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-700 py-16 sm:py-20">
        <div className="container-marketing text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to make your brand look this good?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Book a content session and get strategic, ready-to-post assets for your next month of social.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center rounded-lg bg-[#f1b900] px-8 py-3 text-sm font-semibold text-surface-900 transition-colors hover:bg-[#d9a700]"
          >
            Book Your Session
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
