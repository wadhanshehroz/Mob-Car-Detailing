/* ==========================================================================
   SHARED STATE
   Persists the Interactive Vehicle Selector + package/add-on choices across
   Homepage -> Comparison Page -> Booking Page, per the blueprint's
   "Key state-persistence note". Uses localStorage since this is a real
   multi-page site (not a sandboxed artifact).
   ========================================================================== */

const STORE_KEY = "detailing_site_state_v1";

function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return {};
    return JSON.parse(raw);
  }catch(e){
    return {};
  }
}

function saveState(patch){
  const current = loadState();
  const next = Object.assign({}, current, patch);
  try{
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  }catch(e){ /* storage unavailable — fail silently, site still works */ }
  return next;
}

function getVehicle(){
  return loadState().vehicleId || null;
}
function setVehicle(vehicleId){
  saveState({ vehicleId });
}

function getSelectedPackage(){
  return loadState().packageId || null;
}
function setSelectedPackage(packageId){
  saveState({ packageId });
}

// Selected SERVICE for the booking flow (distinct from packageId, which is
// only used by the Comparison page's Essential/Premium/Signature picker).
// Kept as a separate key so the two pages never interfere with each other.
function getSelectedService(){
  return loadState().serviceId || null;
}
function setSelectedService(serviceId){
  saveState({ serviceId });
}

function getSelectedAddons(){
  return loadState().addonIds || [];
}
function setSelectedAddons(addonIds){
  saveState({ addonIds });
}
function toggleAddon(addonId){
  const current = getSelectedAddons();
  const next = current.includes(addonId)
    ? current.filter(id => id !== addonId)
    : [...current, addonId];
  saveState({ addonIds: next });
  return next;
}

function getBookingDraft(){
  return loadState().booking || {};
}
function setBookingDraft(patch){
  const current = getBookingDraft();
  saveState({ booking: Object.assign({}, current, patch) });
}
function clearBookingDraft(){
  saveState({ booking: {}, packageId: null, serviceId: null, addonIds: [] });
}

// Computes the running total from whatever has been selected so far.
// Used by the fixed mobile conversion bar and the booking flow summary.
// Prefers a selected SERVICE (booking flow); falls back to a selected
// PACKAGE (comparison page) so that page's subtotal display keeps working.
function computeRunningTotal(){
  const vehicleId = getVehicle() || "sedan";
  const serviceId = getSelectedService();
  const packageId = getSelectedPackage();
  const addonIds = getSelectedAddons();

  let total = 0;
  if(serviceId){
    const svc = serviceById(serviceId);
    total += priceForVehicle(svc.priceFrom, vehicleId);
  }else if(packageId){
    const pkg = packageById(packageId);
    total += priceForVehicle(pkg.basePrice, vehicleId);
  }
  addonIds.forEach(id => {
    const extra = extraById(id, vehicleId);
    if(extra) total += extra.price;
  });
  return total;
}
