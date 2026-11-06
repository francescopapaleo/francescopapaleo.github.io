// Site behaviour: theme toggle, 1-bit patterns (signal band + placeholder tiles),
// homepage tag filters, gallery lightbox. Plain JS, no dependencies.
(() => {
  const root = document.documentElement;

  /* ---------- Theme toggle ----------
     The initial data-theme is set by the inline script in head.html (from localStorage)
     before first paint; without a stored choice the OS preference applies. */
  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => root.dataset.theme || (darkQuery.matches ? "dark" : "light");

  function syncToggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.querySelectorAll(".theme-toggle").forEach(b => {
      b.setAttribute("aria-label", `Switch to ${next} theme`);
      b.querySelector("span").textContent = next === "dark" ? "Dark" : "Light";
    });
  }

  document.querySelectorAll(".theme-toggle").forEach(b => b.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* private mode: choice lasts for this page only */ }
    syncToggle(); redraw();
  }));
  darkQuery.addEventListener("change", () => { syncToggle(); redraw(); });
  syncToggle();

  /* ---------- 1-bit patterns ---------- */
  const BAYER = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,
                 3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];

  function inks() {
    const cs = getComputedStyle(root);
    const rgb = v => { v = v.trim().replace("#", ""); return [0, 2, 4].map(i => parseInt(v.substr(i, 2), 16)); };
    return { fg: rgb(cs.getPropertyValue("--ink")), bg: rgb(cs.getPropertyValue("--paper")) };
  }
  function hash(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  function rng(seed) { return () => (seed = Math.imul(seed ^ (seed >>> 15), 2246822507) + 0x6D2B79F5 >>> 0) / 4294967296; }

  // f(x, y) returns luminance 0..1 (0 = ink); thresholded against an 8x8 Bayer matrix.
  function paint(cv, w, h, f) {
    cv.width = w; cv.height = h;
    const ctx = cv.getContext("2d"), im = ctx.createImageData(w, h), { fg, bg } = inks();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const c = f(x, y) < (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64 ? fg : bg, i = (y * w + x) * 4;
      im.data[i] = c[0]; im.data[i + 1] = c[1]; im.data[i + 2] = c[2]; im.data[i + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }

  // Placeholder tiles: kind comes from the project's tags (see partials/pattern.html).
  function pattern(cv) {
    const r = rng(hash(cv.dataset.seed || "x")), kind = cv.dataset.pattern;
    const ratio = cv.clientWidth && cv.clientHeight ? cv.clientWidth / cv.clientHeight : 1;
    const H = 240, W = Math.round(H * ratio);
    if (kind === "wave") {            // horizontal lines bent by a decaying waveform
      const f = 0.35 + r() * 0.15, a = 10 + r() * 14, g = 0.04 + r() * 0.05, c = H * (0.3 + r() * 0.4);
      paint(cv, W, H, (x, y) => 0.5 + 0.5 * Math.sin(y * f + a * Math.sin(x * g) * Math.exp(-Math.abs(y - c) / 60)));
    } else if (kind === "dots") {     // halftone field, dot size falling off from a hotspot
      const cx = W * (0.25 + r() * 0.5), cy = H * (0.2 + r() * 0.5), p = 9 + Math.floor(r() * 4);
      paint(cv, W, H, (x, y) => {
        const d = Math.hypot(x - cx, y - cy) / H, rad = p * 0.5 * Math.max(0.08, 1 - d * 1.3);
        return Math.hypot((x % p) - p / 2, (y % p) - p / 2) < rad ? 0 : 1;
      });
    } else {                          // two point sources interfering, like two loudspeakers
      const ax = W * (0.2 + r() * 0.3), ay = H * (0.2 + r() * 0.5), bx = W * (0.55 + r() * 0.3), by = H * (0.3 + r() * 0.5), k = 0.16 + r() * 0.12;
      paint(cv, W, H, (x, y) => 0.5 + 0.25 * (Math.sin(Math.hypot(x - ax, y - ay) * k) + Math.sin(Math.hypot(x - bx, y - by) * k)));
    }
  }

  // Signal band under the header: a waveform overview of an imaginary recording, new on every
  // page load. Loudness = slow phrases + faster texture + percussive hits (sharp attack,
  // exponential decay), with per-bar jitter. Shapes are defined over 0..1 so a resize or a
  // theme switch redraws the same signal.
  const bandSeed = (Math.random() * 4294967296) >>> 0;

  // Smooth random curve over 0..1 with n control points (cosine-interpolated value noise).
  function noise(r, n) {
    const pts = Array.from({ length: n + 1 }, r);
    return t => {
      const p = t * n, i = Math.min(n - 1, Math.floor(p)), f = (1 - Math.cos((p - i) * Math.PI)) / 2;
      return pts[i] * (1 - f) + pts[i + 1] * f;
    };
  }

  function band(cv) {
    const W = Math.max(200, Math.floor(cv.clientWidth / 2)), H = Math.max(8, Math.floor(cv.clientHeight / 2));
    const r = rng(bandSeed);
    const phrase = noise(r, 5 + Math.floor(r() * 5)), texture = noise(r, 60 + Math.floor(r() * 60));
    const hits = Array.from({ length: 6 + Math.floor(r() * 10) }, () => ({ at: r(), gain: 0.4 + r() * 0.6, decay: 0.004 + r() * 0.03 }));
    const amp = new Float32Array(W);
    for (let x = 0; x < W; x += 2) {
      const t = x / W;
      let a = Math.pow(phrase(t), 1.6) * 0.65 + texture(t) * 0.35;
      for (const h of hits) if (t >= h.at) a = Math.max(a, h.gain * Math.exp(-(t - h.at) / h.decay));
      const jitter = 0.55 + 0.45 * ((hash(bandSeed + ":" + Math.round(t * 2000)) % 1000) / 1000);
      amp[x] = Math.min(1, Math.max(0.04, a * jitter));
    }
    paint(cv, W, H, (x, y) => x % 2 === 0 && Math.abs(y - H / 2 + 0.5) < amp[x] * H / 2 ? 0 : 1);
  }

  function redraw() {
    document.querySelectorAll("canvas[data-pattern]").forEach(pattern);
    document.querySelectorAll("canvas.band").forEach(band);
  }
  redraw();
  let resizeTimer;
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(redraw, 200); });

  /* ---------- Homepage filters ----------
     OR within a group (discipline, place, topic), AND across groups, plus a text search.
     State lives in the query string (?tag=music,paris&q=reverb) so filtered views are shareable. */
  const wall = document.querySelector(".wall[data-filterable]");
  if (wall) {
    const cards = [...wall.querySelectorAll(".card")];
    const links = [...document.querySelectorAll(".filters a[data-group]")];
    const groupOf = {};
    links.forEach(a => { if (a.dataset.key) groupOf[a.dataset.key] = a.dataset.group; });
    const sel = new Set();
    const search = document.getElementById("q");
    const count = document.getElementById("count");
    const empty = document.getElementById("empty");
    const topics = document.getElementById("topics");
    const more = document.getElementById("more");

    function apply(push) {
      const q = (search?.value || "").trim().toLowerCase();
      const groups = {};
      sel.forEach(k => (groups[groupOf[k]] ||= []).push(k));
      let n = 0;
      cards.forEach(c => {
        const tags = c.dataset.tags.split(" ");
        const ok = Object.values(groups).every(keys => keys.some(k => tags.includes(k))) &&
                   (!q || c.dataset.text.includes(q));
        c.classList.toggle("is-off", !ok);
        c.tabIndex = ok ? 0 : -1;
        if (ok) n++;
      });
      links.forEach(a => a.setAttribute("aria-pressed",
        a.dataset.key ? sel.has(a.dataset.key) : !Object.keys(groups).includes(a.dataset.group)));
      count.textContent = `${n} of ${cards.length}`;
      empty.hidden = n > 0;
      if (push) {
        const p = new URLSearchParams();
        if (sel.size) p.set("tag", [...sel].join(","));
        if (q) p.set("q", q);
        const s = p.toString();
        history.replaceState(null, "", location.pathname + (s ? "?" + s : "") + location.hash);
      }
    }

    links.forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      const k = a.dataset.key;
      if (!k) [...sel].forEach(s => groupOf[s] === a.dataset.group && sel.delete(s));
      else sel.has(k) ? sel.delete(k) : sel.add(k);
      apply(true);
    }));
    search?.addEventListener("input", () => apply(true));

    if (topics && more) {
      topics.hidden = true;
      more.hidden = false;
      more.addEventListener("click", () => {
        topics.hidden = !topics.hidden;
        more.setAttribute("aria-expanded", String(!topics.hidden));
        more.textContent = topics.hidden ? "More tags" : "Fewer tags";
      });
    }

    const params = new URLSearchParams(location.search);
    (params.get("tag") || "").split(",").filter(k => groupOf[k]).forEach(k => sel.add(k));
    if (search && params.get("q")) search.value = params.get("q");
    if ([...sel].some(k => groupOf[k] === "topic") && topics) more.click();
    apply(false);
  }

  /* ---------- Gallery lightbox ---------- */
  const box = document.getElementById("lightbox");
  if (box && box.showModal) {
    const img = box.querySelector("img"), cap = box.querySelector("p");
    document.querySelectorAll("[data-lightbox]").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      img.src = a.href; img.alt = a.dataset.alt || "";
      cap.textContent = a.dataset.caption || ""; cap.hidden = !a.dataset.caption;
      box.showModal();
    }));
    box.addEventListener("click", e => { if (e.target === box || e.target === img) box.close(); });
  }
})();
