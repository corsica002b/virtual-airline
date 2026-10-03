/* Logique du site en mode démo : les données restent dans le navigateur (localStorage).
   Pour un vrai site multi-pilotes, il faudra une base de données côté serveur. */
(function () {
  const C = window.VA_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const on = (s, ev, fn) => { const e = $(s); if (e) e.addEventListener(ev, fn); };
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rank = h => h >= 300 ? "Commandant" : h >= 100 ? "Premier officier" : h >= 25 ? "Second officier" : "Cadet";
  const vatsim = () => fetch(C.vatsimUrl).then(r => r.json());

  async function hash(s) {
    if (!(window.crypto && crypto.subtle)) return "p:" + s;
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("va:" + s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  async function users() {
    let u = load("va_users", null);
    if (!u) {
      u = [{ id: "VA001", name: "Pilote Démo", email: "demo@virtualairlines.local", pass: await hash("demo123"), simbrief: "", role: "admin", flights: 48, hours: 342, miles: 184560 }];
      save("va_users", u);
    }
    return u;
  }
  async function me() {
    const e = load("va_session", null);
    return e ? (await users()).find(u => u.email === e) || null : null;
  }

  function clocks() {
    const p = n => String(n).padStart(2, "0");
    const f = () => {
      const d = new Date();
      $$("[data-utc]").forEach(e => e.textContent = p(d.getUTCHours()) + ":" + p(d.getUTCMinutes()));
      $$("[data-local]").forEach(e => e.textContent = p(d.getHours()) + ":" + p(d.getMinutes()));
    };
    f(); setInterval(f, 15000);
  }

  function profile(u) {
    const set = (sel, v) => $$(sel).forEach(e => e.textContent = v);
    if (!u) {
      set("[data-user-name]", "pilote");
      $$("[data-auth]").forEach(e => e.innerHTML = '<a href="connexion.html">Connexion</a>');
      return;
    }
    const first = u.name.split(" ")[0];
    set("[data-user-name]", first); set("[data-profile-name]", first);
    set("[data-profile-email]", u.email);
    set("[data-stat-hours]", u.hours + " h"); set("[data-stat-flights]", u.flights);
    set("[data-stat-miles]", u.miles.toLocaleString("fr-FR")); set("[data-rank]", rank(u.hours));
    $$("[data-profile-simbrief]").forEach(i => i.value = u.simbrief || "");
    $$("[data-auth]").forEach(e => e.innerHTML = esc(u.email) + ' · <a href="#" data-logout>Déconnexion</a>');
  }

  function renderReports(u) {
    const t = $("#myReports"); if (!t) return;
    const r = u ? load("va_reports", []).filter(x => x.pilot === u.email) : [];
    t.innerHTML = r.length ? r.map(x => `<tr><td>${esc(x.flight)}</td><td>${esc(x.date)}</td><td>${esc(x.from)} → ${esc(x.to)}</td><td>${esc(x.aircraft)}</td><td>${esc(x.duration)} h</td><td><span class="badge">${esc(x.status)}</span></td><td>${esc(x.id)}</td></tr>`).join("") : '<tr><td colspan="7">Aucun rapport pour le moment.</td></tr>';
  }

  function renderBookings(u) {
    const t = $("#bookingRows"); if (!t) return;
    if (!u) { $("#bookingMsg").innerHTML = '<div class="notice">Connectez-vous pour voir vos réservations. <a href="connexion.html">Connexion</a></div>'; return; }
    const b = load("va_bookings", []).filter(x => x.pilot === u.email);
    t.innerHTML = b.length ? b.map(x => `<tr><td>${esc(x.date)}</td><td>${esc(x.flight)}</td><td>${esc(x.from)} → ${esc(x.to)}</td><td>${esc(x.aircraft)}</td><td><span class="badge">${esc(x.status)}</span></td><td><button class="filter" data-cancel="${esc(x.flight)}|${esc(x.date)}">Annuler</button></td></tr>`).join("") : '<tr><td colspan="6">Aucune réservation. Choisissez un vol dans le programme.</td></tr>';
  }

  function admin(u, us) {
    const t = $("#adminUsers"); if (!t) return;
    const set = (sel, v) => $$(sel).forEach(e => e.textContent = v);
    if (!u || u.role !== "admin") {
      t.closest("section").innerHTML = '<p>Accès réservé au staff. <a href="connexion.html">Connexion</a></p>';
      return;
    }
    set("[data-admin-pilots]", us.length);
    set("[data-admin-bookings]", load("va_bookings", []).length);
    set("[data-admin-reports]", load("va_reports", []).filter(r => r.status === "En attente").length);
    t.innerHTML = us.map(x => `<tr><td>${esc(x.id)}</td><td>${esc(x.name)}</td><td>${esc(x.email)}</td><td>${esc(rank(x.hours))}</td><td>${esc(x.flights)}</td><td>${esc(x.hours)} h</td><td>${esc(x.role)}</td></tr>`).join("");
  }

  async function init() {
    clocks();
    const us = await users(), u = await me();
    profile(u); renderReports(u); renderBookings(u); admin(u, us);

    document.addEventListener("click", async e => {
      if (e.target.closest("[data-logout]")) { e.preventDefault(); localStorage.removeItem("va_session"); location.href = "connexion.html"; return; }
      const c = e.target.closest("[data-cancel]");
      if (c) { const [f, d] = c.dataset.cancel.split("|"); save("va_bookings", load("va_bookings", []).filter(x => !(x.flight === f && x.date === d && x.pilot === (u && u.email)))); renderBookings(u); return; }
      const b = e.target.closest("[data-book-flight]");
      if (b) {
        if (!u) { alert("Connectez-vous pour réserver un vol."); location.href = "connexion.html"; return; }
        const d = b.dataset, bk = load("va_bookings", []);
        if (!bk.some(x => x.pilot === u.email && x.flight === d.bookFlight && x.date === d.date))
          bk.push({ pilot: u.email, flight: d.bookFlight, date: d.date, from: d.from, to: d.to, aircraft: d.aircraft, status: "Confirmée" });
        save("va_bookings", bk); location.href = "reservations.html";
      }
    });

    on("#loginForm", "submit", async e => {
      e.preventDefault();
      const f = new FormData(e.target), h = await hash(f.get("password"));
      const found = us.find(x => x.email === f.get("email").trim().toLowerCase() && x.pass === h);
      if (!found) { $("#loginMsg").textContent = "E-mail ou mot de passe incorrect."; return; }
      save("va_session", found.email); location.href = "espace-pilote.html";
    });

    on("#registerForm", "submit", async e => {
      e.preventDefault();
      const f = new FormData(e.target), email = f.get("email").trim().toLowerCase(), m = $("#registerMsg");
      if (us.some(x => x.email === email)) { m.textContent = "Cet e-mail est déjà utilisé."; return; }
      us.push({ id: "VA" + String(us.length + 1).padStart(3, "0"), name: f.get("name").trim(), email, pass: await hash(f.get("password")), simbrief: f.get("simbrief") || "", role: "pilot", flights: 0, hours: 0, miles: 0 });
      save("va_users", us); save("va_session", email);
      m.textContent = "Compte créé. Redirection…"; setTimeout(() => location.href = "espace-pilote.html", 700);
    });

    on("#reportForm", "submit", e => {
      e.preventDefault();
      const m = $("#reportMsg");
      if (!u) { m.innerHTML = 'Connectez-vous pour envoyer un rapport. <a href="connexion.html">Connexion</a>'; return; }
      const f = Object.fromEntries(new FormData(e.target)), r = load("va_reports", []);
      r.push({ id: "R" + Date.now().toString(36).toUpperCase(), pilot: u.email, flight: f.flight.toUpperCase(), date: f.date, from: f.from.toUpperCase(), to: f.to.toUpperCase(), aircraft: f.aircraft, duration: +f.duration, status: "En attente" });
      save("va_reports", r); e.target.reset(); m.textContent = "Rapport envoyé. Il est en attente de validation."; renderReports(u);
    });

    on("[data-profile-simbrief]", "change", e => { if (!u) return; u.simbrief = e.target.value.trim(); save("va_users", us); });

    on("#simbriefForm", "submit", e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target)), types = { A350: "A359", A380: "A388" };
      const from = f.from.toUpperCase(), to = f.to.toUpperCase();
      const url = "https://dispatch.simbrief.com/options/custom?" + new URLSearchParams({ orig: from, dest: to, type: types[f.aircraft] || f.aircraft });
      $("#simOut").innerHTML = "Plan prêt : " + esc(from) + " → " + esc(to) + " (" + esc(f.aircraft) + '). <a href="' + esc(url) + '" target="_blank" rel="noopener">Ouvrir SimBrief</a>';
    });

    if ($("#pilotRows")) vatsim().then(d => {
      $("#pilotRows").innerHTML = d.pilots.slice(0, 30).map(p => `<tr><td>${esc(p.callsign)}</td><td>${esc(p.name)}</td><td>${esc(p.flight_plan && p.flight_plan.departure || "-")}</td><td>${esc(p.flight_plan && p.flight_plan.arrival || "-")}</td><td>${esc(p.altitude)} ft</td></tr>`).join("");
    }).catch(() => { $("#pilotRows").innerHTML = '<tr><td colspan="5">Données VATSIM indisponibles.</td></tr>'; });
  }

  window.VA = { vatsim, esc };
  init();
})();
