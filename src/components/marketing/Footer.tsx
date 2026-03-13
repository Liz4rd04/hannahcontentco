import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const socialIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

export default function Footer() {
  const activeSocials = Object.entries(siteConfig.social).filter(
    ([, url]) => url
  );

  return (
    <footer className="border-t border-surface-100 bg-surface-50">
      <div className="container-marketing py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-surface-900">
              {siteConfig.name}
            </p>
            <p className="mt-2 text-sm text-surface-500">
              {siteConfig.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-semibold text-surface-900">Links</p>
            <div className="mt-3 space-y-2">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-surface-500 hover:text-surface-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <p className="text-sm font-semibold text-surface-900">Contact</p>
            <div className="mt-3 space-y-1 text-sm text-surface-500">
              <p>{siteConfig.contact.email}</p>
              <p>{siteConfig.contact.phone}</p>
              
            </div>
            {activeSocials.length > 0 && (
              <div className="mt-4 flex gap-3">
                {activeSocials.map(([platform, url]) => {
                  const Icon = socialIcons[platform];
                  return Icon ? (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-surface-400 hover:bg-surface-200 hover:text-surface-700 transition-colors"
                      aria-label={platform}
                    >
                      <Icon size={18} />
                    </a>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-surface-200 pt-6 text-center text-xs text-surface-400">
          {siteConfig.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
