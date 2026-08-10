# Mob Car Detailing — Website Guide

This is a complete, working website — no build tools, no installs. Open
`index.html` in a browser to view it, or upload the whole folder to any
web host (see **Deploying** at the bottom).

This README is written for **editing content, not code**. Almost
everything you'll ever want to change — prices, service descriptions,
photos, the WhatsApp number, FAQs — lives in **one file**:
`js/data.js`. You very rarely need to touch anything else.

---

## 1. The one file that matters most: `js/data.js`

Open `js/data.js` in any text editor (Notepad, VS Code, even a plain text
app). It's organized into clearly-labeled blocks. Find the block you want,
change the text between the quote marks, save, and refresh the page.

### Business info (`BRAND`)

```js
const BRAND = {
  name: "Mob Car Detailing",
  shortName: "Mob",                 // used on very small mobile screens
  email: "wadhanshehroz@gmail.com",
  hours: "Mon–Sun, 9:00 AM – 8:00 PM",
  tagline: "Your car deserves more than a wash.",
  serviceCity: "Lahore",
  serviceRadius: "25 km radius",
  rating: "4.6",
};
```

Change `serviceCity` or `serviceRadius` and the "Currently Servicing
Lahore" section on the homepage, the footer, and the hero badge all
update automatically — you only edit it here, once.

### WhatsApp number

```js
const WHATSAPP_NUMBER = "923174481564";
```

This single line controls **every** WhatsApp link on the whole site —
the nav, the footer, "Chat with us", the final "Book Now" button, and the
entire booking flow. To change your business's WhatsApp number, change
this one line. Use the country code with no `+`, no spaces, no dashes
(e.g. a Pakistani number `0317 4481564` becomes `923174481564`).

### Pricing — **please read this one**

All prices in the site are in PKR (`Rs.`), set in `js/data.js` under
`PACKAGES`, `SERVICES`, and `ADDONS`. **The numbers currently in there
are placeholder estimates** put in to make the site feel complete and
correctly localized to Lahore — they are not real quotes from your
business. Before you go live, search `js/data.js` for `basePrice` and
`priceFrom` and `price:` and update every number to your actual rates.
Prices are in whole rupees, no commas needed (the site adds those
automatically): `basePrice: 2500` displays as `Rs. 2,500`.

Vehicle-size pricing is automatic: every price is defined once for a
Sedan, and `VEHICLE_TYPES` multiplies it up for SUV/Truck/Van. You never
have to enter four separate prices per service — just the one Sedan
price.

### Services (`SERVICES`)

This is the big one — the four service pages (Exterior Wash & Wax, Full
Interior Detail, Ceramic Coating, Paint Correction) are all generated
from this single array. Each service looks like:

```js
{
  id: "exterior-wash-wax",
  name: "Exterior Wash & Wax",
  valueProp: "A showroom shine for your paint, wheels, and glass...",
  priceFrom: 2500,
  duration: "~60 min",
  beforeImage: "assets/images/exterior-before.jpg",
  afterImage: "assets/images/exterior-after.jpg",
  included: [ "Two-bucket hand wash", "Wheel & tire deep clean", ... ],
  addOnsNote: "Clay bar treatment... available as add-ons.",
  process: [ { title: "...", desc: "..." }, ... ],
  faqs: [ { q: "...", a: "..." }, ... ],
}
```

**To add a fifth service**, copy one of these `{ ... }` blocks, paste it
as a new entry in the `SERVICES` list, give it a unique `id` (lowercase,
hyphens, no spaces), and fill in the fields. It will automatically:
- get its own page at `service.html?service=your-new-id`
- appear in the navbar "Services" dropdown (desktop and mobile)
- appear in the footer's Services list
- appear on the Booking page as a choosable service
- appear on the Gallery page (once you add before/after photos for it)

No other file needs to change.

### Add-ons (`ADDONS`)

Small extras like "Engine Bay Cleaning" — same idea, edit the `name` and
`price`. Add a new one by copying an existing entry.

### Testimonials, FAQs, and service-area neighborhoods

`TESTIMONIALS`, `HOME_FAQS`, and `SERVICE_AREA_CITIES` are all simple
lists near the bottom of the data file — edit the text directly. The
testimonials are currently placeholder reviews written to sound
realistic; swap them for real customer reviews as you collect them.

---

## 2. Images — where they live and how to replace them

All images are in `assets/images/`. To swap a photo, **give your new
photo the exact same filename** as the one it's replacing (overwrite it)
— nothing else needs to change. If you want to use a different filename,
update the matching path in `js/data.js` (for before/after photos) or
`js/components.js` / `js/data.js` (for the logo).

| File | Used for |
|---|---|
| `logo.jpg` | Full logo (currently unused directly, kept for future use) |
| `favicon-32.png`, `favicon-180.png`, `favicon-512.png` | Browser tab icon + the small logo badge in the header/footer (square-cropped from the logo) |
| `exterior-before.jpg` / `exterior-after.jpg` | Exterior Wash & Wax before/after, also the homepage's default before/after |
| `interior-before.jpg` / `interior-after.jpg` | Full Interior Detail before/after |
| `ceramic-before.jpg` / `ceramic-after.jpg` | Ceramic Coating before/after |
| `paint-correction-before.jpg` / `paint-correction-after.jpg` | Paint Correction before/after |
| `hero-poster.jpg` | The still image shown for a split second before the hero video starts playing |

**Adding a new before/after pair for a new service**: drop the two
photos into `assets/images/` with clear names (e.g.
`headlight-before.jpg`, `headlight-after.jpg`), then point to them from
that service's `beforeImage`/`afterImage` fields in `js/data.js`.

Photos are already compressed for fast mobile loading (~150–250KB each,
resized to 1600px wide). If you add new photos, try to keep them under
~500KB — most phone cameras produce 3–8MB photos, which will slow the
site down if uploaded as-is. Any free image compressor (e.g.
squoosh.app) works well.

---

## 3. The homepage hero — video, slogan, and font

### The two background video clips

`assets/videos/hero-1.mp4` and `hero-2.mp4` play back-to-back on a loop
behind the homepage headline. They're controlled from `js/data.js`:

```js
const HERO_MEDIA = {
  mode: "video",
  videoSrcs: ["assets/videos/hero-1.mp4", "assets/videos/hero-2.mp4"],
  posterSrc: "assets/images/hero-poster.jpg",
};
```

**To swap in new clips**: replace the two files in `assets/videos/`
(same filenames, or update the paths above). Keep clips **vertical /
portrait** (like a phone recording) — that's what this hero is designed
for. For web performance, keep each clip under ~3MB; if your new footage
is large, compress it first (see "Video specs" below) or ask a developer
to run it through `ffmpeg`.

You can list one clip, or three or more — the site will cycle through
however many you put in the list, in order, on a loop.

If you ever want a single static photo instead of video, change
`mode: "video"` to `mode: "image"` and set `imageSrc: "assets/images/your-photo.jpg"`.

**Video specs used for the current clips** (for reference if replacing):
H.264 MP4, scaled to 1280px on the long side, no audio track (the video
is muted anyway, so audio just adds file size for nothing).

### The slogan

The big headline text ("Your car deserves more than a wash.") is set
directly in `index.html` — search for `hero-slogan` and edit the text
between the `<h1>` tags.

**About the font**: the slogan uses **Space Grotesk**, a free, modern
grotesque typeface that's the closest freely-available match to "Aa
Grotesk" (a paid/commercial font not available through free font
services). If you purchase a license for the real Aa Grotesk later, a
developer can swap it in by replacing the `@font-face`/Google Fonts line
at the top of `css/styles.css` — search for `Space+Grotesk`.

---

## 4. The booking flow → WhatsApp

There is intentionally **no payment form or card fields** anywhere on
this site. Booking works like this:

1. Person picks a vehicle type, service, add-ons, date, and time on
   `pages/booking.html`.
2. On the last step, they enter their name, phone, and address.
3. Clicking **"Send Booking via WhatsApp"** builds a message with every
   detail they picked (vehicle, service, add-ons, date, time, address,
   name, phone, estimated total) and opens WhatsApp with that message
   pre-filled, ready for them to hit send.
4. You receive the message on WhatsApp and confirm/arrange payment
   directly with the customer from there.

You don't need to configure anything for this to work beyond setting
`WHATSAPP_NUMBER` correctly (see section 1). If you want to change the
wording of the generated message, it's built in `js/booking.js` inside
the `buildBookingMessage()` function — each line is plain text you can
edit.

**Booking from a specific service page** (e.g. clicking "Book Ceramic
Coating" on the Ceramic Coating page) pre-selects that service in the
booking flow, and offers the other three services as optional bundle-in
add-ons. **Booking from the homepage** ("Book Now") shows all four
services with nothing pre-selected, so the customer picks fresh.

---

## 5. SEO — editing page titles, descriptions, and search-preview info

Every page has two things search engines and social previews (WhatsApp
link previews, Facebook, etc.) read from the very top of the HTML file,
inside the `<head>...</head>` section:

```html
<title>Mob Car Detailing — Mobile Car Detailing in Lahore</title>
<meta name="description" content="Mob Car Detailing — professional mobile car detailing serving Lahore and a 25 km radius...">
```

- **`<title>`** — shown as the browser tab text and as the clickable
  blue link text in Google search results. Keep it under ~60 characters.
- **`<meta name="description">`** — the gray preview text under the
  title in Google search results. Keep it under ~155 characters.

Where to find these for each page:

| Page | File | Notes |
|---|---|---|
| Homepage | `index.html` | Also has `og:title`/`og:description`/`og:image` — used when the homepage link is shared on WhatsApp/Facebook/etc. |
| Compare Packages | `pages/comparison.html` | |
| Book Now | `pages/booking.html` | |
| Gallery | `pages/gallery.html` | |
| Service pages | `pages/service.html` | These are **written automatically** from each service's `name`, `valueProp`, and `priceFrom` in `js/data.js` — edit the service there, not in the HTML file. |

**General SEO tips for this site:**
- Every service already gets its own URL (`service.html?service=ceramic-coating`,
  etc.) with unique title/description text generated from your service
  data — good for ranking on searches like "ceramic coating Lahore".
- Keep `SERVICE_AREA_CITIES` in `js/data.js` up to date with the actual
  neighborhoods you serve — this text appears on the homepage and helps
  local search relevance.
- Real, specific testimonials (with a car model and neighborhood) tend
  to help both trust and local SEO more than generic ones — replace the
  placeholders in `TESTIMONIALS` as you collect real reviews.
- Image `alt` text (used by screen readers and image search) is set
  automatically from context (e.g. "Ceramic Coating — finished result")
  — no action needed unless you want to customize it, in which case
  search for `alt=` in `js/service.js` and `js/home.js`.

---

## 6. Full file map

```
index.html                  Homepage
favicon-*.png                (in assets/images/) Browser tab icons

pages/
  service.html               Service page template (shared by all 4 services)
  comparison.html            Compare Packages page
  booking.html                4-step booking flow
  gallery.html                Before/after gallery (all services)

css/
  styles.css                  All visual styling, one file

js/
  data.js                     ALL editable content — start here
  state.js                    Remembers what a visitor picked as they move
                               between pages (not something you need to edit)
  components.js               Shared header/footer/nav/before-after-slider code
  home.js / service.js / comparison.js / booking.js / gallery.js
                               Page-specific behavior

assets/
  images/                     All photos, logo, favicons
  videos/                     The two hero background clips
```

---

## 7. Testing your changes

After editing any file, just refresh the page in your browser to see the
change — there's no build step. If you're editing on your own computer
rather than a live server, the easiest way to preview the whole site
(so links between pages work correctly) is:

1. Open a terminal in this folder.
2. Run `python3 -m http.server 8000` (or ask a developer to do this).
3. Visit `http://localhost:8000` in your browser.

## 8. Deploying

This is a static site — no server-side code, no database. It can be
hosted for free or cheaply on services like Netlify, Vercel, GitHub
Pages, or any standard web hosting plan. Just upload the whole folder
(keeping the same structure) to your host of choice.

---

## Notes on a few judgment calls made while building this

- **Pricing was converted from USD to PKR** since the business serves
  Lahore. The actual numbers are placeholder estimates — see section 1.
- **"Aa Grotesk" was substituted with Space Grotesk** (a free, similarly
  modern grotesque font) since Aa Grotesk is a commercial font not
  available via free font services — see section 3.
- **The hero video is real footage you provided**, compressed for web
  performance (the originals were ~35MB combined; the web versions are
  ~2.6MB combined with no visible quality loss).
