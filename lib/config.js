// ─────────────────────────────────────────────
// EDIT YOUR CONTENT HERE — NO CODING NEEDED
// Paste image URLs, website links, WhatsApp number
// and the whole site updates automatically.
// ─────────────────────────────────────────────

// Masks the back half of a handle/name so a visitor gets the idea without
// seeing the real client identity, e.g. "gitamanishi" -> "gitama•••••"
export function maskHandle(name) {
  const visible = Math.ceil(name.length / 2);
  return name.slice(0, visible) + "•".repeat(name.length - visible);
}

export const CONFIG = {
  // AGENCY INFO
  agencyName: "Digi1Xprt",
  tagline: "Making Brands Do Big.",
  email: "director@digi1xprt.com",
  whatsapp: "919892929551", // your WhatsApp number with country code, no +
  location: "India",

  // GROWTH STORY — real case-study numbers + real reels shown in the Hero
  // and Results sections. The client handle is masked in our own copy (see
  // maskHandle) — note Instagram's own embed widget below always shows the
  // real handle on its card, since that's baked into Instagram's embed.js.
  growthStory: {
    eyebrow: "Proof, Not Promises",
    handle: "gitamanishi",
    platform: "Instagram & Facebook",
    before: { value: 16000, display: "16K", date: "Dec 2025", tag: "Before Digi1Xprt" },
    after: { value: 250000, display: "250K", date: "Jul 2026", tag: "With Digi1Xprt" },
    multiplier: "15.6×",
    span: "7 months",
    tactics: [
      "Targeted paid promotion",
      "Consistent content engine",
      "Community-first engagement",
    ],
    source: "Facebook Page Insights · Dec 2025 – Jul 2026",
    // Real Instagram reel permalinks — paste more here as they come in.
    reelUrls: [
      "https://www.instagram.com/reel/DUDj--HCNSA/",
      "https://www.instagram.com/reel/DdFj4YJSCs7/",
      "https://www.instagram.com/reel/DI9HBttzPSe/",
    ],
  },

  // PORTFOLIO ITEMS
  // image   -> creative image URL
  // website -> paste a URL here to open it inside an in-page viewer. Leave "" for none.
  // filter  -> one of: all, branding, social, ads, web, content
  // wide / tall -> layout hints for the magazine-style grid
  portfolio: [
    {
      image: "/images/image1.png",
      website: "https://gieogita.org/",
      tag: "Gieogita",
      title: "Gieogita — Brand Identity & Website",
      blurb: "Full brand identity and website design for a global spiritual and cultural organization.",
      filter: "branding",
      wide: true,
    },
    {
      image: "/images/image2.png",
      website: "https://goalballindia.in/",
      tag: "Goalball India",
      title: "Goalball India — website & branding",
      blurb: "A clean, accessible website and brand refresh for India's national goalball federation.",
      filter: "social",
      tall: true,
    },
    {
      image: "/images/image3.png",
      website: "https://manchestergitafestival.com/",
      tag: "Manchester Gita Festival",
      title: "Manchester Gita Festival — Branding & Website",
      blurb: "Event branding and a festival website built to drive registrations and awareness.",
      filter: "branding",
    },
    {
      image: "/images/image4.png",
      website: "https://www.gieogita.org.uk/",
      tag: "Gieogita UK",
      title: "Gieogita UK — Branding & Website",
      blurb: "A UK chapter site and brand extension, designed to match the parent organization.",
      filter: "ads",
    },
    {
      image: "/images/image5.png",
      website: "https://akiraconsulting.jp/",
      tag: "Akira Consulting",
      title: "Akira Consulting — Branding & Website",
      blurb: "Corporate branding and a bilingual business site for a Japan-based consulting firm.",
      filter: "content",
    },
    {
      image: "",
      website: "",
      tag: "RoomKiPhoto",
      title: "RoomKiPhoto — Pinterest-Style Interior Inspiration",
      blurb: "A Pinterest-style interior inspiration platform — currently in development.",
      filter: "web",
      comingSoon: true,
    },
  ],

  // TESTIMONIALS
  testimonials: [
    {
      quote:
        "Digi1Xprt transformed our brand completely. The designs are stunning and our engagement has tripled in just two months.",
      name: "Rahul Aggarwal",
      role: "Founder, StyleBox India",
      initials: "RA",
    },
    {
      quote:
        "The team understood our vision instantly. Our social media presence went from zero to thousands of genuine followers in weeks.",
      name: "Priya Sharma",
      role: "CEO, FreshMart",
      initials: "PS",
    },
    {
      quote:
        "Our ad campaigns now give 6× ROAS consistently. These guys know their stuff and communicate every step of the way.",
      name: "Arjun Kaul",
      role: "Marketing Head, TechBridge",
      initials: "AK",
    },
  ],

  // STATS (hero + banner)
  stats: [
    { num: "150+", label: "Projects Delivered" },
    { num: "98%", label: "Client Retention" },
    { num: "6×", label: "Average ROAS" },
    { num: "3yr", label: "In The Game" },
  ],
  bannerStats: [
    { num: "150+", label: "Projects Delivered" },
    { num: "6.2×", label: "Avg. ROAS on Paid Ads" },
    { num: "98%", label: "Client Retention Rate" },
    { num: "3yr", label: "Building Brands That Last" },
  ],

  // SERVICES
  // metric.trend shapes are deliberately different per service — each one
  // mirrors how that channel actually tends to move (SEO compounds slowly
  // then spikes, paid ads dip during the learning phase then climb, social
  // is spiky, etc.) rather than being six copies of the same upward curve.
  // Example figures — edit to match your real average results before
  // publishing (same as the other placeholder content).
  services: [
    {
      num: "01",
      title: "Brand Identity Design",
      desc: "Logos, color systems, typography, and brand guidelines that make you instantly recognizable and unforgettable.",
      // steady, near-linear climb
      metric: { value: "+38%", label: "Avg. Brand Recall Lift", trend: [24, 33, 42, 51, 61, 70] },
    },
    {
      num: "02",
      title: "Social Media Marketing",
      desc: "Strategic content creation and community management that grows your audience and drives meaningful engagement.",
      // spiky — algorithm-driven, up and down before trending up
      metric: { value: "4.1×", label: "Avg. Engagement Growth", trend: [30, 46, 36, 62, 48, 80] },
    },
    {
      num: "03",
      title: "Performance Advertising",
      desc: "Data-driven paid campaigns across Meta, Google, and more — optimized for maximum return on every rupee spent.",
      // J-curve — dips during the learning phase, then ROAS ramps
      metric: { value: "6.2×", label: "Average ROAS", trend: [42, 33, 30, 46, 68, 92] },
    },
    {
      num: "04",
      title: "Content Creation",
      desc: "Reels, graphics, carousels, and copy that stop the scroll. Every piece crafted with strategy and creativity.",
      // fast early spike, then holds near the top
      metric: { value: "+215%", label: "Avg. Reach Increase", trend: [20, 58, 72, 68, 76, 82] },
    },
    {
      num: "05",
      title: "Website Design & Dev",
      desc: "Fast, conversion-focused websites that look stunning and turn visitors into paying customers.",
      // staircase — each redesign sprint steps conversion up, then holds
      metric: { value: "+47%", label: "Avg. Conversion Lift", trend: [28, 30, 52, 54, 76, 78] },
    },
    {
      num: "06",
      title: "SEO & Growth Strategy",
      desc: "Long-term organic growth through technical SEO, content strategy, and competitive positioning.",
      // classic SEO hockey stick — slow build, then compounding acceleration
      metric: { value: "+180%", label: "Avg. Organic Traffic Growth", trend: [14, 17, 21, 29, 47, 86] },
    },
  ],

  // PROCESS STEPS
  process: [
    {
      step: "01",
      title: "Discover",
      desc: "We dig deep into your brand, audience, and goals to understand what success looks like for you.",
    },
    {
      step: "02",
      title: "Strategize",
      desc: "We build a focused plan — channels, messaging, timelines, and KPIs — before touching a single creative.",
    },
    {
      step: "03",
      title: "Create",
      desc: "Our team produces campaign-ready content, ads, and brand assets built to perform and impress.",
    },
    {
      step: "04",
      title: "Optimize",
      desc: "We track, test, and refine continuously — every data point informs the next iteration for compounding growth.",
    },
  ],

  // WHY US — perks list
  perks: [
    {
      title: "Fast Turnaround",
      desc: "We move with urgency without sacrificing quality. Deadlines are sacred to us.",
    },
    {
      title: "Strategy First",
      desc: "Every creative decision is backed by data and aligned with your business goals.",
    },
    {
      title: "True Partnership",
      desc: "We treat your brand like our own — full transparency, no hidden fees, ever.",
    },
  ],

  // MARQUEE ITEMS
  marqueeItems: [
    "Brand Identity",
    "Social Media",
    "Performance Ads",
    "Web Design",
    "Content Creation",
    "SEO Growth",
    "Reels & Video",
    "Meta Ads",
    "Google Ads",
    "Logo Design",
  ],

  // NAV LINKS
  navLinks: [
    { href: "#services", label: "Services" },
    { href: "#capabilities", label: "How We Work" },
    { href: "#portfolio", label: "Work" },
    { href: "#process", label: "Process" },
    { href: "#why", label: "About" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ],

  // PORTFOLIO FILTERS
  portfolioFilters: [
    { key: "all", label: "All" },
    { key: "branding", label: "Branding" },
    { key: "social", label: "Social" },
    { key: "ads", label: "Ads" },
    { key: "content", label: "Content" },
  ],

  // CAPABILITIES — a deep-dive on the same categories used in the portfolio
  // filters above (branding/social/ads/content), explaining the actual
  // tools, channels and techniques behind each one. "Ads" is split into two
  // groups: what the audience sees (the actual ad placements) vs what runs
  // behind it (targeting/tracking/SEO). Example copy — edit to match your
  // real workflow before publishing (same as the other placeholder content).
  capabilities: [
    {
      key: "branding",
      label: "Branding",
      description:
        "Every brand starts with a system, not just a logo — something consistent enough to work everywhere your business shows up.",
      groups: [
        {
          title: "What We Build",
          items: [
            { name: "Logo & Identity System", desc: "A primary mark plus variations that hold up across sizes and formats." },
            { name: "Brand Guidelines", desc: "A reference document so your brand stays consistent even when we're not in the room." },
            { name: "Typography & Color System", desc: "A defined palette and type scale — not one-off choices per design." },
            { name: "Brand Voice & Messaging", desc: "How the brand sounds in captions, ads, and customer replies, not just how it looks." },
          ],
        },
      ],
    },
    {
      key: "social",
      label: "Social",
      description:
        "Consistent, platform-aware content built for how each channel actually gets discovered — not the same post copy-pasted everywhere.",
      groups: [
        {
          title: "What We Run",
          items: [
            { name: "Content Calendar & Scheduling", desc: "Planned weeks ahead, so posting stays consistent instead of reactive." },
            { name: "Platform-Specific Strategy", desc: "Instagram, Facebook, and LinkedIn each get their own format and tone." },
            { name: "Community Management", desc: "Replies, DMs, and comments handled daily, not left on read." },
            { name: "Engagement Analytics", desc: "Weekly numbers on what's actually working, not just posting and hoping." },
          ],
        },
      ],
    },
    {
      key: "ads",
      label: "Ads",
      description:
        "Two layers to every ad campaign — what your audience actually sees, and the targeting and tracking working behind it that most people never notice.",
      groups: [
        {
          title: "What Your Audience Sees",
          items: [
            { name: "Instagram Ads", desc: "Feed, Story, and Reel placements built for scroll-stopping attention." },
            { name: "Facebook Ads", desc: "Meta's broader network for reach beyond just Instagram's audience." },
            { name: "YouTube Ads", desc: "Skippable and non-skippable video placements for demand generation." },
          ],
        },
        {
          title: "What Runs Behind It",
          items: [
            { name: "Retargeting & Pixel Tracking", desc: "Re-engaging people who already showed interest, instead of starting cold every time." },
            { name: "Lookalike Audiences", desc: "Finding new people who resemble your best existing customers." },
            { name: "SEO & Keyword Targeting", desc: "Search-intent research that informs both organic content and paid targeting." },
            { name: "Conversion Tracking", desc: "Attribution set up so you know exactly which ad drove the result." },
          ],
        },
      ],
    },
    {
      key: "content",
      label: "Content",
      description:
        "A dedicated content team handling everything from the first script draft to the final scheduled post, so creative output never becomes the bottleneck.",
      groups: [
        {
          title: "What Our Content Team Handles",
          items: [
            { name: "Reels & Video Production", desc: "Shot, edited, and captioned for how each platform actually plays video." },
            { name: "Copywriting & Captions", desc: "Words that match brand voice, not generic filler text." },
            { name: "Graphic Design", desc: "Carousels, static posts, and campaign creative built to a consistent visual system." },
            { name: "Content Calendar & Publishing", desc: "Managed end-to-end so nothing ships late or off-brand." },
          ],
        },
      ],
    },
  ],

  // COMPARISON TABLE — how we stack up against a typical agency.
  // "us" / "others" values: `true`/`false` render as check/cross, a string
  // renders as-is.
  comparison: [
    { feature: "Dedicated strategist on your account", us: true, others: false },
    { feature: "Live performance reporting dashboard", us: true, others: false },
    { feature: "Contract terms", us: "Month-to-month", others: "12-month lock-in" },
    { feature: "Creative revisions", us: "Unlimited", others: "Limited, extra cost" },
    { feature: "Who owns the creative we make", us: "You, 100%", others: "Often the agency" },
    { feature: "Pricing", us: "Transparent, upfront", others: "Hidden fees" },
  ],

  // FAQ — example answers written for a typical agency; edit to match your
  // real policies before publishing, same as the other placeholder content.
  faqs: [
    {
      q: "What's the minimum budget to get started?",
      a: "There's no fixed minimum — every engagement is scoped around your goals, so we build a plan that fits your budget rather than forcing you into a package.",
    },
    {
      q: "How soon can we see results?",
      a: "Most clients see early traction — engagement, reach, leads — within the first 4-6 weeks, with results compounding as campaigns get optimized over the following months.",
    },
    {
      q: "Is there a long-term contract?",
      a: "We work month-to-month by default. You stay because it's working, not because a contract locks you in.",
    },
    {
      q: "Who owns the creative assets you produce for us?",
      a: "You do — 100%. Every logo, campaign, and piece of content we create belongs to your brand, forever.",
    },
    {
      q: "How do you report on performance and ROI?",
      a: "You get access to a live reporting dashboard plus a recurring strategy call, so you always know exactly what's working and why.",
    },
  ],
};
