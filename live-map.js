(function () {
  const el = document.getElementById("liveMap");
  if (!el || !window.L || !window.VA) return;
  const C = window.VA_CONFIG || {}, esc = VA.esc;
  const vaRe = new RegExp("^" + (C.vaPrefix || "VA") + "\\d", "i");
  const isVA = p => vaRe.test(p.callsign || "");
  const $ = id => document.getElementById(id);

  const map = L.map(el, { preferCanvas: true }).setView([40, 10], 3);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
  const layer = L.layerGroup().addTo(map);
  let data = null, filter = "all", q = "";

  function select(p) {
    const fp = p.flight_plan || {};
    $("selectedAircraft").innerHTML = `<h2>${esc(p.callsign)}</h2><p class="muted">${esc(p.name)}</p>
      <p><b>${esc(fp.departure || "?")}</b> → <b>${esc(fp.arrival || "?")}</b></p>
      <p>Appareil : ${esc(fp.aircraft_short || "?")}<br>Altitude : ${esc(p.altitude)} ft<br>Vitesse sol : ${esc(p.groundspeed)} kt<br>Cap : ${esc(p.heading)}°</p>`;
  }

  function draw() {
    layer.clearLayers();
    if (!data || filter === "atc") return;
    data.pilots.forEach(p => {
      const v = isVA(p);
      if (filter === "va" && !v) return;
      if (filter === "pilot" && v) return;
      if (q && !((p.callsign || "") + " " + ((p.flight_plan || {}).departure || "") + " " + ((p.flight_plan || {}).arrival || "")).toLowerCase().includes(q)) return;
      L.circleMarker([p.latitude, p.longitude], { radius: v ? 6 : 3, color: v ? "#2ea043" : "#3b82f6", weight: 1, fillOpacity: .8 })
        .on("click", () => select(p)).addTo(layer);
    });
  }

  function refresh() {
    VA.vatsim().then(d => {
      data = d;
      const atc = d.controllers.filter(c => c.facility > 0 && !/ATIS/.test(c.callsign));
      $("vatsimStatus").textContent = d.pilots.length + " pilotes · " + atc.length + " contrôleurs";
      $("nearbyAtc").innerHTML = atc.slice(0, 12).map(c => `<div><b>${esc(c.callsign)}</b> · ${esc(c.frequency)}</div>`).join("") || '<p class="muted">Aucun contrôleur en ligne.</p>';
      draw();
    }).catch(() => { $("vatsimStatus").textContent = "Données VATSIM indisponibles."; });
  }

  document.querySelectorAll(".filter[data-filter]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".filter[data-filter]").forEach(x => x.classList.remove("active"));
    b.classList.add("active"); filter = b.dataset.filter; draw();
  }));
  $("liveSearch").addEventListener("input", e => { q = e.target.value.trim().toLowerCase(); draw(); });
  $("centerMe").addEventListener("click", () => {
    const pts = data ? data.pilots.filter(isVA).map(p => [p.latitude, p.longitude]) : [];
    pts.length ? map.fitBounds(pts, { maxZoom: 6 }) : map.setView([46, 2], 5);
  });

  refresh(); setInterval(refresh, 60000);
})();
