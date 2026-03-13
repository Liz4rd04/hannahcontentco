// ============================================================
// 🎨 SITE CONFIGURATION
// ============================================================
// This is the ONE file you edit to change all your marketing
// content, business info, services, colors, and more.
// No code knowledge needed — just change the text between quotes.
// ============================================================

export const siteConfig = {
  // --- Business Info ---
  name: "HannahContentCo",
  tagline: "Social Media Management for Food & Drink",
  description:
    "We help local restaurants, bars, cafés, and food brands build mouth-watering social media presences that bring customers through the door.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.instagram.com/hannahcontentco/",

  // --- Contact Info ---
  contact: {
    email: "hanrenaeb@gmail.com",
    phone: "(208) 301-3663",
  },

  // --- Social Media Links ---
  // Leave blank or remove any you don't use
  social: {
    instagram: "https://instagram.com/hannahcontentco",
    facebook: "",
    tiktok: "",
    linkedin: "",
    twitter: "",
  },

  // --- Navigation Links ---
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  // --- Hero Section (Home Page) ---
  hero: {
    headline: "We Make Your Food Famous",
    subheadline:
      "Strategic social media management that turns your dishes into destinations. We handle the content — you handle the kitchen.",
    ctaText: "Get Started",
    ctaLink: "/contact",
    // Change this to your own hero image in /public/images/
    backgroundImage: "/images/hero-bg.jpg",
  },

  // --- Services ---
  services: [
    {
      title: "Content Creation",
      description:
        "Professional food photography and video that makes mouths water. We capture your dishes, drinks, and atmosphere in their best light.",
      icon: "Camera",
    },
    {
      title: "Social Media Management",
      description:
        "Daily posting, community engagement, and story creation across Instagram, Facebook, and TikTok. We keep your feed fresh and your audience growing.",
      icon: "Share2",
    },
    {
      title: "Strategy & Analytics",
      description:
        "Data-driven strategies tailored for food and beverage businesses. Monthly reports that show real growth in followers, engagement, and foot traffic.",
      icon: "BarChart3",
    },
    {
      title: "Menu & Promo Shoots",
      description:
        "Seasonal menu launches, special event coverage, and promotional campaigns that drive reservations and orders.",
      icon: "Utensils",
    },
    {
      title: "Brand Identity",
      description:
        "Cohesive visual identity for your social channels — from color palettes and templates to highlight covers and bio optimization.",
      icon: "Palette",
    },
    {
      title: "Influencer Partnerships",
      description:
        "We connect you with local food influencers and bloggers who bring authentic buzz to your business.",
      icon: "Users",
    },
  ],

  // --- About Page ---
  about: {
    headline: "Passionate About Local Food Culture",
    story: `We started HannahContentCo because we believe every local restaurant, café, and bar deserves a social media presence that matches the passion they put into their food.

Our team combines deep food industry knowledge with social media expertise. We've worked with over 50 local food and drink businesses, from neighborhood coffee shops to award-winning restaurants.

We're not just another social media agency — we're foodies who understand that a great flat lay of avocado toast can drive real business results.`,
    // Change to your team photo in /public/images/
    teamImage: "/images/team.jpg",
    stats: [
      { label: "Clients Served", value: "50+" },
      { label: "Posts Created", value: "10,000+" },
      { label: "Combined Followers Grown", value: "500K+" },
      { label: "Years Experience", value: "5+" },
    ],
  },

  // --- Testimonials ---
  testimonials: [
    {
      quote:
        "HannahContentCo transformed our Instagram. We went from 200 followers to 5,000 in six months, and we see new customers mentioning our posts every week.",
      name: "Maria Chen",
      title: "Owner, The Golden Dumpling",
    },
    {
      quote:
        "They get food. They know what makes a dish look irresistible on screen. Our online orders jumped 40% after they took over our social media.",
      name: "James Rodriguez",
      title: "Head Chef, Fuego Kitchen",
    },
    {
      quote:
        "Professional, creative, and so easy to work with. They handle everything and our feeds have never looked better.",
      name: "Sarah Kim",
      title: "Manager, Brew & Bean Coffee",
    },
  ],

  // --- Footer ---
  footer: {
    tagline: "Making local food famous, one post at a time.",
    copyright: `© ${new Date().getFullYear()} HannahContentCo. All rights reserved.`,
  },
};

// --- Type export for use throughout the app ---
export type SiteConfig = typeof siteConfig;
