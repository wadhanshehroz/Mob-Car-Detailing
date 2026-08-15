/* ==========================================================================
   GALLERY PAGE LOGIC
   Shows a before/after slider for every service in SERVICES — add a new
   service in js/data.js and it automatically gets a slider here too.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("headerMount").innerHTML = renderHeader("gallery");
  document.getElementById("footerMount").innerHTML = renderFooter(false);
  document.getElementById("conversionBarMount").innerHTML = renderConversionBar("default");
  bindHeader();
  bindConversionBar();

  const mount = document.getElementById("galleryMount");
  mount.innerHTML = SERVICES.map((svc, i) => `
    <section class="section ${i % 2 === 1 ? "section--alt" : ""}">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">${svc.name}</span>
          <h2>${svc.valueProp}</h2>
        </div>
        <div id="galleryBa${i}"></div>
        <div style="text-align:center;margin-top:20px;">
          <a href="service.html?service=${svc.id}" class="btn-link">View ${svc.name} details →</a>
        </div>
      </div>
    </section>`).join("");

  SERVICES.forEach((svc, i) => {
    document.getElementById(`galleryBa${i}`).innerHTML = renderBeforeAfter({
      beforeImg: "../" + svc.beforeImage,
      afterImg: "../" + svc.afterImage,
      caption: `${svc.name} — real results from a recent job`,
      idSuffix: String(i),
    });
    bindBeforeAfter(String(i));
  });

  bindReveal();
});
