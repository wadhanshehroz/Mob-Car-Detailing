/* ==========================================================================
   SHARED CONTENT DATA
   Single source of truth. Every page pulls from here, so updating a price,
   a service, or the brand name in one place updates the whole site.

   >>> See README.md for a full plain-English guide to editing everything
       in this file (and the rest of the site) for SEO / content updates. <<<
   ========================================================================== */

const BRAND = {
  name: "Mob Car Detailing",
  shortName: "Mob",
  email: "wadhanshehroz@gmail.com",
  hours: "Mon–Sun, 9:00 AM – 8:00 PM",
  tagline: "Your car deserves more than a wash.",
  serviceCity: "Lahore",
  serviceRadius: "25 km radius",
  rating: "4.6",
};

// WhatsApp is this site's booking + contact channel (no phone calls, no
// on-site payment forms). Every "Chat with us" / "Book Now" / booking
// confirmation action builds a wa.me link from this number.
const WHATSAPP_NUMBER = "923174481564";

// Generic "just chatting" link, used for Chat-with-us / footer / nav CTAs
// that aren't a structured booking (exact text the business requested).
const WHATSAPP_GENERIC_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'd like to get a quote for car detailing")}`;

// Builds a wa.me link carrying a full booking summary as the pre-filled
// message. Used by the booking flow's final "Confirm Booking" step.
function buildWhatsAppBookingUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Homepage hero background: two vertical video clips that play back to
// back on a loop (see js/home.js -> initHeroVideoPlaylist). Falls back to
// a poster image while the first clip loads.
const HERO_MEDIA = {
  mode: "video",
  videoSrcs: ["assets/videos/hero-1.mp4", "assets/videos/hero-2.mp4"],
  posterSrc: "assets/images/hero-poster.jpg",
};

// Vehicle types used by the Interactive Vehicle Selector (shared across pages)
const VEHICLE_TYPES = [
  { id: "sedan", label: "Sedan", icon: "car", multiplier: 1 },
  { id: "suv",   label: "SUV",   icon: "suv", multiplier: 1.15 },
  { id: "truck", label: "Truck", icon: "truck", multiplier: 1.25 },
  { id: "van",   label: "Van / Other", icon: "van", multiplier: 1.35 },
];

// Core packages — shown on the Package Comparison page. Base prices are
// in PKR for a Sedan; other vehicle prices derive from VEHICLE_TYPES
// multipliers so pricing stays consistent everywhere.
// NOTE: these are placeholder estimates for the Lahore market — update
// to your real pricing in one place here.
const PACKAGES = [
  {
    id: "essential",
    name: "Essential Wash",
    description: "A quick, thorough refresh for cars that just need regular upkeep between deeper details.",
    basePrice: 2500,
    popular: false,
    features: [
      "Exterior hand wash & dry",
      "Wheel & tire cleaning",
      "Windows cleaned (exterior)",
      "Interior vacuum",
    ],
    notIncluded: ["Wax / sealant", "Interior shampoo"],
  },
  {
    id: "premium",
    name: "Premium Detail",
    description: "Our most popular package — a complete inside-and-out detail that leaves every surface looking, and smelling, like new.",
    basePrice: 6500,
    popular: true,
    features: [
      "Everything in Essential Wash",
      "Clay bar & hand wax",
      "Full interior wipe-down & shampoo",
      "Leather conditioning",
      "Interior glass & vents detail",
    ],
    notIncluded: ["Ceramic coating", "Paint correction"],
  },
  {
    id: "signature",
    name: "Signature Ceramic",
    description: "The full showroom treatment — paint correction and a ceramic coating for a deep, long-lasting shine.",
    basePrice: 25000,
    popular: false,
    features: [
      "Everything in Premium Detail",
      "Single-stage paint correction",
      "Ceramic coating application",
      "Engine bay wipe-down",
      "6-month shine guarantee",
    ],
    notIncluded: [],
  },
];

// Maps each comparison-page "package" to the closest matching individual
// service, so a "Choose Essential Wash" button on the Comparison page can
// still land the person on a sensible pre-selected service in Booking
// (which is built around the 4 services below, not these 3 packages).
const PACKAGE_TO_SERVICE = {
  essential: "exterior-wash-wax",
  premium: "full-interior-detail",
  signature: "ceramic-coating",
};

// Comparison-table feature matrix, grouped by category
const COMPARE_GROUPS = [
  {
    label: "Exterior Services",
    rows: [
      { label: "Hand wash & dry", values: [true, true, true] },
      { label: "Wheel & tire cleaning", values: [true, true, true] },
      { label: "Clay bar treatment", values: [false, true, true] },
      { label: "Hand wax", values: [false, true, true] },
      { label: "Paint correction", values: [false, false, true] },
      { label: "Ceramic coating", values: [false, false, true] },
    ],
  },
  {
    label: "Interior Services",
    rows: [
      { label: "Vacuum & wipe-down", values: [true, true, true] },
      { label: "Interior shampoo", values: [false, true, true] },
      { label: "Leather conditioning", values: [false, true, true] },
      { label: "Odor treatment", values: [false, true, true] },
    ],
  },
  {
    label: "Add-Ons Included",
    rows: [
      { label: "Engine bay cleaning", values: [false, false, true] },
      { label: "Headlight restoration", values: [false, false, false] },
      { label: "6-month guarantee", values: [false, false, true] },
    ],
  },
];

const ADDONS = [
  { id: "engine-bay", name: "Engine Bay Cleaning", icon: "sparkle", price: 1500 },
  { id: "headlight", name: "Headlight Restoration", icon: "sparkle", price: 2000 },
  { id: "odor", name: "Odor Elimination", icon: "sparkle", price: 1200 },
  { id: "pet-hair", name: "Pet Hair Removal", icon: "sparkle", price: 1800 },
  { id: "ceramic-boost", name: "Ceramic Spray Boost", icon: "sparkle", price: 1000 },
  { id: "carpet", name: "Carpet Extraction", icon: "sparkle", price: 2200 },
];

// Repeatable Service Page template content — one entry per service.
// Add a new object here and it automatically gets its own page at
// pages/service.html?service=<id> with the full template applied, and
// it automatically appears in the nav dropdown, footer, gallery page,
// and the Booking flow's service picker.
//
// beforeImage / afterImage are root-relative paths (e.g. "assets/images/x.jpg").
// js/home.js and js/service.js prefix "../" automatically when needed.
const SERVICES = [
  {
    id: "exterior-wash-wax",
    name: "Exterior Wash & Wax",
    valueProp: "A showroom shine for your paint, wheels, and glass — done right in your driveway.",
    priceFrom: 2500,
    duration: "~60 min",
    beforeImage: "assets/images/exterior-before.jpg",
    afterImage: "assets/images/exterior-after.jpg",
    included: [
      "Two-bucket hand wash", "Wheel & tire deep clean", "Bug & tar removal",
      "Hand-applied carnauba wax", "Door jambs wiped down", "Exterior glass cleaned",
      "Tire dressing", "Air dry with microfiber towels",
    ],
    addOnsNote: "Clay bar treatment, ceramic sealant, and headlight restoration available as add-ons.",
    process: [
      { title: "Pre-rinse & foam soak", desc: "We pre-rinse and foam-soak the entire vehicle to lift surface dirt before any towel touches the paint." },
      { title: "Two-bucket hand wash", desc: "A two-bucket hand wash with pH-neutral soap keeps grit off the paint, minimizing swirl marks." },
      { title: "Hand-applied wax", desc: "A hand-applied carnauba wax seals in the shine and adds a layer of protection." },
    ],
    faqs: [
      { q: "How long does the wax last?", a: "A hand-applied carnauba wax typically holds its shine and water beading for 4–6 weeks, depending on how often the car is driven and washed." },
      { q: "Do you use eco-friendly products?", a: "Yes — we use biodegradable, pH-neutral soaps that are safe to run off into driveways and lawns." },
      { q: "Can this be done at my home or office?", a: "Yes. Our van carries its own water tank and power, so we don't need access to your outlets or hose." },
    ],
  },
  {
    id: "full-interior-detail",
    name: "Full Interior Detail",
    valueProp: "Every surface inside your car, vacuumed, steamed, conditioned, and smelling fresh again.",
    priceFrom: 4500,
    duration: "~90 min",
    beforeImage: "assets/images/interior-before.jpg",
    afterImage: "assets/images/interior-after.jpg",
    included: [
      "Full vacuum incl. trunk", "Steam-cleaned surfaces", "Leather clean & condition",
      "Fabric/carpet shampoo", "Interior glass detail", "Vents & crevice detailing",
      "Odor treatment", "Door panel & console detail",
    ],
    addOnsNote: "Pet hair removal and deep carpet extraction available as add-ons.",
    process: [
      { title: "Full interior vacuum", desc: "We vacuum every seat, carpet, crevice, and the trunk to lift loose dirt and debris." },
      { title: "Steam & shampoo", desc: "Steam cleaning and shampoo lift embedded stains from carpets and upholstery." },
      { title: "Condition & protect", desc: "Leather is conditioned and UV protectant applied to prevent cracking and fading." },
    ],
    faqs: [
      { q: "Can you remove pet hair?", a: "Light pet hair is included; heavier shedding can be added as the Pet Hair Removal add-on for a deeper extraction." },
      { q: "Will my seats be wet after?", a: "No — we use low-moisture steam and quick-dry extraction, so seats are usually dry to the touch within an hour." },
      { q: "Do you treat odors?", a: "Yes, odor treatment is included in this package as part of the interior refresh." },
    ],
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating",
    valueProp: "Long-term paint protection with a deep, glass-like finish that beads water for years.",
    priceFrom: 25000,
    duration: "~4–6 hrs",
    beforeImage: "assets/images/ceramic-before.jpg",
    afterImage: "assets/images/ceramic-after.jpg",
    included: [
      "Full paint decontamination", "Single-stage paint correction", "Ceramic coating application",
      "Wheel & glass coating", "Trim restoration", "Cure-time quality check",
      "Aftercare kit included", "6-month shine guarantee",
    ],
    addOnsNote: "Multi-stage correction and interior ceramic fabric protection available as add-ons.",
    process: [
      { title: "Decontamination wash", desc: "A clay bar and iron-removal treatment strips embedded contaminants the wash alone can't reach." },
      { title: "Paint correction", desc: "Single-stage machine polish reduces oxidation and light swirl marks before coating." },
      { title: "Ceramic application & cure", desc: "The ceramic coating is applied in layers and given time to cure for maximum durability." },
    ],
    faqs: [
      { q: "How long does ceramic coating last?", a: "Our ceramic coating is rated for 1–2+ years of protection with proper wash maintenance." },
      { q: "Is paint correction always included?", a: "A single-stage correction is included to prep the paint. Multi-stage correction for deeper defects is available as an add-on." },
      { q: "How long until I can drive it?", a: "The coating needs a short cure window before it can get wet — we'll walk you through care instructions at pickup." },
    ],
  },
  {
    id: "paint-correction",
    name: "Paint Correction",
    valueProp: "Machine-polished to remove swirl marks and light scratches, restoring true paint clarity.",
    priceFrom: 15000,
    duration: "~3–5 hrs",
    beforeImage: "assets/images/paint-correction-before.jpg",
    afterImage: "assets/images/paint-correction-after.jpg",
    included: [
      "Paint inspection & wash", "Clay bar decontamination", "Machine compounding",
      "Machine polishing", "Swirl & light scratch removal", "Panel wipe-down inspection",
      "Protective sealant application", "Before/after paint readings",
    ],
    addOnsNote: "Ceramic coating and headlight restoration available as add-ons.",
    process: [
      { title: "Inspection & wash", desc: "We inspect your paint under proper lighting and give it a full decontamination wash." },
      { title: "Machine compounding", desc: "Machine compounding cuts down oxidation and deeper defects in the clear coat." },
      { title: "Finishing polish", desc: "A finishing polish refines clarity and brings back true gloss." },
    ],
    faqs: [
      { q: "Will this remove all scratches?", a: "It removes most swirl marks and light scratches. Deeper scratches that catch a fingernail may need touch-up paint." },
      { q: "Is this safe for my paint?", a: "Yes — we measure paint thickness beforehand to make sure there's enough clear coat to safely correct." },
      { q: "Should I add ceramic coating after?", a: "We recommend it — correction removes the damage, and a coating protects the freshly corrected finish." },
    ],
  },
];

const TESTIMONIALS = [
  { name: "Sarah M.", meta: "Toyota Corolla · DHA Phase 5", quote: "They showed up right on time and my car looked better than when I bought it. The interior smells amazing.", rating: 5, platform: "Google" },
  { name: "Ahmed K.", meta: "Honda Civic · Bahria Town", quote: "Booking on WhatsApp took two minutes and they handled a seriously muddy car without blinking.", rating: 5, platform: "Google" },
  { name: "Priya R.", meta: "Toyota Camry · Gulberg", quote: "The ceramic coating is worth every rupee — water just sheets right off after rain now.", rating: 5, platform: "Google" },
  { name: "Daniel T.", meta: "Suzuki Cultus · Johar Town", quote: "Easy to reschedule when it rained, and the crew was friendly and fast the next time around.", rating: 4, platform: "Google" },
  { name: "Monica L.", meta: "Kia Sportage · Model Town", quote: "Best pet hair removal I've found — my dog rides in this car every day and it looked spotless after.", rating: 5, platform: "Google" },
];

const HOME_FAQS = [
  { q: "How does mobile detailing work?", a: "We bring a fully equipped van with our own water tank, generator, and supplies right to your home or office — no drop-off required." },
  { q: "Do you need access to water and electricity?", a: "No. Our vans are fully self-sufficient, so we don't need to use your outlets or hose." },
  { q: "How long does a typical detail take?", a: "It depends on the package — the Essential Wash usually takes about an hour, while a full Signature Ceramic detail can take 4–6 hours." },
  { q: "How do I pay?", a: "We settle payment directly on WhatsApp or in person once the job is done — cash and bank transfer are both fine." },
  { q: "What if it rains on my appointment day?", a: "We'll message you on WhatsApp to reschedule at no charge, or detail your interior first if there's a covered spot available." },
  { q: "Do I need to be present during the service?", a: "Not necessarily — as long as we have access to the vehicle and know where it's parked, we can get started without you there." },
];

// Neighborhoods shown as service-area tags on the homepage (all within
// the ~25 km Lahore radius the business currently serves).
const SERVICE_AREA_CITIES = ["DHA", "Gulberg", "Johar Town", "Bahria Town", "Model Town", "Cantt", "Askari", "Wapda Town"];

// ---- Pricing helpers -------------------------------------------------
function vehicleById(id) { return VEHICLE_TYPES.find(v => v.id === id) || VEHICLE_TYPES[0]; }
function packageById(id) { return PACKAGES.find(p => p.id === id) || PACKAGES[0]; }
function serviceById(id) { return SERVICES.find(s => s.id === id) || SERVICES[0]; }
function addonById(id) { return ADDONS.find(a => a.id === id); }

// Looks up a bookable "extra" by id across BOTH the standard add-ons list
// AND the services list (since other services can be bundled in as
// add-ons during booking — see js/booking.js Step 2). The two id sets
// never overlap, so this is unambiguous.
function extraById(id, vehicleId) {
  const addon = addonById(id);
  if (addon) return { id: addon.id, name: addon.name, price: addon.price };
  const svc = SERVICES.find(s => s.id === id);
  if (svc) return { id: svc.id, name: svc.name, price: priceForVehicle(svc.priceFrom, vehicleId || "sedan") };
  return null;
}

function priceForVehicle(basePrice, vehicleId) {
  const v = vehicleById(vehicleId);
  return Math.round(basePrice * v.multiplier);
}

function formatPrice(n) { return "Rs. " + Math.round(n).toLocaleString(); }

/* ==========================================================================
   INLINE ICON LIBRARY
   Single source of truth for every icon used across the site so visual
   language stays identical (same stroke weight) regardless of page. The
   brand logo itself is a real image (assets/images/logo.jpg), not an
   icon — see BRAND_LOGO_SRC below.
   ========================================================================== */
const BRAND_LOGO_SRC = "assets/images/logo.jpg";
// Tightly-cropped square version of the same logo (just the car + "MOB"
// lettermark) — used anywhere the mark needs to sit in a small square
// badge (header, footer, favicon) where the full rectangular logo would
// crop awkwardly.
const BRAND_LOGOMARK_SRC = "assets/images/favicon-512.png";

const ICONS = {
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>`,
  suv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14l1-5a2 2 0 0 1 2-1.5h3l2-3h6l3 3h1a2 2 0 0 1 2 2l1 4.5"/><path d="M2 14h20v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3z"/><circle cx="6.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h10v9H2z"/><path d="M12 11h4l4 3v3h-8z"/><circle cx="6" cy="18.5" r="1.7"/><circle cx="16.5" cy="18.5" r="1.7"/></svg>`,
  van: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a1 1 0 0 1 1-1h14a2 2 0 0 1 2 2l1 3v3h-2"/><path d="M2 9v8h1"/><path d="M2 17h13v-9"/><circle cx="6" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/></svg>`,
  star: `<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8 5.9 21l1.5-6.8L2.2 9.5l6.9-.7z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3L16 10"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.2 7-12a7 7 0 0 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-9 0-15 5-15 14 9 0 14-6 14-14z"/><path d="M5 18C9 14 13 11 19 5"/></svg>`,
  droplet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  arrows: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8L4 12l4 4M16 8l4 4-4 4"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5.5-5.5L4 21"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13.5" r="3.4"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.1 0-.3 0-.4C10.3 9.5 10 8.7 9.8 8.4c-.2-.4-.4-.3-.6-.3h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l1.5 5-2.5 2a13 13 0 0 0 5 5l2-2.5 5 1.5v4a1 1 0 0 1-1 1C10.7 20.5 3.5 13.3 4 4.9A1 1 0 0 1 5 4z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 6.5l9 6 9-6"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 8.5h2.5V5H14a4 4 0 0 0-4 4v2H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9c0-.5.3-1 1-1z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3v10.5a3.5 3.5 0 1 1-3-3.46"/><path d="M14 3c0 2.5 2 4.5 4.5 4.5"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>`,
};
function icon(name) { return ICONS[name] || ""; }
