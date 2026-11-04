// ============================================================================
//  Fuel — bulk dashboard (vanilla JS, saves to localStorage)
// ============================================================================
(() => {
const { STORES, PRODUCTS, RECIPES, ROTATION, SLOTS, DAILY_FIXED, CAMPUS, TEMPLATES, CAL_NOTES, FASTFOOD, OVERRIDES = {}, PREP = null, PROFILE, GOALS, BUDGET } = DATA;
const KEY = "fuelos.v1";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const R0 = (n) => Math.round(n);
const money = (n) => "$" + n.toFixed(2);

// ---------- icons ----------
const IC = {
  dash: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  plan: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  recipes: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/><path d="M9 7.5h6M9 11h4"/>',
  fast: '<path d="M5 8h14l-1.3 11.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  grocery: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.6l2.4 12.2a1.5 1.5 0 0 0 1.5 1.3h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6"/>',
  weight: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  sunrise: '<path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M12 4v3M4.9 8.9l2 2M19.1 8.9l-2 2"/>',
  cup: '<path d="M6 3h12l-1.6 17a1.5 1.5 0 0 1-1.5 1.4H9.1a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M6.5 8.5h11"/>',
  bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8.5 7.5c0-1.4 1-1.8 1-3.2M12.5 7.5c0-1.4 1-1.8 1-3.2"/>',
  layers: '<path d="M3 9.5 12 5l9 4.5-9 4.5z"/><path d="M3 14.5 12 19l9-4.5"/>',
  campus: '<path d="M3 21h18M5 21V9.5L12 4l7 5.5V21M9.5 21v-5h5v5"/>',
  home: '<path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10"/>',
  bolt: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>',
  left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
  pill: '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-40 12 12)"/><path d="m9.3 8.8 5.4 6.4"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  check: '<path d="M5 12.5 9.5 17 19 7.5"/>', star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
  print: '<path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
};
const I = (n) => `<svg class="i" viewBox="0 0 24 24">${IC[n] || ""}</svg>`;
const CB = `<svg viewBox="0 0 24 24"><path d="M5 12.5 9.5 17 19 7.5"/></svg>`;
const recipeIcon = (id) => ({ burritos: "sunrise", pscramble: "sunrise", shake: "cup", pshake: "cup", milkglass: "cup", pbsand: "layers", pbites: "layers" }[id] || "bowl");

// ---------- dates ----------
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const daysBetween = (a, b) => Math.round((parse(iso(b)) - parse(iso(a))) / 864e5);
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const wd = (d) => (d.getDay() + 6) % 7;
const fmt = (d, o) => d.toLocaleDateString(undefined, o);
const fmtShort = (d) => fmt(d, { month: "short", day: "numeric" });
const t12 = (hhmm) => { let [h, m] = hhmm.split(":").map(Number); const ap = h >= 12 && h < 24 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${pad(m)} ${ap}`; };
const hNum = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h + m / 60; };
const hLabel = (h) => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return t12(`${hh}:${pad(mm)}`); };

// ---------- state ----------
const today = new Date();
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const defaults = { settings: { planStart: "2026-11-02", creatineStart: iso(today), goals: { ...GOALS }, activity: 1.55, budget: BUDGET },
  logs: {}, weights: [], grocery: {}, aisles: {}, customFF: [], view: "dash" };
let S;
try { S = Object.assign(structuredClone(defaults), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = structuredClone(defaults); }
S.settings = Object.assign(structuredClone(defaults.settings), S.settings);
if (S.view === "today") S.view = "dash";
S.customFF ||= [];
if (!S.weights.length) S.weights.push({ date: S.settings.planStart, lb: PROFILE.weightLb });
const save = () => localStorage.setItem(KEY, JSON.stringify(S));
let cur = midnight(today);
const dayLog = (k) => (S.logs[k] ||= { done: {}, extra: [], creatine: 0 });

// ---------- nutrition & plan engine ----------
const recipeMacros = (id, srv = 1) => {
  const r = RECIPES[id], t = [0, 0, 0];
  r.ingredients.forEach(([p, g]) => { const n = PRODUCTS[p][6]; for (let i = 0; i < 3; i++) t[i] += (n[i] * g) / 100; });
  return t.map((x) => (x / r.servings) * srv);
};
const weekIndex = (d) => Math.floor(daysBetween(parse(S.settings.planStart), d) / 7);
const rotationFor = (wk) => ROTATION[((wk % 3) + 3) % 3];
function planFor(d) {
  const wk = weekIndex(d); if (wk < 0) return null;
  const ov = OVERRIDES[iso(d)];
  if (ov) return { wk, prep: true, rot: { name: PREP?.label || "Your prep", mains: [] }, items: ov.map(([time, id, srv, where, heat, note]) => ({ time, id, srv, where, heat, note })) };
  const rot = rotationFor(wk), w = wd(d), [L, D] = SLOTS[w];
  const items = TEMPLATES[w].map(([time, ref, srv, where, heat, note]) => ({ time, id: ref === "L" ? rot.mains[L] : ref === "D" ? rot.mains[D] : ref, srv, where, heat, note }));
  (rot.extras || []).forEach(([time, id, srv, where, heat, note]) => items.push({ time, id, srv, where, heat, note }));
  items.sort((a, b) => hNum(a.time) - hNum(b.time));
  return { wk, rot, items };
}
function totalsFor(d) {
  const log = S.logs[iso(d)] || { done: {}, extra: [] }, plan = planFor(d), t = [0, 0, 0], planned = [0, 0, 0];
  plan?.items.forEach((it, i) => recipeMacros(it.id, it.srv).forEach((v, j) => { planned[j] += v; if (log.done[i]) t[j] += v; }));
  (log.extra || []).forEach((e) => { t[0] += +e.kcal || 0; t[1] += +e.p || 0; t[2] += +e.c || 0; });
  return { t, planned };
}
const creatineTarget = (d) => { const n = daysBetween(parse(S.settings.creatineStart), d); return n < 0 ? 0 : n < 14 ? 2 : 1; };
const isCampus = (d, time) => { const c = CAMPUS[wd(d)]; return !!c && hNum(time) >= c[0] && hNum(time) < c[1]; };

// ---------- grocery engine (leftovers carry week to week) ----------
function weekNeeds(wk) {
  const rot = rotationFor(wk), need = {}, why = {};
  const add = (id, mult) => RECIPES[id].ingredients.forEach(([p, g]) => { need[p] = (need[p] || 0) + g * mult; (why[p] ||= new Set()).add(RECIPES[id].short); });
  DAILY_FIXED.forEach(([id, srv]) => add(id, id === "burritos" ? 1 : 7 * srv));
  rot.mains.forEach((m) => add(m, 1));
  (rot.extras || []).forEach((e) => add(e[1], 7 * e[2]));
  return { need, why };
}
function groceryFor(target) {
  const inv = {}; let out = [];
  for (let wk = 0; wk <= target; wk++) {
    const { need, why } = weekNeeds(wk);
    for (const p in need) {
      const [name, st, sec, where, pack, price, , unit] = PRODUCTS[p];
      const have = inv[p] || 0; let packs = 0;
      if (have < need[p] - 0.5) packs = Math.ceil((need[p] - have) / pack);
      inv[p] = have + packs * pack - need[p];
      if (wk === target) out.push({ p, name, st, sec, where, price, unit, packs, cost: packs * price, why: [...why[p]] });
    }
  }
  return out;
}

// ---------- fast food ----------
const allFF = () => [...FASTFOOD, ...S.customFF];
const ffTotals = (f, mult = 1) => f.parts.reduce((a, p) => [a[0] + p[1] * mult, a[1] + p[2] * mult, a[2] + p[3] * mult], [0, 0, 0]);

// ---------- motion helpers ----------
function countTo(el, to, dec = 0) {
  const from = parseFloat(el.dataset.v || "0"); el.dataset.v = to;
  const t0 = performance.now(), dur = 900;
  const step = (now) => { const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 4), v = from + (to - from) * e;
    el.textContent = dec ? v.toFixed(dec) : R0(v).toLocaleString(); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
  // fallback: if animation frames are paused (hidden tab), still show the final value
  setTimeout(() => { if (el.dataset.v == to) el.textContent = dec ? (+to).toFixed(dec) : R0(to).toLocaleString(); }, dur + 150);
}
function hydrate(root) {
  setTimeout(() => {
    $$("[data-w]", root).forEach((el) => (el.style.width = el.dataset.w + "%"));
    $$("[data-off]", root).forEach((el) => (el.style.strokeDashoffset = el.dataset.off));
    $$("[data-count]", root).forEach((el) => countTo(el, +el.dataset.count, +(el.dataset.dec || 0)));
  }, 40);
  $$("path.draw", root).forEach((p) => p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 1));
}
const toast = (msg) => { const t = $("#toast"); t.innerHTML = I("check") + esc(msg); t.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("on"), 1900); };
function openModal(html) { $("#modalBody").innerHTML = html; $("#modal").classList.add("on"); }
const closeModal = () => $("#modal").classList.remove("on");
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal" || e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ---------- sidebar ----------
const NAV = [["dash", "Dashboard"], ["plan", "Week plan"], ["recipes", "Recipes"], ["fast", "Fast food"], ["grocery", "Groceries"], ["weight", "Weight"], ["settings", "Settings"]];
$("#nav").insertAdjacentHTML("beforeend", NAV.map(([v, l]) => `<button data-v="${v}">${I(v)}<span>${l}</span></button>`).join(""));
function syncNav() {
  $$("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.v === S.view));
  const on = $(`#nav button[data-v="${S.view}"]`); if (on) $("#pill").style.transform = `translateY(${on.offsetTop}px)`;
  const ws = [...S.weights].sort((a, b) => a.date.localeCompare(b.date)), latest = ws[ws.length - 1]?.lb ?? PROFILE.weightLb;
  const prog = Math.max(0, Math.min(100, ((latest - PROFILE.weightLb) / (PROFILE.goalLb - PROFILE.weightLb)) * 100));
  const wk = weekIndex(midnight(today));
  $("#sbfoot").innerHTML = `<div class="lbl">${wk >= 0 ? `Week ${wk + 1} · ${rotationFor(wk).name}` : "Plan not started"}</div>
    <div class="big">${latest} <span class="muted" style="font-size:13px">/ ${PROFILE.goalLb} lb</span></div>
    <div class="mini"><i style="width:${prog}%"></i></div><div class="xs muted" style="margin-top:6px">${R0(prog)}% of the way to goal</div>`;
}
$("#nav").addEventListener("click", (e) => { const b = e.target.closest("button[data-v]"); if (!b || b.dataset.v === S.view) return; S.view = b.dataset.v; save(); render(true); window.scrollTo({ top: 0, behavior: "smooth" }); });

// ============================================================================
//  DASHBOARD
// ============================================================================
const METRICS = [["kcal", "Calories", "kcal", "kcal"], ["pro", "Protein", "protein", "g"], ["carb", "Carbs", "carbs", "g"]];
function nextIndex(plan, log) {
  if (!plan) return -1;
  const open = plan.items.map((it, i) => [it, i]).filter(([, i]) => !log.done[i]);
  if (!open.length) return -1;
  if (iso(cur) === iso(today)) { const nowH = today.getHours() + today.getMinutes() / 60; const f = open.find(([it]) => hNum(it.time) >= nowH - 0.75); return (f || open[open.length - 1])[1]; }
  return open[0][1];
}
function extrasHtml(log) {
  return (log.extra || []).map((e, i) => `<div class="x"><div style="flex:1;min-width:0"><div style="font-weight:500">${esc(e.name)}</div><div class="mono">${R0(e.kcal)} kcal · ${R0(e.p)} g protein · ${R0(e.c)} g carbs${e.price ? ` · ${money(+e.price)}` : ""}</div></div><button class="go" data-act="delx" data-i="${i}" title="Remove">${I("x")}</button></div>`).join("")
    || `<div class="small dim" style="padding:2px 0 4px">Nothing extra logged.</div>`;
}
const V = {};
V.dash = () => {
  const k = iso(cur), log = dayLog(k), plan = planFor(cur), g = S.settings.goals, { t, planned } = totalsFor(cur);
  const camp = CAMPUS[wd(cur)], ct = creatineTarget(cur), notes = CAL_NOTES[k] || [], isToday = k === iso(today);
  const hr = today.getHours(), greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const ni = nextIndex(plan, log), nDone = plan ? plan.items.filter((_, i) => log.done[i]).length : 0, nAll = plan?.items.length || 0;
  const H0 = 6, H1 = 24, pos = (h) => ((h - H0) / (H1 - H0)) * 100, nowH = today.getHours() + today.getMinutes() / 60;
  let streak = ""; for (let i = 13; i >= 0; i--) { const d = addDays(cur, -i), tg = creatineTarget(d), got = S.logs[iso(d)]?.creatine || 0; streak += `<i class="${tg && got >= tg ? "full" : got ? "part" : ""}" title="${fmtShort(d)}: ${got}/${tg}"></i>`; }
  const ring = (r, col, val, goal, id) => { const c = 2 * Math.PI * r, off = c * (1 - Math.min(val / goal, 1));
    return `<circle cx="85" cy="85" r="${r}" fill="none" stroke="#f0f0f2" stroke-width="11"/><circle class="p" id="${id}" cx="85" cy="85" r="${r}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${off}" transform="rotate(-90 85 85)"/>`; };
  const avg = (Math.min(t[0] / g.kcal, 1) + Math.min(t[1] / g.protein, 1) + Math.min(t[2] / g.carbs, 1)) / 3 * 100;

  return `
  <div class="top">
    <div><div class="eyebrow">${isToday ? greet + ", Logan" : "Viewing"} · ${plan ? `Week ${plan.wk + 1} · ${plan.rot.name}` : "Before plan start"}</div>
      <h1>${fmt(cur, { weekday: "long", month: "long", day: "numeric" })}</h1></div>
    <span class="sp"></span>
    ${camp ? `<span class="tag campus">${I("campus")} On campus ${hLabel(camp[0])} – ${hLabel(camp[1])}</span>` : `<span class="tag home">${I("home")} Home all day</span>`}
    <div class="seg"><button data-act="prev" title="Previous day">${I("left")}</button><button data-act="today">Today</button><button data-act="next" title="Next day">${I("right")}</button></div>
  </div>

  <div class="grid kpis st">
    ${METRICS.map(([key, label, gk, unit], i) => { const v = t[i], goal = g[gk], pct = (v / goal) * 100;
      return `<div class="card kpi ${v >= goal ? "hit" : ""}" id="kpi-${key}" style="--i:${i};--glow:var(--${key})">
        <div class="k-top"><span class="dot" style="background:var(--${key})"></span>${label}<span class="pct" id="pct-${key}">${R0(pct)}%</span></div>
        <div class="val"><b id="val-${key}" data-count="${R0(v)}">0</b><span>/ ${goal.toLocaleString()} ${unit}</span></div>
        <div class="bar"><i id="bar-${key}" style="background:var(--${key})" data-w="${Math.min(pct, 100)}"></i></div>
        <div class="rem" id="rem-${key}">${v >= goal ? "Goal reached" : `${R0(goal - v).toLocaleString()} ${unit} remaining`}</div></div>`; }).join("")}
    <div class="card kpi" style="--i:3;--glow:var(--cre)">
      <div class="k-top"><span class="dot" style="background:var(--cre)"></span>Creatine<span class="pct">${ct === 2 ? "Loading" : ct === 1 ? "Maintenance" : "Not started"}</span></div>
      <div class="cre" id="cre">${Array.from({ length: Math.max(ct, 1) }, (_, i) => `<button class="${log.creatine > i ? "on" : ""}" data-act="cre" data-i="${i}">${I("pill")}<span>Serving ${i + 1}</span></button>`).join("")}</div>
      <div class="streak" id="streak">${streak}</div>
      <div class="rem">${ct === 2 ? `2 a day through ${fmtShort(addDays(parse(S.settings.creatineStart), 13))}` : ct === 1 ? "1 serving a day" : `Starts ${fmtShort(parse(S.settings.creatineStart))}`}</div>
    </div>
  </div>

  <div class="grid main2">
    <div class="card st" style="--i:4">
      <div class="mhead"><h3 class="h" style="font-size:16px;font-weight:600">Today's meals</h3>
        <div class="mcount"><span id="mcount">${nDone} of ${nAll} eaten</span><div class="bar"><i id="mbar" data-w="${nAll ? (nDone / nAll) * 100 : 0}"></i></div></div></div>
      ${plan ? `<div class="next-line" id="nextline">${nextLine(plan, ni)}</div>
      <div class="meals st">${plan.items.map((it, i) => { const r = RECIPES[it.id], m = recipeMacros(it.id, it.srv), oc = isCampus(cur, it.time);
        return `<div class="meal ${log.done[i] ? "done" : ""} ${i === ni ? "next" : ""}" data-row="${i}" style="--i:${i}">
          <button class="cb" data-act="eat" data-i="${i}" aria-label="Mark eaten">${CB}</button>
          <div class="tm">${t12(it.time)}<small>${oc ? "Packed" : "At home"}</small></div>
          <div class="ic">${I(recipeIcon(it.id))}</div>
          <div><span class="ttl" data-act="recipe" data-id="${it.id}">${it.srv > 1 ? `${it.srv}× ` : ""}${esc(r.short)}</span><span class="nextpill">Up next</span>
            <div class="meta">${oc ? `<span class="tag campus">${I("campus")}Campus</span>` : `<span class="tag home">${I("home")}Home</span>`}
              ${it.heat === "microwave" ? `<span class="tag">${I("bolt")}Microwave</span>` : it.heat === "cold" ? `<span class="tag">${I("snow")}Eat cold</span>` : it.heat === "cook" ? `<span class="tag">${I("sunrise")}Cook fresh</span>` : ""}</div>
            <div class="mac"><b style="color:var(--kcal)">${R0(m[0])}</b> kcal · <b style="color:var(--pro)">${R0(m[1])}</b> g protein · <b style="color:var(--carb)">${R0(m[2])}</b> g carbs</div>
            ${it.note ? `<div class="note">${esc(it.note)}</div>` : ""}</div>
          <button class="go" data-act="recipe" data-id="${it.id}" title="Recipe">${I("right")}</button></div>`; }).join("")}</div>
      <div class="small dim mono" style="margin-top:12px">Full plan: ${R0(planned[0]).toLocaleString()} kcal · ${R0(planned[1])} g P · ${R0(planned[2])} g C</div>`
      : `<div class="muted">The plan starts ${fmtShort(parse(S.settings.planStart))}. You can change that in Settings.</div>`}
    </div>

    <div class="grid">
      <div class="card st" style="--i:5"><div class="ch"><h3>Daily progress</h3><span class="sp"></span><span class="sub">all three goals</span></div>
        <div class="ringwrap"><div class="ringc"><svg width="170" height="170" viewBox="0 0 170 170">${ring(76, "#0a0a0a", t[0], g.kcal, "rg-kcal")}${ring(60, "#5c5c63", t[1], g.protein, "rg-pro")}${ring(44, "#a8a8b0", t[2], g.carbs, "rg-carb")}</svg>
          <div class="center"><b><span id="rg-avg" data-count="${R0(avg)}">0</span>%</b><small>complete</small></div></div>
          <div class="legend">${METRICS.map(([key, label, gk, unit], i) => `<div><i style="background:var(--${key})"></i>${label}<b id="lg-${key}">${R0(t[i]).toLocaleString()}<em> / ${g[gk].toLocaleString()}</em></b></div>`).join("")}</div></div></div>

      <div class="card st" style="--i:6"><div class="ch"><h3>Schedule</h3><span class="sp"></span><span class="sub">${camp ? "Striped = on campus" : "No classes"}</span></div>
        <div class="dayline"><div class="base"></div>${camp ? `<div class="blk" style="left:${pos(camp[0])}%;width:${pos(camp[1]) - pos(camp[0])}%"></div>` : ""}
          ${plan ? plan.items.map((it, i) => `<div class="d ${log.done[i] ? "done" : ""}" data-dot="${i}" title="${t12(it.time)} · ${esc(RECIPES[it.id].short)}" style="left:${pos(hNum(it.time))}%"></div>`).join("") : ""}
          ${isToday && nowH > H0 ? `<div class="now" style="left:${pos(nowH)}%"></div>` : ""}</div>
        <div class="hours"><span>6a</span><span>9a</span><span>12p</span><span>3p</span><span>6p</span><span>9p</span><span>12a</span></div>
        ${notes.map((n) => `<div class="cal">${I("cal")}<span>${esc(n.replace(/^\S+\s/, ""))}</span></div>`).join("")}
      </div>

      <div class="card st" style="--i:7"><div class="ch"><h3>Log something else</h3><span class="sp"></span><button class="btn sm" data-act="goview" data-v="fast">${I("fast")}Fast food</button></div>
        <div class="xlist" id="xlist">${extrasHtml(log)}</div>
        <div class="xadd"><input id="xn" placeholder="Food name" /><input id="xk" type="number" placeholder="kcal" /><input id="xp" type="number" placeholder="Protein g" /><input id="xc" type="number" placeholder="Carbs g" />
          <button class="btn pri" data-act="addx">${I("plus")}Add to today</button></div>
        <div class="chips">${[["Whole milk 16 oz", 298, 16, 23], ["Peanut butter 2 Tbsp", 190, 7, 7], ["Banana", 105, 1, 27], ["Cooked rice, 1 cup", 205, 4, 45], ["Extra burrito", ...recipeMacros("burritos")]]
          .map(([n, k2, p, c]) => `<button class="btn" data-act="quick" data-n="${esc(n)}" data-k="${R0(k2)}" data-p="${R0(p)}" data-c="${R0(c)}">${I("plus")}${esc(n)}</button>`).join("")}</div>
      </div>
    </div>
  </div>`;
};
function nextLine(plan, ni) {
  if (ni < 0) return `${I("check")}<span><b>All meals logged.</b> Nice work today.</span>`;
  const it = plan.items[ni], r = RECIPES[it.id], oc = isCampus(cur, it.time);
  return `${I("arrow")}<span>Next up: <b>${esc(r.short)}</b> at ${t12(it.time)}${oc ? " · packed, eat on campus" : ""}${it.heat === "microwave" ? " · microwave" : it.heat === "cold" ? " · eat cold" : ""}</span>`;
}
// update the dashboard in place so bars, rings and numbers animate smoothly
function updateDash() {
  if (S.view !== "dash") return;
  const log = dayLog(iso(cur)), plan = planFor(cur), g = S.settings.goals, { t } = totalsFor(cur);
  METRICS.forEach(([key, , gk, unit], i) => {
    const v = t[i], goal = g[gk], pct = (v / goal) * 100;
    countTo($("#val-" + key), R0(v)); $("#bar-" + key).style.width = Math.min(pct, 100) + "%";
    $("#pct-" + key).textContent = R0(pct) + "%"; $("#kpi-" + key).classList.toggle("hit", v >= goal);
    $("#rem-" + key).textContent = v >= goal ? "Goal reached" : `${R0(goal - v).toLocaleString()} ${unit} remaining`;
    const rg = $("#rg-" + key), c = 2 * Math.PI * rg.r.baseVal.value; rg.style.strokeDashoffset = c * (1 - Math.min(v / goal, 1));
    $("#lg-" + key).innerHTML = `${R0(v).toLocaleString()}<em> / ${goal.toLocaleString()}</em>`;
  });
  countTo($("#rg-avg"), R0((Math.min(t[0] / g.kcal, 1) + Math.min(t[1] / g.protein, 1) + Math.min(t[2] / g.carbs, 1)) / 3 * 100));
  if (!plan) return;
  const ni = nextIndex(plan, log), nDone = plan.items.filter((_, i) => log.done[i]).length;
  $$(".meal").forEach((row) => { const i = +row.dataset.row; row.classList.toggle("done", !!log.done[i]); row.classList.toggle("next", i === ni); });
  $$(".dayline .d").forEach((d) => d.classList.toggle("done", !!log.done[+d.dataset.dot]));
  $("#mcount").textContent = `${nDone} of ${plan.items.length} eaten`; $("#mbar").style.width = (nDone / plan.items.length) * 100 + "%";
  $("#nextline").innerHTML = nextLine(plan, ni);
}

// ============================================================================
//  WEEK PLAN
// ============================================================================
V.plan = () => {
  const start = addDays(cur, -wd(cur)), wk = weekIndex(start), rot0 = rotationFor(Math.max(wk, 0));
  const prepWeek = !!PREP && Array.from({ length: 7 }, (_, i) => iso(addDays(start, i))).some((k) => OVERRIDES[k]);
  const rot = prepWeek ? { ...rot0, name: PREP.label } : rot0;
  const days = Array.from({ length: 7 }, (_, i) => { const d = addDays(start, i), p = planFor(d), camp = CAMPUS[i];
    const tot = p ? p.items.reduce((a, it) => recipeMacros(it.id, it.srv).map((v, j) => a[j] + v), [0, 0, 0]) : [0, 0, 0];
    return `<div class="day ${iso(d) === iso(today) ? "today" : ""}" data-act="goto" data-d="${iso(d)}" style="--i:${i}">
      <h4>${DOW[i]}<span class="muted" style="font-weight:500">${fmtShort(d)}</span></h4>
      <div style="margin:8px 0 6px">${camp ? `<span class="tag campus">${I("campus")}${hLabel(camp[0]).replace(":00", "")}–${hLabel(camp[1]).replace(":00", "")}</span>` : `<span class="tag home">${I("home")}Home</span>`}</div>
      ${p ? p.items.map((it) => `<div class="row"><span class="mono">${t12(it.time).replace(" ", "").toLowerCase()}</span><span>${esc(RECIPES[it.id].short)}${it.srv > 1 ? ` ×${it.srv}` : ""}${isCampus(d, it.time) ? ` <span style="color:var(--warn)">•</span>` : ""}</span></div>`).join("") : `<div class="dim small">—</div>`}
      <div class="tot">${R0(tot[0]).toLocaleString()} kcal · ${R0(tot[1])}P · ${R0(tot[2])}C</div></div>`; }).join("");
  return `
  <div class="top"><div><div class="eyebrow">${wk >= 0 ? `Week ${wk + 1} · ${rot.name}` : "Before plan start"}</div><h1>Week of ${fmt(start, { month: "long", day: "numeric" })}</h1></div><span class="sp"></span>
    <span class="small muted"><span style="color:var(--warn)">•</span> packed meal eaten on campus</span>
    <div class="seg"><button data-act="pweek" data-n="-7">${I("left")}</button><button data-act="today">This week</button><button data-act="pweek" data-n="7">${I("right")}</button></div></div>
  <div class="week st">${days}</div>
  <div class="grid g2" style="margin-top:16px">
    ${prepWeek ? `<div class="card st" style="--i:7"><div class="ch"><h3>${esc(PREP.label)}</h3><span class="sp"></span><span class="sub">what you have this week</span></div>
      ${PREP.inventory.map(([a, b]) => `<div class="list-item" style="grid-template-columns:1fr auto"><div style="font-weight:500">${esc(a)}</div><div class="small muted">${esc(b)}</div></div>`).join("")}
      <div class="callout" style="margin-bottom:0"><b>Food safety:</b> ${esc(PREP.freeze)}</div></div>`
    : `<div class="card st" style="--i:7"><div class="ch"><h3>Sunday prep</h3><span class="sp"></span><span class="sub">4 batches cover the week</span></div>
      ${["burritos", ...rot.mains].map((id) => { const r = RECIPES[id], m = recipeMacros(id);
        return `<div class="list-item"><div class="ic">${I(recipeIcon(id))}</div><div><div style="font-weight:600">${esc(r.name)}</div><div class="small muted">${r.method} · ${r.time} · ${r.servings} ${r.servingLabel}s · ${R0(m[0])} kcal each</div></div>
          <button class="btn sm" data-act="recipe" data-id="${id}">Recipe</button></div>`; }).join("")}</div>`}
    <div class="card st" style="--i:8"><div class="ch"><h3>Game plan</h3></div><ol class="steps">
      <li><b>Saturday:</b> shop Sam's → Walmart → H-E-B. The Groceries tab has the list in store order.</li>
      <li><b>Sunday morning:</b> start the crockpot recipe first. Rice and sheet-pan meals cook while it runs.</li>
      <li><b>Sunday afternoon:</b> make the 14 breakfast burritos and freeze them.</li>
      <li><b>Portion:</b> Mon–Wed containers go in the fridge. Freeze Thu–Sun and move each to the fridge the night before. Cooked food keeps about 4 days.</li>
      <li><b>Mon / Wed:</b> insulated lunch bag with an ice pack: burrito, 2 containers, PB sandwich.</li>
      <li><b>Fast food night?</b> Log it, leave that meal unchecked, and freeze the container for later.</li></ol></div>
  </div>`;
};

// ============================================================================
//  RECIPES
// ============================================================================
V.recipes = () => `
  <div class="top"><div><div class="eyebrow">${Object.keys(RECIPES).length} recipes · 6 from your TikToks · no vegetables</div><h1>Recipes</h1></div></div>
  <div class="rgrid st">${Object.entries(RECIPES).map(([id, r], i) => { const m = recipeMacros(id);
    return `<div class="card rc" data-act="recipe" data-id="${id}" style="--i:${i}">
      <div style="display:flex;align-items:center;gap:8px"><div class="ic">${I(recipeIcon(id))}</div><span class="sp"></span>${r.source?.url ? `<span class="tag src">TikTok ${esc(r.source.handle)}</span>` : r.source ? `<span class="tag src">${I("star")}${esc(r.source.handle)}</span>` : ""}</div>
      <h4>${esc(r.name)}</h4>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="tag">${r.method}</span><span class="tag">${r.time}</span><span class="tag">${r.servings} ${r.servingLabel}${r.servings > 1 ? "s" : ""}</span></div>
      <div class="macros"><div><b style="color:var(--kcal)">${R0(m[0])}</b><span>kcal</span></div><div><b style="color:var(--pro)">${R0(m[1])}g</b><span>protein</span></div><div><b style="color:var(--carb)">${R0(m[2])}g</b><span>carbs</span></div></div></div>`; }).join("")}</div>`;
function recipeModal(id) {
  const r = RECIPES[id], m = recipeMacros(id), b = recipeMacros(id, r.servings);
  openModal(`
    <div style="display:flex;align-items:flex-start;gap:14px"><div class="ic" style="width:48px;height:48px">${I(recipeIcon(id))}</div>
      <div style="flex:1"><div class="small muted">${r.method} · ${r.time} · makes ${r.servings} ${r.servingLabel}${r.servings > 1 ? "s" : ""}</div><h2 class="h" style="font-size:22px;font-weight:600;margin-top:2px">${esc(r.name)}</h2></div>
      <button class="go" data-close>${I("x")}</button></div>
    ${r.source ? `<div class="callout">${r.source.url ? `From <a href="${r.source.url}" target="_blank" rel="noopener">${esc(r.source.handle)} on TikTok ${I("ext")}</a>. ` : ""}${esc(r.source.note)}</div>` : ""}
    <div class="macros"><div><b style="color:var(--kcal)">${R0(m[0])}</b><span>kcal per ${r.servingLabel}</span></div><div><b style="color:var(--pro)">${R0(m[1])} g</b><span>protein</span></div><div><b style="color:var(--carb)">${R0(m[2])} g</b><span>carbs</span></div></div>
    <div class="small dim mono" style="margin-top:8px">Whole batch: ${R0(b[0]).toLocaleString()} kcal · ${R0(b[1])} g P · ${R0(b[2])} g C</div>
    <div class="ch" style="margin:22px 0 4px"><h3>Ingredients</h3><span class="sp"></span><span class="sub">full batch</span></div>
    ${r.ingredients.map(([p, g, txt]) => `<div class="ing"><div>${esc(txt)}<div class="s">${esc(PRODUCTS[p][0])} · ${STORES[PRODUCTS[p][1]].split(" —")[0]}</div></div><div class="mono dim">${R0(g)} g</div></div>`).join("")}
    <div class="small dim" style="margin-top:8px">Salt and pepper to taste.</div>
    <div class="ch" style="margin:22px 0 10px"><h3>Steps</h3></div>
    <ol class="steps">${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`);
}

// ============================================================================
//  FAST FOOD
// ============================================================================
V.fast = () => {
  const ws = addDays(cur, -wd(cur)); let spend = 0, count = 0;
  for (let i = 0; i < 7; i++) (S.logs[iso(addDays(ws, i))]?.extra || []).forEach((e) => { if (e.ff) { spend += +e.price || 0; count++; } });
  const card = (f, i) => { const tot = ffTotals(f), custom = !FASTFOOD.includes(f);
    return `<div class="card rc" style="--i:${i};cursor:default" data-ff="${f.id}">
      <div style="display:flex;align-items:center;gap:8px"><span class="tag">${esc(f.chain)}</span>
        ${f.fav ? `<span class="tag src">${I("star")}Favorite</span>` : ""}<span class="sp"></span>
        ${custom ? `<button class="go" data-act="ffdel" data-id="${f.id}" title="Delete">${I("x")}</button>` : `<span class="mono small muted">~${money(f.price)}</span>`}</div>
      <h4>${esc(f.name)}</h4>
      <div class="small muted" style="line-height:1.7">${f.parts.map((p) => `${esc(p[0])} <span class="dim mono">· ${p[1]} kcal</span>`).join("<br>")}</div>
      <div class="macros"><div><b style="color:var(--kcal)" class="ffk">${R0(tot[0]).toLocaleString()}</b><span>kcal</span></div><div><b style="color:var(--pro)" class="ffp">${R0(tot[1])}g</b><span>protein</span></div><div><b style="color:var(--carb)" class="ffc">${R0(tot[2])}g</b><span>carbs</span></div></div>
      <div style="display:flex;gap:8px;margin-top:14px;align-items:center;flex-wrap:wrap">
        ${(f.portions || [["Full", 1]]).length > 1 ? `<div class="seg">${f.portions.map(([l, m], j) => `<button data-act="ffpor" data-m="${m}" class="${j ? "" : "on"}">${esc(l)}</button>`).join("")}</div>` : ""}
        <span class="sp"></span><button class="btn pri" data-act="fflog" data-id="${f.id}">${I("plus")}Log ${iso(cur) === iso(today) ? "today" : fmtShort(cur)}</button></div></div>`; };
  const favs = allFF().filter((f) => f.fav), others = allFF().filter((f) => !f.fav);
  return `
  <div class="top"><div><div class="eyebrow">One tap adds it to your dashboard</div><h1>Fast food</h1></div><span class="sp"></span>
    <div class="card" style="padding:12px 16px;display:flex;gap:22px"><div><div class="xs muted">This week</div><div class="h" style="font-size:20px;font-weight:600">${money(spend)}</div></div><div><div class="xs muted">Meals out</div><div class="h" style="font-size:20px;font-weight:600">${count}</div></div></div></div>
  <div class="ch"><h3>Your favorites</h3></div>
  <div class="rgrid st">${favs.map(card).join("")}</div>
  <div class="ch" style="margin-top:26px"><h3>Common picks near campus</h3><span class="sp"></span><span class="sub">Order "meat & cheese only" to skip the veggies</span></div>
  <div class="rgrid st">${others.map((f, i) => card(f, i + favs.length)).join("")}</div>
  <div class="card st" style="margin-top:22px;--i:9"><div class="ch"><h3>Add your own order</h3><span class="sp"></span><span class="sub">Saved as a favorite</span></div>
    <div class="grid" style="grid-template-columns:1.2fr 1.6fr repeat(4,.7fr) auto;gap:8px;align-items:end">
      <input id="fc" placeholder="Restaurant" /><input id="fn" placeholder="What you order" /><input id="fk" type="number" placeholder="kcal" /><input id="fp" type="number" placeholder="Protein g" /><input id="fcarb" type="number" placeholder="Carbs g" /><input id="fpr" type="number" step="0.01" placeholder="Price $" />
      <button class="btn pri" data-act="ffadd">${I("plus")}Save</button></div>
    <div class="small dim" style="margin-top:12px">Macros are approximate, from each chain's published nutrition info; check the chain's app for exact numbers. Fast food isn't in the $100 grocery budget, so the tracker above keeps it visible. If you eat out instead of a planned meal, leave that meal unchecked and freeze the container.</div></div>`;
};

// ============================================================================
//  GROCERIES
// ============================================================================
V.grocery = () => {
  S.groceryWeek ??= Math.max(weekIndex(cur), 0); const gw = S.groceryWeek;
  const items = groceryFor(gw), got = (S.grocery["w" + gw] ||= {}), buy = items.filter((i) => i.packs > 0), stocked = items.filter((i) => !i.packs);
  const total = buy.reduce((a, i) => a + i.cost, 0), budget = S.settings.budget, pct = (total / budget) * 100, wkStart = addDays(parse(S.settings.planStart), gw * 7);
  const order = [["C", "Sam's Club", "Bulk meat & cheese"], ["W", "Walmart Supercenter · Harvey Mitchell", "Pantry, dairy, produce"], ["H", "H-E-B · Tejas Center", "Tortillas, chiles, specialty"]];
  let n = 0;
  return `
  <div class="top"><div><div class="eyebrow">${rotationFor(gw).name} · shop Sat ${fmtShort(addDays(wkStart, -2))} for the week of ${fmtShort(wkStart)}</div><h1>Week ${gw + 1} groceries</h1></div><span class="sp"></span>
    <button class="btn noprint" onclick="window.print()">${I("print")}Print</button>
    <div class="seg"><button data-act="gweek" data-n="-1">${I("left")}</button><button disabled style="cursor:default">Week ${gw + 1}</button><button data-act="gweek" data-n="1">${I("right")}</button></div></div>
  ${Object.keys(OVERRIDES).some((k) => { const n = daysBetween(wkStart, parse(k)); return n >= 0 && n < 7; }) ? `<div class="callout" style="margin:0 0 14px">This week you're eating ${esc(PREP?.label || "your own prep")} (see the Dashboard and Week plan), so you can skip this list. It shows the regular rotation for reference.</div>` : ""}
  <div class="card st"><div class="budget">
    <div><div class="small muted">Week total</div><div class="amt" style="color:${pct > 100 ? "var(--bad)" : "var(--text)"}">$<span data-count="${total.toFixed(2)}" data-dec="2">0</span></div></div>
    <div style="flex:1;min-width:220px"><div class="bar" style="height:10px"><i data-w="${Math.min(pct, 100)}" style="background:var(--text)"></i></div>
      <div class="small muted" style="margin-top:8px">${pct <= 100 ? `${money(budget - total)} under your $${budget} budget` : `${money(total - budget)} over budget`} · <span id="gcount">${buy.filter((i) => got[i.p]).length} of ${buy.length}</span> in the cart</div></div></div>
    <div class="small dim" style="margin-top:14px">Prices are estimates; check the store apps. Sections are typical for each store. Look up the exact aisle once in the Walmart or H-E-B app and type it into the Aisle box; it's remembered every week. Leftovers carry over, so later weeks list only what you're short.</div></div>
  ${order.map(([st, name, sub], si) => { const list = buy.filter((i) => i.st === st); if (!list.length) return "";
    return `<div class="card store st" style="--i:${si + 1}"><div class="ch"><span class="sw">${si + 1}</span><h3>${name}</h3><span class="sub">${sub}</span><span class="sp"></span><span class="mono">${money(list.reduce((a, i) => a + i.cost, 0))}</span></div>
      ${[...new Set(list.map((i) => i.sec))].map((sec) => `<div class="sec">${esc(sec)}</div>${list.filter((i) => i.sec === sec).map((i) => `
        <div class="gi ${got[i.p] ? "got" : ""}" data-gi="${i.p}"><button class="cb" data-act="got" data-p="${i.p}">${CB}</button>
          <div><div class="gn"><b>${i.packs}×</b> ${esc(i.name)}</div><div class="w">${esc(i.where)} · for ${esc(i.why.join(", "))}</div></div>
          <div class="aw"><input class="ais" data-p="${i.p}" placeholder="Aisle" value="${esc(S.aisles[i.p] || "")}" /></div><div class="pr">${money(i.cost)}</div></div>`).join("")}`).join("")}</div>`; }).join("")}
  ${stocked.length ? `<div class="card" style="margin-top:14px"><div class="ch"><h3>Already stocked</h3><span class="sub">left over from earlier weeks</span></div><div class="small muted">${stocked.map((i) => esc(i.name)).join(" · ")}</div></div>` : ""}`;
};

// ============================================================================
//  WEIGHT
// ============================================================================
V.weight = () => {
  const ws = [...S.weights].sort((a, b) => a.date.localeCompare(b.date)), start = parse(S.settings.planStart), w0 = ws[0]?.lb ?? PROFILE.weightLb, goal = PROFILE.goalLb;
  const cm = PROFILE.heightIn * 2.54, kcal = S.settings.goals.kcal, act = S.settings.activity;
  const tdee = (lb) => (10 * lb * 0.4536 + 6.25 * cm - 5 * PROFILE.age + 5) * act;
  const proj = [w0]; for (let i = 1; i <= 30; i++) proj.push(proj[i - 1] + ((kcal - tdee(proj[i - 1])) * 7) / 3500);
  const lo = Array.from({ length: 31 }, (_, i) => w0 + 0.5 * i), hi = Array.from({ length: 31 }, (_, i) => w0 + i), drift = Array.from({ length: 31 }, (_, i) => w0 + (1.5 / 52) * i);
  const weeksTo = (arr) => { const i = arr.findIndex((x) => x >= goal); return i < 0 ? null : i; };
  let rate = null;
  if (ws.length >= 2) { const xs = ws.map((w) => daysBetween(start, parse(w.date)) / 7), ys = ws.map((w) => w.lb), n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n, den = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    rate = den ? xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / den : null; }
  const latest = ws[ws.length - 1]?.lb ?? w0;
  const W = 780, H = 330, pl = 44, pr = 14, pt = 18, pb = 30, yMin = Math.floor(Math.min(w0, ...ws.map((w) => w.lb)) - 2), yMax = goal + 6;
  const X = (wk) => pl + (wk / 30) * (W - pl - pr), Y = (lb) => pt + (1 - (lb - yMin) / (yMax - yMin)) * (H - pt - pb);
  const line = (arr) => { let d = ""; for (let i = 0; i < arr.length; i++) { if (arr[i] <= yMax) { d += `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(arr[i]).toFixed(1)}`; continue; } const f = (yMax - arr[i - 1]) / (arr[i] - arr[i - 1]); d += `L${X(i - 1 + f).toFixed(1)},${Y(yMax).toFixed(1)}`; break; } return d; };
  const clip = (v) => Math.min(v, yMax);
  const band = `M${lo.map((v, i) => `${X(i)},${Y(clip(v))}`).join("L")}L${hi.map((_, i) => `${X(30 - i)},${Y(clip(hi[30 - i]))}`).join("L")}Z`;
  let grid = ""; for (let lb = Math.ceil(yMin / 5) * 5; lb <= yMax; lb += 5) grid += `<line x1="${pl}" x2="${W - pr}" y1="${Y(lb)}" y2="${Y(lb)}" stroke="#ededef"/><text x="${pl - 8}" y="${Y(lb) + 4}" fill="#a1a1aa" font-size="11" text-anchor="end" font-family="Inter">${lb}</text>`;
  for (let wk = 0; wk <= 30; wk += 5) grid += `<text x="${X(wk)}" y="${H - 8}" fill="#a1a1aa" font-size="11" text-anchor="middle" font-family="Inter">wk ${wk}</text>`;
  const pts = ws.map((w) => [daysBetween(start, parse(w.date)) / 7, w.lb]);
  const svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">${grid}
    <path class="band" d="${band}" fill="rgba(0,0,0,.035)" stroke="#d4d4d8" stroke-dasharray="3 4"/>
    <path class="draw dash" d="${line(drift)}" fill="none" stroke="#a1a1aa" stroke-width="1.6" stroke-dasharray="2 5"/>
    <path class="draw dash" d="${line(proj)}" fill="none" stroke="#71717a" stroke-width="2" stroke-dasharray="7 5"/>
    <line x1="${pl}" x2="${W - pr}" y1="${Y(goal)}" y2="${Y(goal)}" stroke="#0a0a0a" stroke-width="1" stroke-dasharray="2 3"/><text x="${W - pr}" y="${Y(goal) - 7}" fill="#0a0a0a" font-size="11" text-anchor="end" font-family="Inter" font-weight="600">Goal ${goal} lb</text>
    ${pts.length ? `<path class="draw" d="${pts.map(([x, y], i) => `${i ? "L" : "M"}${X(x)},${Y(y)}`).join("")}" fill="none" stroke="#0a0a0a" stroke-width="2.4"/>${pts.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="#ffffff" stroke="#0a0a0a" stroke-width="2"/>`).join("")}` : ""}</svg>`;
  const eta = (w) => w == null ? "30+ weeks" : `${w} wk · ${fmtShort(addDays(start, w * 7))}`;
  return `
  <div class="top"><div><div class="eyebrow">${PROFILE.age} · 6'4" · started at ${w0} lb</div><h1>Weight trend</h1></div><span class="sp"></span>
    <input id="wd" type="date" value="${iso(today)}" /><input id="wl" type="number" step="0.1" placeholder="Weight (lb)" style="width:130px" /><button class="btn pri" data-act="addw">${I("plus")}Log weight</button></div>
  <div class="grid g3 st">
    <div class="card stat" style="--i:0"><div class="lbl">Current</div><b><span data-count="${latest}" data-dec="1">0</span> lb</b></div>
    <div class="card stat" style="--i:1"><div class="lbl">To goal</div><b><span data-count="${Math.max(goal - latest, 0)}" data-dec="1">0</span> lb</b></div>
    <div class="card stat" style="--i:2"><div class="lbl">Your trend</div><b>${rate == null ? "Log 2+ weigh-ins" : `${rate >= 0 ? "+" : ""}${rate.toFixed(2)} lb/wk`}</b></div></div>
  <div class="card st" style="margin-top:16px;--i:3"><div class="ch"><h3>You vs. typical gain curves</h3></div>${svg}
    <div class="lg"><span><i style="border-color:#0a0a0a"></i>You</span><span><i style="border-color:#71717a;border-top-style:dashed"></i>Energy-balance math at ${kcal.toLocaleString()} kcal</span><span><i style="border-color:#d4d4d8;border-top-width:6px"></i>Recommended lean bulk, 0.5–1 lb/wk</span><span><i style="border-color:#a1a1aa;border-top-style:dotted"></i>Average 20-year-old male (~1.5 lb/yr)</span></div></div>
  <div class="grid g2" style="margin-top:16px">
    <div class="card st" style="--i:4"><div class="ch"><h3>How the curves compare</h3></div><table class="t">
      <tr><th>Pace</th><th>Rate</th><th>Reach ${goal} lb</th></tr>
      <tr><td>Your plan on paper</td><td class="mono">~${(((kcal - tdee(w0)) * 7) / 3500).toFixed(1)} lb/wk</td><td class="mono">${eta(weeksTo(proj))}</td></tr>
      <tr><td>Lean bulk, fast end</td><td class="mono">1.0 lb/wk</td><td class="mono">${eta(weeksTo(hi))}</td></tr>
      <tr><td>Lean bulk, slow end</td><td class="mono">0.5 lb/wk</td><td class="mono">${eta(weeksTo(lo))}</td></tr>
      <tr><td>Average 20-year-old male</td><td class="mono">~0.03 lb/wk</td><td class="mono">~13 years</td></tr>
      ${rate > 0 ? `<tr><td><b style="color:var(--text)">You, current trend</b></td><td class="mono">${rate.toFixed(2)} lb/wk</td><td class="mono">${eta(Math.ceil((goal - latest) / rate) + R0(daysBetween(start, parse(ws[ws.length - 1].date)) / 7))}</td></tr>` : ""}</table></div>
    <div class="card st" style="--i:5"><div class="ch"><h3>What this means</h3></div><div class="small" style="line-height:1.7;color:var(--text2)">
      Estimated maintenance is <b class="mono" style="color:var(--text)">${R0(tdee(w0)).toLocaleString()} kcal</b> (Mifflin-St Jeor × ${act}), so ${kcal.toLocaleString()} kcal is about <b class="mono" style="color:var(--text)">${R0(kcal - tdee(w0)).toLocaleString()} kcal</b> over.
      A lean bulk at your size is usually <b style="color:var(--text)">0.25–0.5% of body weight a week</b>, about 0.5–1 lb, to keep fat gain down. Real gain usually runs slower than the blue line because your body burns more as you eat more.<br><br>
      After 3–4 weigh-ins, if your trend is over 1.5 lb/wk, the surplus may be bigger than you need. Weigh in mornings, 2–3× a week.</div></div></div>
  <div class="card" style="margin-top:16px"><div class="ch"><h3>History</h3></div>
    ${ws.slice().reverse().map((w) => `<div class="x"><span class="mono" style="flex:1">${fmt(parse(w.date), { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span><b class="mono">${w.lb} lb</b><button class="go" data-act="delw" data-d="${w.date}">${I("x")}</button></div>`).join("")}</div>`;
};

// ============================================================================
//  SETTINGS
// ============================================================================
V.settings = () => { const s = S.settings, g = s.goals;
  return `
  <div class="top"><div><div class="eyebrow">Saved in this browser</div><h1>Settings</h1></div></div>
  <div class="grid g2 st">
    <div class="card" style="--i:0"><div class="ch"><h3>Goals & dates</h3></div>
      <div class="grid g2" style="gap:12px">
        <label class="f">Calories<input id="sk" type="number" value="${g.kcal}"></label><label class="f">Protein (g)<input id="sp" type="number" value="${g.protein}"></label>
        <label class="f">Carbs (g)<input id="sc" type="number" value="${g.carbs}"></label><label class="f">Weekly grocery budget ($)<input id="sb" type="number" value="${s.budget}"></label>
        <label class="f">Plan start (a Monday)<input id="ss" type="date" value="${s.planStart}"></label><label class="f">Creatine start<input id="scr" type="date" value="${s.creatineStart}"></label>
        <label class="f">Activity level<select id="sa">${[[1.375, "Light (1–3 workouts/wk)"], [1.55, "Moderate (3–5/wk)"], [1.725, "Very active (6–7/wk)"]].map(([v, l]) => `<option value="${v}" ${+s.activity === v ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>
      <button class="btn pri" style="margin-top:16px" data-act="saveset">Save settings</button></div>
    <div class="card" style="--i:1"><div class="ch"><h3>Campus hours</h3></div>
      ${CAMPUS.map((c, i) => `<div style="display:flex;align-items:center;gap:12px;padding:7px 0;border-bottom:1px solid var(--line)"><b style="width:40px">${DOW[i]}</b>${c ? `<span class="tag campus">${hLabel(c[0])} – ${hLabel(c[1])}</span>` : `<span class="tag home">No campus</span>`}</div>`).join("")}
      <div class="small dim" style="margin-top:10px">Edit <span class="mono">CAMPUS</span> in data.js to change these. Exams and events from Google Calendar go in <span class="mono">CAL_NOTES</span>.</div>
      <div class="ch" style="margin-top:20px"><h3>Data</h3></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="export">Export backup</button><label class="btn">Import<input id="imp" type="file" accept=".json" class="hide"></label><button class="btn" data-act="reset" style="color:var(--bad)">Reset all</button></div></div></div>`; };

// ============================================================================
//  render + events
// ============================================================================
function render(animate = false) {
  const v = $("#view");
  v.innerHTML = (V[S.view] || V.dash)();
  if (animate) { v.classList.remove("enter"); void v.offsetWidth; v.classList.add("enter"); }
  else $$(".st", v).forEach((el) => el.classList.remove("st"));
  syncNav(); hydrate(v);
}
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const a = el.dataset.act, k = iso(cur);
  switch (a) {
    case "prev": cur = addDays(cur, -1); return render(true);
    case "next": cur = addDays(cur, 1); return render(true);
    case "today": cur = midnight(today); return render(true);
    case "pweek": cur = addDays(cur, +el.dataset.n); return render(true);
    case "goto": cur = parse(el.dataset.d); S.view = "dash"; save(); return render(true);
    case "goview": S.view = el.dataset.v; save(); return render(true);
    case "eat": { const l = dayLog(k), i = el.dataset.i; l.done[i] = !l.done[i]; save(); updateDash();
      if (l.done[i]) toast(`${RECIPES[planFor(cur).items[i].id].short} logged`); return; }
    case "cre": { const l = dayLog(k), i = +el.dataset.i; l.creatine = l.creatine > i ? i : i + 1; save();
      $$("#cre button").forEach((b, j) => b.classList.toggle("on", l.creatine > j));
      const st = $$("#streak i"), tg = creatineTarget(cur); st[st.length - 1].className = l.creatine >= tg && tg ? "full" : l.creatine ? "part" : "";
      if (l.creatine >= tg) toast("Creatine done for today"); return; }
    case "recipe": e.stopPropagation(); return recipeModal(el.dataset.id);
    case "addx": { const n = $("#xn").value.trim(); if (!n) return toast("Add a food name first");
      dayLog(k).extra.push({ name: n, kcal: +$("#xk").value || 0, p: +$("#xp").value || 0, c: +$("#xc").value || 0 }); save();
      ["#xn", "#xk", "#xp", "#xc"].forEach((s) => ($(s).value = "")); $("#xlist").innerHTML = extrasHtml(dayLog(k)); updateDash(); return toast(`${n} added`); }
    case "quick": dayLog(k).extra.push({ name: el.dataset.n, kcal: +el.dataset.k, p: +el.dataset.p, c: +el.dataset.c }); save();
      $("#xlist").innerHTML = extrasHtml(dayLog(k)); updateDash(); return toast(`${el.dataset.n} added`);
    case "delx": dayLog(k).extra.splice(+el.dataset.i, 1); save(); $("#xlist").innerHTML = extrasHtml(dayLog(k)); return updateDash();
    case "ffpor": { const card = el.closest("[data-ff]"), f = allFF().find((x) => x.id === card.dataset.ff), tot = ffTotals(f, +el.dataset.m);
      $$("[data-act=ffpor]", card).forEach((b) => { const on = b === el; b.classList.toggle("on", on); });
      $(".ffk", card).textContent = R0(tot[0]).toLocaleString(); $(".ffp", card).textContent = R0(tot[1]) + "g"; $(".ffc", card).textContent = R0(tot[2]) + "g"; return; }
    case "fflog": { const card = el.closest("[data-ff]"), f = allFF().find((x) => x.id === el.dataset.id), on = $("[data-act=ffpor].on", card), m = on ? +on.dataset.m : 1, tot = ffTotals(f, m);
      const label = on && m !== 1 ? ` (${on.textContent})` : "";
      dayLog(k).extra.push({ name: `${f.chain}: ${f.name}${label}`, kcal: R0(tot[0]), p: R0(tot[1]), c: R0(tot[2]), price: +(f.price * m).toFixed(2), ff: true }); save();
      toast(`${f.chain} logged`); return render(); }
    case "ffadd": { const name = $("#fn").value.trim(), chain = $("#fc").value.trim(); if (!name || !chain) return toast("Add the restaurant and the order");
      S.customFF.push({ id: "c" + Date.now(), fav: true, chain, name, price: +$("#fpr").value || 0, parts: [[name, +$("#fk").value || 0, +$("#fp").value || 0, +$("#fcarb").value || 0]], portions: [["Full", 1]] });
      save(); toast("Saved to favorites"); return render(); }
    case "ffdel": S.customFF = S.customFF.filter((f) => f.id !== el.dataset.id); save(); return render();
    case "gweek": S.groceryWeek = Math.max(0, (S.groceryWeek || 0) + +el.dataset.n); save(); return render(true);
    case "got": { const g = (S.grocery["w" + S.groceryWeek] ||= {}); g[el.dataset.p] = !g[el.dataset.p]; save();
      el.closest(".gi").classList.toggle("got", g[el.dataset.p]);
      const buy = groceryFor(S.groceryWeek).filter((i) => i.packs > 0); $("#gcount").textContent = `${buy.filter((i) => g[i.p]).length} of ${buy.length}`; return; }
    case "addw": { const d = $("#wd").value, lb = parseFloat($("#wl").value); if (!d || !lb) return toast("Enter a date and weight");
      S.weights = S.weights.filter((w) => w.date !== d); S.weights.push({ date: d, lb }); save(); toast("Weight logged"); return render(); }
    case "delw": S.weights = S.weights.filter((w) => w.date !== el.dataset.d); save(); return render();
    case "saveset": Object.assign(S.settings, { planStart: $("#ss").value, creatineStart: $("#scr").value, activity: +$("#sa").value, budget: +$("#sb").value,
      goals: { kcal: +$("#sk").value, protein: +$("#sp").value, carbs: +$("#sc").value } }); save(); toast("Settings saved"); return render();
    case "export": { const u = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
      Object.assign(document.createElement("a"), { href: u, download: `fuel-backup-${iso(today)}.json` }).click(); return; }
    case "reset": if (!confirm("Erase all logs, weights and settings?")) return; localStorage.removeItem(KEY); location.reload(); return;
  }
});
document.addEventListener("change", (e) => {
  if (e.target.matches("input.ais")) { S.aisles[e.target.dataset.p] = e.target.value.trim(); save(); toast("Aisle saved"); }
  if (e.target.id === "imp") { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { S = JSON.parse(t); save(); render(true); toast("Backup restored"); } catch { toast("That file isn't a valid backup"); } }); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.closest(".xadd")) $("[data-act=addx]").click(); });
window.addEventListener("resize", syncNav);
render(true);
})();
