/* ==========================================================================
   BOOKING FLOW LOGIC
   4 steps: Vehicle & Location -> Service & Add-ons -> Date & Time ->
   Review & Contact. "Confirm" builds a WhatsApp message with everything
   the person selected/entered and opens a chat with the business.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

  const STEP_LABELS = ["Vehicle", "Service", "Schedule", "Review"];
  let currentStep = 1;
  let selectedDateKey = null;
  let selectedTime = null;
  let calendarMonthOffset = 0;

  // --- Header / Footer ---
  document.getElementById("headerMount").innerHTML = renderHeader("booking");
  document.getElementById("footerMount").innerHTML = renderFooter(false);
  document.getElementById("conversionBarMount").innerHTML = renderConversionBar("booking", "Continue");
  bindHeader();

  // Pre-fill service from a ?service= link (from a service page or the
  // Comparison page, which maps its packages to a matching service).
  const params = new URLSearchParams(window.location.search);
  const presetService = params.get("service");
  if(presetService && SERVICES.some(s => s.id === presetService)) setSelectedService(presetService);

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  function pad(n){ return String(n).padStart(2, "0"); }
  function hashStr(str){ return [...str].reduce((a, c) => a + c.charCodeAt(0), 0); }
  function formatDateKey(d){ return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
  function prettyDate(dateKey){
    const [y, m, d] = dateKey.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  function toggleFieldError(el, hasError){ el.closest(".form-field")?.classList.toggle("has-error", hasError); }

  function showElError(id, show, text){
    let el = document.getElementById(id);
    if(!el){
      el = document.createElement("p");
      el.id = id;
      el.style.cssText = "color:var(--color-danger);font-size:12.5px;margin-top:10px;";
    }
    el.textContent = text;
    el.style.display = show ? "block" : "none";
    return el;
  }

  // ------------------------------------------------------------------
  // Progress indicator + panel switching
  // ------------------------------------------------------------------
  function renderProgress(activeStep){
    let html = `<div class="container"><div class="booking-steps">`;
    for(let i = 1; i <= 4; i++){
      const cls = i < activeStep ? "is-done" : (i === activeStep ? "is-active" : "");
      html += `<div class="b-step ${cls}"><div class="b-step-dot">${i < activeStep ? icon("check") : i}</div><span class="b-step-label">${STEP_LABELS[i - 1]}</span></div>`;
      if(i < 4) html += `<div class="b-step-line ${i < activeStep ? "is-done" : ""}"></div>`;
    }
    html += `</div></div>`;
    document.getElementById("progressBarMount").innerHTML = html;
  }

  function showPanel(step){
    document.querySelectorAll(".booking-panel").forEach(p => p.classList.remove("is-active"));
    document.querySelector(`.booking-panel[data-panel="${step}"]`).classList.add("is-active");
    currentStep = step;
    try{ window.scrollTo({ top: 0, behavior: "smooth" }); }catch(e){ window.scrollTo(0, 0); }
    const progressBar = document.getElementById("progressBarMount");
    if(step === "confirm"){
      progressBar.style.display = "none";
    }else{
      progressBar.style.display = "";
      renderProgress(step);
    }
    updateConversionBarForStep(step);
  }

  function updateConversionBarForStep(step){
    const labelStrong = document.getElementById("cbLabelStrong");
    const label = document.getElementById("cbLabel");
    const btn = document.getElementById("cbBookingCta");
    if(!btn) return;
    if(step === "confirm"){
      label.firstChild.textContent = "All set!";
      labelStrong.textContent = "Check WhatsApp";
      btn.textContent = "Back to Home";
      return;
    }
    const total = computeRunningTotal();
    label.firstChild.textContent = step === 4 ? "Total due" : "Running total";
    labelStrong.textContent = formatPrice(total);
    btn.textContent = step === 4 ? "Send" : "Continue";
  }

  document.getElementById("cbBookingCta")?.addEventListener("click", () => {
    if(currentStep === "confirm"){ window.location.href = "../index.html"; return; }
    const map = { 1: "toStep2", 2: "toStep3", 3: "toStep4", 4: "confirmBookingBtn" };
    document.getElementById(map[currentStep])?.click();
  });

  function goToStep(n){
    if(n === 2) renderStep2();
    if(n === 3) renderStep3();
    if(n === 4) renderStep4();
    showPanel(n);
  }

  // ------------------------------------------------------------------
  // STEP 1 — Vehicle & Location
  // ------------------------------------------------------------------
  document.getElementById("vehicleSelectorMount").innerHTML = renderVehicleSelector({ heading: "Select Your Vehicle" });
  bindVehicleSelector(() => updateConversionBarForStep(currentStep));

  const vehErr = document.createElement("p");
  vehErr.id = "vehicleStepError";
  vehErr.style.cssText = "display:none;color:var(--color-danger);font-size:12.5px;margin-top:10px;";
  vehErr.textContent = "Please select a vehicle type.";
  document.getElementById("vehicleSelectorMount").after(vehErr);

  const draft0 = getBookingDraft();
  if(draft0.address) document.getElementById("serviceAddress").value = draft0.address;
  if(draft0.makeModel) document.getElementById("vehicleMakeModel").value = draft0.makeModel;

  function validateStep1(){
    let ok = true;
    const vehicle = getVehicle();
    const address = document.getElementById("serviceAddress");

    document.getElementById("vehicleStepError").style.display = vehicle ? "none" : "block";
    if(!vehicle) ok = false;

    toggleFieldError(address, !address.value.trim());
    if(!address.value.trim()) ok = false;

    if(ok){
      setBookingDraft({
        address: address.value.trim(),
        makeModel: document.getElementById("vehicleMakeModel").value.trim(),
      });
    }
    return ok;
  }

  document.getElementById("toStep2").addEventListener("click", () => {
    if(validateStep1()) goToStep(2);
  });

  // ------------------------------------------------------------------
  // STEP 2 — Service & Add-ons
  // "Remaining" services (the 3 not chosen as the primary service) are
  // offered as bundle-in add-ons alongside the standard add-on list.
  // ------------------------------------------------------------------
  function renderPackagePickGrid(){
    const vehicleId = getVehicle() || "sedan";
    const selected = getSelectedService();
    document.getElementById("packagePickGrid").innerHTML = SERVICES.map(svc => `
      <button class="package-pick ${selected === svc.id ? 'is-selected' : ''}" data-service="${svc.id}">
        <span class="check-badge">${icon("check")}</span>
        <strong style="font-family:var(--font-display);font-size:16px;color:var(--color-text-primary);">${svc.name}</strong>
        <span class="mono" style="font-size:20px;">${formatPrice(priceForVehicle(svc.priceFrom, vehicleId))}</span>
        <div style="display:flex;flex-direction:column;gap:5px;margin-top:4px;">
          ${svc.included.slice(0, 3).map(f => `<div class="feature-line" style="font-size:13px;">${icon("check")}<span>${f}</span></div>`).join("")}
        </div>
      </button>`).join("");

    document.querySelectorAll("[data-service]").forEach(btn => {
      btn.addEventListener("click", () => {
        const newServiceId = btn.dataset.service;
        setSelectedService(newServiceId);
        // A service can't be both the primary pick and a bundled add-on.
        const addons = getSelectedAddons();
        if(addons.includes(newServiceId)) setSelectedAddons(addons.filter(id => id !== newServiceId));
        renderPackagePickGrid();
        renderBookingAddonGrid();
        renderStep2Summary();
        updateConversionBarForStep(currentStep);
      });
    });
  }

  function renderBookingAddonGrid(){
    const vehicleId = getVehicle() || "sedan";
    const primaryServiceId = getSelectedService();
    const selected = getSelectedAddons();

    // Other services (besides whichever is primary) can be bundled in as
    // add-ons; standard add-ons are always available.
    const otherServices = primaryServiceId ? SERVICES.filter(s => s.id !== primaryServiceId) : [];
    const serviceTiles = otherServices.map(s => ({
      id: s.id, name: s.name, icon: "sparkle", price: priceForVehicle(s.priceFrom, vehicleId), isService: true,
    }));
    const addonTiles = ADDONS.map(a => ({ id: a.id, name: a.name, icon: a.icon, price: a.price, isService: false }));
    const tiles = [...serviceTiles, ...addonTiles];

    document.getElementById("bookingAddonGrid").innerHTML = tiles.map(t => `
      <div class="addon-card ${selected.includes(t.id) ? 'is-selected' : ''}" data-addon="${t.id}">
        <div class="addon-top">
          <div class="icon-tile" style="width:34px;height:34px;">${icon(t.icon)}</div>
          <label class="switch">
            <input type="checkbox" ${selected.includes(t.id) ? "checked" : ""} data-addon-toggle="${t.id}">
            <span class="track"></span>
          </label>
        </div>
        <div style="font-weight:700;font-size:14px;color:var(--color-text-primary);">${t.name}</div>
        ${t.isService ? `<span class="badge badge-soft" style="width:fit-content;font-size:10.5px;">Bundle Service</span>` : ""}
        <div class="addon-price">+${formatPrice(t.price)}</div>
      </div>`).join("");

    document.querySelectorAll("[data-addon-toggle]").forEach(input => {
      input.addEventListener("change", () => {
        toggleAddon(input.dataset.addonToggle);
        input.closest(".addon-card").classList.toggle("is-selected", input.checked);
        renderStep2Summary();
        updateConversionBarForStep(currentStep);
      });
    });
    // Make the whole card tappable (not just the small switch) — much
    // easier to hit on a phone. Clicks that land on the switch itself
    // are left alone since the native label/checkbox already handles them.
    document.querySelectorAll("#bookingAddonGrid .addon-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if(e.target.closest(".switch")) return;
        const input = card.querySelector("[data-addon-toggle]");
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  function renderStep2Summary(){
    const serviceId = getSelectedService();
    const vehicleId = getVehicle() || "sedan";
    const addonIds = getSelectedAddons();
    const box = document.getElementById("step2Summary");
    if(!serviceId){
      box.innerHTML = `<span class="text-muted">Select a service to see your running total.</span>`;
      return;
    }
    const svc = serviceById(serviceId);
    const svcPrice = priceForVehicle(svc.priceFrom, vehicleId);
    let rows = `<div class="row"><span>${svc.name}</span><span class="amount">${formatPrice(svcPrice)}</span></div>`;
    let total = svcPrice;
    addonIds.forEach(id => {
      const extra = extraById(id, vehicleId);
      if(!extra) return;
      rows += `<div class="row"><span>${extra.name}</span><span class="amount">+${formatPrice(extra.price)}</span></div>`;
      total += extra.price;
    });
    rows += `<div class="row total"><span>Running Total</span><span>${formatPrice(total)}</span></div>`;
    box.innerHTML = rows;
  }

  function renderStep2(){
    renderPackagePickGrid();
    renderBookingAddonGrid();
    renderStep2Summary();
  }

  document.getElementById("viewFullComparison").addEventListener("click", () => {
    window.location.href = "comparison.html";
  });

  document.getElementById("toStep3").addEventListener("click", () => {
    if(!getSelectedService()){
      showElError("packageStepError", true, "Please choose a service to continue.");
      const el = document.getElementById("packageStepError");
      document.getElementById("packagePickGrid").after(el);
      return;
    }
    document.getElementById("packageStepError")?.remove();
    goToStep(3);
  });

  // ------------------------------------------------------------------
  // STEP 3 — Date & Time
  // Time is a free-text field (the person writes their preferred time)
  // rather than a fixed slot picker — exact availability gets confirmed
  // on WhatsApp.
  // ------------------------------------------------------------------
  const MAX_DAYS_OUT = 45;

  function isDayFullyBooked(dateKey){ return hashStr(dateKey) % 9 === 0; }

  function buildCalendar(){
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + calendarMonthOffset);
    const year = base.getFullYear(), month = base.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0,0,0,0);
    const maxDate = new Date(today.getTime() + MAX_DAYS_OUT * 86400000);
    const todayKey = formatDateKey(today);

    let head = `<div class="mini-cal-head">
      <button id="calPrev" ${calendarMonthOffset <= 0 ? "disabled" : ""} aria-label="Previous month">${icon("chevronLeft")}</button>
      <span>${base.toLocaleString(undefined, { month: "long", year: "numeric" })}</span>
      <button id="calNext" ${calendarMonthOffset >= 2 ? "disabled" : ""} aria-label="Next month">${icon("chevronRight")}</button>
    </div>`;

    let grid = `<div class="mini-cal-grid">`;
    ["S","M","T","W","T","F","S"].forEach(d => grid += `<span class="dow">${d}</span>`);
    for(let i = 0; i < firstDow; i++) grid += `<span></span>`;
    for(let day = 1; day <= totalDays; day++){
      const dateObj = new Date(year, month, day);
      const key = formatDateKey(dateObj);
      const disabled = dateObj < today || dateObj > maxDate || isDayFullyBooked(key);
      const isToday = key === todayKey;
      const isSelected = key === selectedDateKey;
      grid += `<button data-date="${key}" ${disabled ? "disabled" : ""} class="${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}">${day}</button>`;
    }
    grid += `</div>`;

    document.getElementById("miniCalendar").innerHTML = head + grid;

    document.getElementById("calPrev").addEventListener("click", () => { calendarMonthOffset--; buildCalendar(); });
    document.getElementById("calNext").addEventListener("click", () => { calendarMonthOffset++; buildCalendar(); });
    document.querySelectorAll("[data-date]").forEach(btn => {
      if(btn.disabled) return;
      btn.addEventListener("click", () => {
        selectedDateKey = btn.dataset.date;
        setBookingDraft({ date: selectedDateKey });
        buildCalendar();
        renderTimeInputForSelected();
        updateStep3NextState();
      });
    });
  }

  function renderTimeInputForSelected(){
    const wrap = document.getElementById("timeSlots");
    if(!selectedDateKey){
      wrap.innerHTML = `<p class="text-muted" style="font-size:14px;">Select a date first, then write your preferred time.</p>`;
      return;
    }
    wrap.innerHTML = `
      <div class="form-field" style="margin:0;">
        <label for="preferredTime">Preferred Time — ${prettyDate(selectedDateKey)}</label>
        <input type="text" id="preferredTime" placeholder="e.g. 2:00 PM" value="${selectedTime ? selectedTime.replace(/"/g, "&quot;") : ""}">
        <p class="hint">Write whatever time works for you — we'll confirm exact availability on WhatsApp.</p>
      </div>`;
    const input = document.getElementById("preferredTime");
    input.addEventListener("input", () => {
      selectedTime = input.value.trim();
      setBookingDraft({ time: selectedTime });
      updateStep3NextState();
    });
  }

  function updateStep3NextState(){
    document.getElementById("toStep4").disabled = !(selectedDateKey && selectedTime && selectedTime.trim());
  }

  function renderStep3(){
    const draft = getBookingDraft();
    selectedDateKey = draft.date || null;
    selectedTime = draft.time || null;
    calendarMonthOffset = 0;
    buildCalendar();
    renderTimeInputForSelected();
    updateStep3NextState();
  }

  document.getElementById("toStep4").addEventListener("click", () => {
    if(selectedDateKey && selectedTime) goToStep(4);
  });

  // ------------------------------------------------------------------
  // STEP 4 — Review & Contact (no payment form — WhatsApp handles the rest)
  // ------------------------------------------------------------------
  function renderOrderSummary(){
    const vehicleId = getVehicle() || "sedan";
    const serviceId = getSelectedService();
    const svc = serviceById(serviceId);
    const addonIds = getSelectedAddons();
    const draft = getBookingDraft();

    const svcPrice = priceForVehicle(svc.priceFrom, vehicleId);
    let addonsTotal = 0;
    const addonRows = addonIds.map(id => {
      const extra = extraById(id, vehicleId);
      if(!extra) return "";
      addonsTotal += extra.price;
      return `<div class="summary-line"><span class="label">${extra.name}</span><span class="val">+${formatPrice(extra.price)}</span></div>`;
    }).join("");

    const total = svcPrice + addonsTotal;
    setBookingDraft({ total });

    document.getElementById("orderSummary").innerHTML = `
      <h3 style="margin-bottom:6px;">Order Summary</h3>
      <div class="summary-line"><span class="label">Vehicle</span><span class="val">${vehicleById(vehicleId).label}<a class="edit" data-goto="1">Edit</a></span></div>
      <div class="summary-line"><span class="label">Service</span><span class="val">${svc.name}<a class="edit" data-goto="2">Edit</a></span></div>
      ${addonRows}
      <div class="summary-line"><span class="label">Date & Time</span><span class="val">${selectedDateKey ? prettyDate(selectedDateKey) + " · " + selectedTime : "—"}<a class="edit" data-goto="3">Edit</a></span></div>
      <div class="summary-line"><span class="label">Address</span><span class="val">${draft.address || "—"}<a class="edit" data-goto="1">Edit</a></span></div>
      <div class="summary-line" style="border-top:2px solid var(--color-border);padding-top:12px;"><span class="label" style="font-weight:700;color:var(--color-text-primary);">Total</span><span class="val" style="font-size:18px;">${formatPrice(total)}</span></div>`;

    document.querySelectorAll("[data-goto]").forEach(a => {
      a.addEventListener("click", () => goToStep(parseInt(a.dataset.goto, 10)));
    });
  }

  function renderStep4(){
    renderOrderSummary();
    const iconWrap = document.getElementById("confirmBtnIcon");
    if(iconWrap) iconWrap.innerHTML = icon("whatsapp");
  }

  function validateStep4(){
    // No required fields on this step anymore — the order summary plus
    // an optional note is everything that's sent, so there's nothing to
    // block on. Kept as a function in case fields are reintroduced later.
    return true;
  }

  // Builds the full WhatsApp message from everything selected/entered.
  function buildBookingMessage(){
    const vehicleId = getVehicle() || "sedan";
    const serviceId = getSelectedService();
    const svc = serviceById(serviceId);
    const addonIds = getSelectedAddons();
    const draft = getBookingDraft();

    const addonLines = addonIds
      .map(id => extraById(id, vehicleId))
      .filter(Boolean)
      .map(e => `${e.name} (+${formatPrice(e.price)})`);

    const lines = [
      `Hi ${BRAND.name}! I'd like to book a detail.`,
      "",
      `Vehicle: ${vehicleById(vehicleId).label}${draft.makeModel ? " — " + draft.makeModel : ""}`,
      `Service: ${svc.name} (${formatPrice(priceForVehicle(svc.priceFrom, vehicleId))})`,
    ];
    if(addonLines.length) lines.push(`Add-ons: ${addonLines.join(", ")}`);
    lines.push(
      `Date: ${selectedDateKey ? prettyDate(selectedDateKey) : "—"}`,
      `Time: ${selectedTime || "—"}`,
      `Address: ${draft.address || "—"}`,
    );
    if(draft.instructions) lines.push(`Notes: ${draft.instructions}`);
    lines.push(`Estimated Total: ${formatPrice(draft.total || 0)}`);

    return lines.join("\n");
  }

  document.getElementById("confirmBookingBtn").addEventListener("click", function(){
    if(!validateStep4()) return;
    setBookingDraft({
      instructions: document.getElementById("specialInstructions").value.trim(),
    });
    const btn = this;
    btn.disabled = true;
    btn.textContent = "Opening WhatsApp...";
    setTimeout(() => {
      const message = buildBookingMessage();
      const url = buildWhatsAppBookingUrl(message);
      window.open(url, "_blank", "noopener");
      renderConfirmation(url);
      showPanel("confirm");
    }, 500);
  });

  // ------------------------------------------------------------------
  // CONFIRMATION
  // ------------------------------------------------------------------
  function renderConfirmation(whatsappUrl){
    const draft = getBookingDraft();
    const vehicleId = getVehicle() || "sedan";
    const svc = serviceById(getSelectedService());

    document.getElementById("confirmIcon").innerHTML = icon("whatsapp");
    document.getElementById("confirmSubtext").textContent = "We've opened WhatsApp with your booking details — just hit send and we'll confirm your slot.";
    document.getElementById("confirmSummary").innerHTML = `
      <div class="summary-line"><span class="label">Service</span><span class="val">${svc.name}</span></div>
      <div class="summary-line"><span class="label">Vehicle</span><span class="val">${vehicleById(vehicleId).label}</span></div>
      <div class="summary-line"><span class="label">Date & Time</span><span class="val">${selectedDateKey ? prettyDate(selectedDateKey) + " · " + selectedTime : "—"}</span></div>
      <div class="summary-line"><span class="label">Address</span><span class="val">${draft.address || "—"}</span></div>
      <div class="summary-line" style="border-top:2px solid var(--color-border);padding-top:12px;"><span class="label" style="font-weight:700;color:var(--color-text-primary);">Estimated Total</span><span class="val" style="font-size:18px;">${formatPrice(draft.total || 0)}</span></div>`;

    const openBtn = document.getElementById("openWhatsAppBtn");
    openBtn.href = whatsappUrl;
    document.getElementById("reschedulewhatsapp").href = WHATSAPP_GENERIC_URL;
  }

  // Best-effort parser for the free-text time field — handles common
  // formats like "2pm", "2:30 PM", "14:00", "2". Anything it can't
  // confidently parse falls back to a default hour; the exact typed
  // text is always included in the calendar event's description too,
  // so nothing is ever lost even if this can't figure out the hour.
  function parseTimeLabel(label){
    if(!label) return null;
    const match = String(label).match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/);
    if(!match) return null;
    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3] ? match[3].toUpperCase() : null;
    if(isNaN(hour) || hour > 23 || (minute && minute > 59)) return null;
    if(ampm === "PM" && hour !== 12) hour += 12;
    if(ampm === "AM" && hour === 12) hour = 0;
    return { hour, minute };
  }

  document.getElementById("addToCalendarBtn").addEventListener("click", () => {
    if(!selectedDateKey || !selectedTime) return;
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    const parsed = parseTimeLabel(selectedTime);
    const hour = parsed ? parsed.hour : 9;
    const minute = parsed ? parsed.minute : 0;
    const start = new Date(y, m - 1, d, hour, minute);
    const end = new Date(start.getTime() + 90 * 60000);
    const fmt = (dt) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    const svc = serviceById(getSelectedService());
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
      `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${svc.name} — ${BRAND.name}`,
      `DESCRIPTION:Mobile detailing appointment at ${getBookingDraft().address || ""}. Requested time: ${selectedTime}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "appointment.ics";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  document.getElementById("referBtn").addEventListener("click", async function(){
    const shareData = { title: BRAND.name, text: "Get your car detailed by Mob Car Detailing — mobile car detailing in Melbourne:", url: window.location.origin };
    if(navigator.share){
      try{ await navigator.share(shareData); }catch(e){ /* user cancelled */ }
    }else{
      try{
        await navigator.clipboard.writeText(shareData.url);
        const original = this.textContent;
        this.textContent = "Link Copied!";
        setTimeout(() => { this.textContent = original; }, 1800);
      }catch(e){ /* clipboard unavailable */ }
    }
  });

  // --- Init ---
  showPanel(1);
});
