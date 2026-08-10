/* ==========================================================================
   SERVICE PAGE LOGIC (repeatable template)
   Reads ?service=<id> from the URL and renders the matching entry from
   SERVICES in data.js. To add a new service page, add an object to
   SERVICES — no HTML duplication required.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const svc = serviceById(params.get("service"));

  document.getElementById("headerMount").innerHTML = renderHeader("service");
  document.getElementById("footerMount").innerHTML = renderFooter(false);
  document.getElementById("conversionBarMount").innerHTML = renderConversionBar("default");
  bindHeader();
  bindConversionBar();

  document.title = `${svc.name} — ${BRAND.name}`;
  const metaDesc = document.getElementById("pageMetaDescription");
  if(metaDesc) metaDesc.setAttribute("content", `${svc.valueProp} Starting at ${formatPrice(svc.priceFrom)} — mobile ${svc.name.toLowerCase()} in ${BRAND.serviceCity}.`);
  document.getElementById("breadcrumbMount").innerHTML =
    `<a href="../index.html">Home</a><span>/</span><span class="current">${svc.name}</span>`;

  document.getElementById("heroAssetIcon") && (document.getElementById("heroAssetIcon").innerHTML = icon("camera"));
  const heroImg = document.getElementById("heroServiceImg");
  if(heroImg){ heroImg.src = "../" + svc.afterImage; heroImg.alt = `${svc.name} — finished result`; }
  document.getElementById("serviceName").textContent = svc.name;
  document.getElementById("serviceValueProp").textContent = svc.valueProp;
  document.getElementById("servicePriceBadge").innerHTML = `Starting at ${formatPrice(svc.priceFrom)}`;
  document.getElementById("serviceDurationBadge").innerHTML = `${icon("clock")} ${svc.duration}`;
  document.getElementById("serviceStars").innerHTML = `${Array.from({ length: 5 }).map(() => icon("star")).join("")} <span style="margin-left:4px;">${BRAND.rating}</span>`;
  const bookCta = document.getElementById("serviceBookCta");
  bookCta.textContent = `Book ${svc.name}`;
  bookCta.href = `booking.html?service=${svc.id}`;

  // What's included
  document.getElementById("includedGrid").innerHTML = svc.included.map(line =>
    `<div class="feature-line">${icon("check")}<span>${line}</span></div>`).join("");
  document.getElementById("addOnsNote").textContent = svc.addOnsNote;

  // Process steps
  document.getElementById("processStepsMount").innerHTML = svc.process.map((step, i) => `
    <div class="step reveal">
      <div class="step-badge">${String(i + 1).padStart(2, "0")}</div>
      <h3>${step.title}</h3>
      <p style="font-size:14.5px;">${step.desc}</p>
    </div>`).join("");

  // Before / after (this service's real photos)
  document.getElementById("beforeAfterMount").innerHTML = renderBeforeAfter({
    beforeImg: "../" + svc.beforeImage,
    afterImg: "../" + svc.afterImage,
    caption: `${svc.name} — real results from a recent job`,
  });
  bindBeforeAfter();

  // Pricing table
  document.getElementById("pricingTable").innerHTML = VEHICLE_TYPES.map(v => `
    <tr style="border-bottom:1px solid var(--color-border);">
      <td style="padding:16px 20px;font-weight:700;color:var(--color-text-primary);display:flex;align-items:center;gap:10px;">
        <span style="width:22px;height:22px;color:var(--color-accent-primary);">${icon(v.icon)}</span>${v.label}
      </td>
      <td style="padding:16px 20px;text-align:right;font-family:var(--font-mono);font-weight:600;font-size:16px;">${formatPrice(priceForVehicle(svc.priceFrom, v.id))}</td>
    </tr>`).join("");

  // Related services (everything except this one, max 3)
  const related = SERVICES.filter(s => s.id !== svc.id).slice(0, 3);
  document.getElementById("relatedGrid").innerHTML = related.map(r => `
    <div class="icon-card">
      <div class="icon-tile">${icon("sparkle")}</div>
      <h3 style="margin-top:12px;font-size:16px;">${r.name}</h3>
      <p class="caption" style="margin:8px 0 12px;">From ${formatPrice(r.priceFrom)}</p>
      <a href="service.html?service=${r.id}" class="btn-link">Learn More →</a>
    </div>`).join("");

  // FAQ
  document.getElementById("faqHeading").textContent = `Questions About ${svc.name}`;
  document.getElementById("faqMount").innerHTML = renderFaqList(svc.faqs, "svc-faq");
  bindFaqAccordion();

  // CTA footer
  document.getElementById("ctaHeading").textContent = `Ready for ${svc.name}?`;
  const ctaBtn = document.getElementById("ctaBookBtn");
  ctaBtn.textContent = `Book ${svc.name}`;
  ctaBtn.href = `booking.html?service=${svc.id}`;

  bindReveal();
});
