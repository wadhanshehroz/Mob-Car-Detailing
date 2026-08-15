/* ==========================================================================
   PACKAGE COMPARISON PAGE LOGIC
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("headerMount").innerHTML = renderHeader("comparison");
  document.getElementById("footerMount").innerHTML = renderFooter(false);
  document.getElementById("conversionBarMount").innerHTML = renderConversionBar("default");
  bindHeader();
  bindConversionBar();

  // --- Vehicle selector (reused, compact) ---
  document.getElementById("vehicleSelectorMount").innerHTML = renderVehicleSelector({ compact: true, heading: "Showing prices for" });
  bindVehicleSelector(() => { renderCompareTable(currentView); renderMobileCards(); bindConversionBar(); });

  // --- Comparison table (two views) ---
  let currentView = "level";

  function renderLevelTable(){
    const vehicleId = getVehicle() || "sedan";
    let html = `<table class="compare-table"><thead><tr><th></th>`;
    PACKAGES.forEach(pkg => {
      html += `<th class="${pkg.popular ? 'is-featured' : ''}">
        ${pkg.popular ? `<span class="badge badge-soft" style="margin-bottom:8px;display:inline-block;">Most Popular</span>` : ""}
        <div class="compare-col-name">${pkg.name}</div>
        <div class="compare-col-price">${formatPrice(priceForVehicle(pkg.basePrice, vehicleId))}</div>
        <a href="booking.html?service=${PACKAGE_TO_SERVICE[pkg.id]}" class="btn ${pkg.popular ? 'btn-primary' : 'btn-secondary'} btn-sm" style="margin-top:12px;">Choose ${pkg.name}</a>
      </th>`;
    });
    html += `</tr></thead><tbody>`;
    COMPARE_GROUPS.forEach(group => {
      html += `<tr class="group-row"><td colspan="${PACKAGES.length + 1}">${group.label}</td></tr>`;
      group.rows.forEach(row => {
        html += `<tr><td>${row.label}</td>`;
        row.values.forEach(v => {
          html += `<td>${v ? `<span class="yes">${icon("check")}</span>` : `<span class="no">${icon("x")}</span>`}</td>`;
        });
        html += `</tr>`;
      });
    });
    html += `</tbody></table>`;
    return html;
  }

  function renderVehicleTable(){
    let html = `<table class="compare-table"><thead><tr><th>Package</th>`;
    VEHICLE_TYPES.forEach(v => { html += `<th><div class="compare-col-name" style="font-size:14px;">${icon(v.icon)}</div>${v.label}</th>`; });
    html += `</tr></thead><tbody>`;
    PACKAGES.forEach(pkg => {
      html += `<tr><td>${pkg.name}${pkg.popular ? ` <span class="badge badge-soft">Popular</span>` : ""}</td>`;
      VEHICLE_TYPES.forEach(v => {
        html += `<td class="compare-col-price" style="font-size:16px;">${formatPrice(priceForVehicle(pkg.basePrice, v.id))}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    return html;
  }

  function renderCompareTable(view){
    document.getElementById("compareTableWrap").innerHTML = view === "vehicle" ? renderVehicleTable() : renderLevelTable();
  }

  function renderMobileCards(){
    const vehicleId = getVehicle() || "sedan";
    document.getElementById("compareCardsWrap").innerHTML = PACKAGES.map(pkg => `
      <div class="package-card ${pkg.popular ? 'package-card--featured' : ''}">
        ${pkg.popular ? `<span class="badge badge-popular">Most Popular</span>` : ""}
        <h3>${pkg.name}</h3>
        <div class="package-price"><span class="amount">${formatPrice(priceForVehicle(pkg.basePrice, vehicleId))}</span></div>
        <div class="package-features">
          ${pkg.features.slice(0, 3).map(f => `<div class="feature-line">${icon("check")}<span>${f}</span></div>`).join("")}
        </div>
        <a href="booking.html?service=${PACKAGE_TO_SERVICE[pkg.id]}" class="btn ${pkg.popular ? 'btn-primary' : 'btn-secondary'} btn-block">Choose ${pkg.name}</a>
      </div>`).join("");
  }

  document.getElementById("compareToggle").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if(!btn) return;
    document.querySelectorAll("#compareToggle button").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentView = btn.dataset.view;
    renderCompareTable(currentView);
  });

  renderCompareTable(currentView);
  renderMobileCards();

  // --- "Not sure which one?" guidance quiz ---
  const QUIZ_OPTIONS = [
    { label: "Just detailed — light refresh only", packageId: "essential" },
    { label: "A few months ago", packageId: "premium" },
    { label: "Honestly, can't remember", packageId: "signature" },
  ];
  function renderQuiz(){
    document.getElementById("quizCard").innerHTML = `
      <div id="quizQuestion">
        <span class="eyebrow">Still Deciding?</span>
        <h3 style="margin-top:14px;">How long since your last detail?</h3>
        <div class="quiz-options">
          ${QUIZ_OPTIONS.map((o, i) => `<button class="quiz-option" data-i="${i}">${o.label}</button>`).join("")}
        </div>
      </div>
      <div class="quiz-result" id="quizResult"></div>`;
    document.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const opt = QUIZ_OPTIONS[btn.dataset.i];
        const pkg = packageById(opt.packageId);
        document.getElementById("quizQuestion").style.display = "none";
        const result = document.getElementById("quizResult");
        result.classList.add("show");
        result.innerHTML = `
          <span class="badge badge-soft">Recommended For You</span>
          <h3 style="margin-top:6px;">${pkg.name}</h3>
          <p style="margin:10px 0 18px;font-size:14.5px;">${pkg.description}</p>
          <a href="booking.html?service=${PACKAGE_TO_SERVICE[pkg.id]}" class="btn btn-primary">Book Recommended Package</a>`;
      });
    });
  }
  renderQuiz();

  // --- Add-on grid with running subtotal ---
  function renderAddonGrid(){
    const selected = getSelectedAddons();
    document.getElementById("addonGrid").innerHTML = ADDONS.map(a => `
      <div class="addon-card ${selected.includes(a.id) ? 'is-selected' : ''}" data-addon="${a.id}">
        <div class="addon-top">
          <div class="icon-tile" style="width:34px;height:34px;">${icon(a.icon)}</div>
          <label class="switch">
            <input type="checkbox" ${selected.includes(a.id) ? "checked" : ""} data-addon-toggle="${a.id}">
            <span class="track"></span>
          </label>
        </div>
        <div style="font-weight:700;font-size:14px;color:var(--color-text-primary);">${a.name}</div>
        <div class="addon-price">+${formatPrice(a.price)}</div>
      </div>`).join("");

    document.querySelectorAll("[data-addon-toggle]").forEach(input => {
      input.addEventListener("change", () => {
        toggleAddon(input.dataset.addonToggle);
        input.closest(".addon-card").classList.toggle("is-selected", input.checked);
        bindConversionBar();
      });
    });
    document.querySelectorAll("#addonGrid .addon-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if(e.target.closest(".switch")) return;
        const input = card.querySelector("[data-addon-toggle]");
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }
  renderAddonGrid();

  // --- FAQ ---
  const COMPARISON_FAQS = [
    { q: "Can I upgrade my package later?", a: "Yes — if we're already on-site and have time available, we can often upgrade you the same day. Otherwise message us on WhatsApp and we'll get you booked for the next available slot." },
    { q: "What if I only want part of a package?", a: "Just message us on WhatsApp — we're happy to put together a custom combination when it makes sense." },
    { q: "Do prices change by vehicle size?", a: "Yes. Larger vehicles take more time, water, and product, so SUVs, trucks, and vans carry a small size adjustment shown at checkout." },
  ];
  document.getElementById("faqMount").innerHTML = renderFaqList(COMPARISON_FAQS, "cmp-faq");
  bindFaqAccordion();

  bindReveal();
});
