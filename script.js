document.documentElement.classList.add("js");
/* ---------- things the team can edit ---------- */
const VIDEO_SRC  = "";   // file published next to this page, for example "video.mp4"
const VIDEO_LINK = "";   // or a YouTube link, for example "https://youtu.be/..."
const TEAM_NAMES = ["Nguyễn Tăng Thiện Vũ", "Lý Duy Tiến", "Quách Phùng Xuân Tiến", "Nguyễn Nhựt Trường", "Võ Cường Đại Vĩ", "Trần Văn Tứ", "Võ Trần Quốc Thịnh", "Ngô Quang Tiến"];   // one name per role, in the order shown on the page

/* ---------- helpers ---------- */
const NS = "http://www.w3.org/2000/svg";
const svgEl = (name, attrs = {}, parent) => {
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
};
const starPts = (cx, cy, ro, ri, n) => {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI / n) * i - Math.PI / 2;
    const r = i % 2 ? ri : ro;
    pts.push((cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2));
  }
  return pts.join(" ");
};
document.querySelectorAll("[data-star]").forEach(p => {
  const [cx, cy, ro, ri, n] = p.dataset.star.split(",").map(Number);
  p.setAttribute("points", starPts(cx, cy, ro, ri, n));
});

/* ---------- bronze drum emblem ---------- */
function drawDrum(svg, opacity) {
  const bronze = "#d9a441";
  const g = svgEl("g", { opacity }, svg);
  const core = svgEl("g", { class: "spin fast" }, g);
  svgEl("polygon", { points: starPts(0, 0, 78, 34, 8), fill: bronze, "fill-opacity": ".9" }, core);
  svgEl("circle", { r: 17, fill: "#120b08", stroke: bronze, "stroke-width": 2 }, core);
  svgEl("circle", { r: 90, fill: "none", stroke: bronze, "stroke-width": 1.5, "stroke-opacity": ".8" }, g);
  const mid = svgEl("g", { class: "spin rev" }, g);
  svgEl("circle", { r: 104, fill: "none", stroke: bronze, "stroke-width": 8, "stroke-dasharray": "2 9", "stroke-opacity": ".7" }, mid);
  for (let i = 0; i < 24; i++) {
    const a = (360 / 24) * i;
    svgEl("polygon", { points: "-5,-132 5,-132 0,-118", fill: bronze, "fill-opacity": ".6", transform: "rotate(" + a + ")" }, mid);
  }
  svgEl("circle", { r: 140, fill: "none", stroke: bronze, "stroke-width": 1.5, "stroke-opacity": ".6" }, g);
  const outer = svgEl("g", { class: "spin" }, g);
  for (let i = 0; i < 64; i++) {
    const a = (360 / 64) * i, long = i % 4 === 0;
    svgEl("line", { x1: 0, y1: -152, x2: 0, y2: long ? -176 : -164, stroke: bronze, "stroke-width": long ? 2.5 : 1.5, "stroke-opacity": long ? ".8" : ".5", transform: "rotate(" + a + ")" }, outer);
  }
  svgEl("circle", { r: 184, fill: "none", stroke: bronze, "stroke-width": 1.5, "stroke-opacity": ".6" }, g);
}
drawDrum(document.getElementById("drum"), 1);
drawDrum(document.getElementById("drumSmall"), 1);

/* ---------- eight powers ---------- */
const POWERS = [
  ["Super Focus", "He studies for 45 minutes without checking his phone."],
  ["Note Blades", "He takes clear notes in every class."],
  ["Homework Shield", "He finishes his homework before dinner."],
  ["Word Vision", "He learns five new English words every morning."],
  ["Memory Drum", "He revises with flashcards and a steady rhythm."],
  ["Team Bond", "He studies in groups and helps his classmates."],
  ["Balance Scale", "He switches between study time and free time."],
  ["Never-Quit Spirit", "He tries again after every mistake."]
];
(function () {
  const grid = document.getElementById("powerGrid");
  const wedge = (i, r) => {
    const a0 = (Math.PI / 4) * i - Math.PI / 2 - Math.PI / 8, a1 = a0 + Math.PI / 4;
    const p = (a, rr) => (rr * Math.cos(a)).toFixed(2) + " " + (rr * Math.sin(a)).toFixed(2);
    return "M0 0L" + p(a0, r) + "A" + r + " " + r + " 0 0 1 " + p(a1, r) + "Z";
  };
  POWERS.forEach((p, i) => {
    const d = document.createElement("article");
    d.className = "power";
    let wheel = '<svg viewBox="-26 -26 52 52" aria-hidden="true"><circle r="24" fill="none" stroke="#d9a441" stroke-opacity=".5"/>';
    for (let k = 0; k < 8; k++) {
      wheel += '<path d="' + wedge(k, 22) + '" fill="' + (k === i ? "#d8402a" : "none") + '" stroke="#d9a441" stroke-opacity=".6" stroke-width="1"/>';
    }
    wheel += "</svg>";
    d.innerHTML = wheel + "<h3>" + p[0] + "</h3><p>" + p[1] + "</p>";
    grid.appendChild(d);
  });
})();

/* ---------- a day on a 24 hour clock ---------- */
(function () {
  const SEG = [
    { t: "study", s: 5.75, e: 6,    time: "05:45", txt: "Wakes up and reviews flashcards for 15 minutes." },
    { t: "other", s: 6,    e: 6.5,  time: "06:00", txt: "Has breakfast and gets ready." },
    { t: "other", s: 6.5,  e: 7,    time: "06:30", txt: "Rides his bike to school." },
    { t: "study", s: 7,    e: 12,   time: "07:00", txt: "Goes to class and takes notes." },
    { t: "other", s: 12,   e: 14,   time: "12:00", txt: "Has lunch and rests." },
    { t: "study", s: 14,   e: 15.5, time: "14:00", txt: "Does his homework." },
    { t: "free",  s: 15.5, e: 18,   time: "15:30", txt: "Plays basketball with his friends." },
    { t: "other", s: 18,   e: 19.5, time: "18:00", txt: "Has dinner and helps with the chores." },
    { t: "study", s: 19.5, e: 21,   time: "19:30", txt: "Revises the lesson and reads English for 90 minutes." },
    { t: "free",  s: 21,   e: 22,   time: "21:00", txt: "Listens to music and reads comics." },
    { t: "sleep", s: 22,   e: 29.75, time: "22:00", txt: "Goes to sleep." }
  ];
  const svg = document.querySelector("#clock svg"), clock = document.getElementById("clock");
  const R = 104;
  const pt = (h, r) => { const a = (h / 24) * 2 * Math.PI - Math.PI / 2; return [r * Math.cos(a), r * Math.sin(a)]; };
  const arc = (h0, h1) => {
    const [x0, y0] = pt(h0, R), [x1, y1] = pt(h1, R);
    return "M" + x0.toFixed(2) + " " + y0.toFixed(2) + "A" + R + " " + R + " 0 " + ((h1 - h0) > 12 ? 1 : 0) + " 1 " + x1.toFixed(2) + " " + y1.toFixed(2);
  };
  svgEl("circle", { r: R + 26, fill: "none", stroke: "rgba(217,164,65,.25)" }, svg);
  svgEl("circle", { r: R - 26, fill: "none", stroke: "rgba(217,164,65,.25)" }, svg);
  const arcs = [];
  SEG.forEach((s, i) => {
    const g = svgEl("g", { class: "t-" + s.t }, svg), els = [];
    const parts = s.e > 24 ? [[s.s, 24], [0, s.e - 24]] : [[s.s, s.e]];
    parts.forEach(([a, b]) => { const pth = svgEl("path", { class: "arc", d: arc(a + 0.04, b - 0.04), pathLength: 1 }, g); pth.style.setProperty("--ad", (i * 0.12).toFixed(2) + "s"); els.push(pth); });
    arcs.push(els);
  });
  [0, 6, 12, 18].forEach(h => {
    const [x, y] = pt(h, R + 44);
    const t = svgEl("text", { x: x.toFixed(1), y: (y + 5).toFixed(1), "text-anchor": "middle", "font-family": "IBM Plex Mono,monospace", "font-size": 13, fill: "#bcab8f" }, svg);
    t.textContent = String(h).padStart(2, "0");
  });
  const big = svgEl("text", { x: 0, y: 6, "text-anchor": "middle", "font-family": "Anton,Impact,sans-serif", "font-size": 54, fill: "#f2e8d5" }, svg); big.textContent = "24";
  const sm = svgEl("text", { x: 0, y: 30, "text-anchor": "middle", "font-family": "IBM Plex Mono,monospace", "font-size": 11, "letter-spacing": 2, fill: "#bcab8f" }, svg); sm.textContent = "HOURS";

  const tl = document.getElementById("timeline");
  SEG.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "t-" + s.t;
    li.tabIndex = 0;
    li.innerHTML = "<time>" + s.time + "</time><i></i><span>" + s.txt + "</span>";
    const on = () => { clock.classList.add("has-hi"); arcs[i].forEach(a => a.classList.add("hi")); li.classList.add("on"); };
    const off = () => { clock.classList.remove("has-hi"); arcs[i].forEach(a => a.classList.remove("hi")); li.classList.remove("on"); };
    li.addEventListener("mouseenter", on); li.addEventListener("mouseleave", off);
    li.addEventListener("focus", on); li.addEventListener("blur", off);
    tl.appendChild(li);
  });

  const tot = { study: 0, free: 0, other: 0, sleep: 0 };
  SEG.forEach(s => tot[s.t] += s.e - s.s);
  const fmt = h => { const m = Math.round(h * 60); return Math.floor(m / 60) + "h" + (m % 60 ? " " + String(m % 60).padStart(2, "0") + "m" : ""); };
  const names = { study: "Study", free: "Free time", other: "Meals and travel", sleep: "Sleep" };
  const lg = document.getElementById("legend");
  ["study", "free", "other", "sleep"].forEach(k => {
    const d = document.createElement("div");
    d.className = "t-" + k;
    d.innerHTML = "<i></i><span>" + names[k] + "</span><b data-h=\"" + tot[k] + "\">" + fmt(tot[k]) + "</b>";
    lg.appendChild(d);
  });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window && clock.getBoundingClientRect().top > innerHeight * 0.9) {
    clock.classList.add("pre");
    const nums = Array.from(lg.querySelectorAll("b"));
    nums.forEach(b => (b.textContent = fmt(0)));
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect(); clock.classList.remove("pre");
      const t0 = performance.now();
      (function run(t) {
        const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
        nums.forEach(b => (b.textContent = fmt(+b.dataset.h * e)));
        if (p < 1) requestAnimationFrame(run);
      })(t0);
    }, { threshold: 0.35 });
    io.observe(clock);
  }
})();

/* ---------- comic rail (drag, inertia, wheel, keys, autoplay) ---------- */
(function () {
  const root = document.getElementById("comic"), vp = document.getElementById("rail"), track = document.getElementById("track");
  const cards = Array.from(track.children), prevB = document.getElementById("prev"), nextB = document.getElementById("next");
  const playB = document.getElementById("play"), bar = document.getElementById("meterBar");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let x = 0, tx = 0, max = 0, raf = 0, drag = null, auto = null, cur = 0;

  const centerOf = i => clamp(cards[i].offsetLeft + cards[i].offsetWidth / 2 - vp.clientWidth / 2, 0, max);
  const nearest = t => {
    let best = 0, d = Infinity;
    cards.forEach((c, i) => { const dd = Math.abs(centerOf(i) - t); if (dd < d) { d = dd; best = i; } });
    return best;
  };
  function render() {
    const sk = reduce ? 0 : clamp((x - tx) * 0.012, -5, 5);
    track.style.transform = "translate3d(" + (-x).toFixed(2) + "px,0,0) skewX(" + sk.toFixed(2) + "deg)";
    bar.style.width = (max ? (x / max) * 100 : 100) + "%";
    prevB.disabled = tx <= 1;
    nextB.disabled = tx >= max - 1;
  }
  function tick() {
    raf = 0;
    const d = tx - x;
    if (reduce || Math.abs(d) < 0.3) { x = tx; render(); return; }
    x += d * 0.12; render(); raf = requestAnimationFrame(tick);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  function measure() {
    max = Math.max(0, track.scrollWidth - vp.clientWidth);
    tx = clamp(tx, 0, max); x = clamp(x, 0, max); render();
  }
  function goTo(i) { cur = clamp(i, 0, cards.length - 1); tx = centerOf(cur); kick(); }

  function stopAuto(done) {
    clearInterval(auto); auto = null;
    root.classList.remove("playing");
    cards.forEach(c => c.classList.remove("is-now"));
    playB.querySelector("span").textContent = done ? "Replay" : "Play comic";
  }
  function playStep(i) { cards.forEach((c, k) => c.classList.toggle("is-now", k === i)); goTo(i); typeBubble(cards[i]); }
  function play() {
    let i = 0;
    root.classList.add("playing");
    playB.querySelector("span").textContent = "Stop";
    playStep(0);
    auto = setInterval(() => { i++; if (i >= cards.length) { stopAuto(true); return; } playStep(i); }, 3600);
  }
  playB.addEventListener("click", () => { auto ? stopAuto(false) : play(); });

  prevB.addEventListener("click", () => {
    stopAuto(false);
    for (let i = cards.length - 1; i >= 0; i--) if (centerOf(i) < tx - 4) { goTo(i); return; }
    tx = 0; kick();
  });
  nextB.addEventListener("click", () => {
    stopAuto(false);
    for (let i = 0; i < cards.length; i++) if (centerOf(i) > tx + 4) { goTo(i); return; }
    tx = max; kick();
  });

  vp.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = { sx: e.clientX, st: tx, lx: e.clientX, lt: performance.now(), v: 0 };
    vp.setPointerCapture(e.pointerId); vp.classList.add("dragging"); stopAuto(false);
  });
  vp.addEventListener("pointermove", e => {
    if (!drag) return;
    let t = drag.st - (e.clientX - drag.sx);
    if (t < 0) t *= 0.35;
    if (t > max) t = max + (t - max) * 0.35;
    tx = t;
    const now = performance.now(), dt = now - drag.lt;
    if (dt > 0) drag.v = 0.8 * drag.v + 0.2 * ((drag.lx - e.clientX) / dt);
    drag.lx = e.clientX; drag.lt = now; kick();
  });
  const release = () => {
    if (!drag) return;
    const proj = clamp(tx + drag.v * 240, 0, max);
    cur = nearest(proj); tx = centerOf(cur);
    if (proj <= 0) tx = 0; if (proj >= max) tx = max;
    drag = null; vp.classList.remove("dragging"); kick();
  };
  vp.addEventListener("pointerup", release);
  vp.addEventListener("pointercancel", release);
  vp.addEventListener("wheel", e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault(); stopAuto(false);
      tx = clamp(tx + e.deltaX, 0, max); kick();
    }
  }, { passive: false });
  vp.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); nextB.click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prevB.click(); }
  });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(vp);
  measure();
})();

/* ---------- vocabulary ---------- */
const WORDS = [
  ["study", "verb", "học", "He studies for 45 minutes."],
  ["homework", "noun", "bài tập về nhà", "He finishes his homework before dinner."],
  ["take notes", "phrase", "ghi chép", "He takes notes in every class."],
  ["revise", "verb", "ôn tập", "He revises with flashcards."],
  ["routine", "noun", "thói quen hằng ngày", "His morning routine starts at 5:45."],
  ["free time", "noun", "thời gian rảnh", "He plays basketball in his free time."],
  ["hobby", "noun", "sở thích", "Reading comics is his hobby."],
  ["hang out", "phrasal verb", "đi chơi, tụ tập", "He hangs out with friends after class."],
  ["balance", "verb", "cân bằng", "He balances study and free time."],
  ["practise", "verb", "luyện tập", "He practises English every night."],
  ["creative", "adjective", "sáng tạo", "He is creative and curious."],
  ["succeed", "verb", "thành công", "His hobbies help him succeed."]
];
(function () {
  const box = document.getElementById("vocab");
  const head = document.createElement("div");
  head.className = "vrow vh";
  head.innerHTML = "<span>Word</span><span>Tiếng Việt</span><span>In the story</span>";
  box.appendChild(head);
  const canSpeak = "speechSynthesis" in window;
  WORDS.forEach(w => {
    const r = document.createElement("div");
    r.className = "vrow";
    r.innerHTML = '<div class="word"><strong>' + w[0] + "</strong><em>" + w[1] + "</em>" +
      (canSpeak ? '<button class="say" type="button" aria-label="Hear ' + w[0] + '"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6v4h3l4 3V3L5 6z"/><path d="M11.5 5.5a3.5 3.5 0 010 5"/></svg></button>' : "") +
      '</div><div class="vi">' + w[2] + '</div><div class="ex">' + w[3] + "</div>";
    if (canSpeak) r.querySelector(".say").addEventListener("click", () => {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(w[0]); u.lang = "en-US"; u.rate = .9; speechSynthesis.speak(u);
      } catch (e) {}
    });
    box.appendChild(r);
  });
})();

/* ---------- team ---------- */
(function () {
  const ROLES = [
    ["Team Leader", "Plans the work, checks every part and puts the final project together."],
    ["Scriptwriter", "Writes the story and the English speech bubbles."],
    ["Scriptwriter", "Writes the story and the English speech bubbles."],
    ["Character Designer", "Chooses the hero's look, powers, habits and hobbies."],
    ["Illustrator", "Draws the first three panels."],
    ["Illustrator", "Draws the last three panels."],
    ["Content and Vocabulary", "Writes the project text and the Unit 2 word list."],
    ["Video and Web Editor", "Edits the video and builds this website."]
  ];
  const grid = document.getElementById("teamGrid");
  ROLES.forEach((r, i) => {
    const n = (TEAM_NAMES[i] || "").trim();
    const d = document.createElement("article");
    d.className = "member";
    d.innerHTML = "<h3>" + r[0] + "</h3><p>" + r[1] + '</p><div class="nm' + (n ? "" : " empty") + '">' + (n || "Name") + "</div>";
    grid.appendChild(d);
  });
})();

/* ---------- video ---------- */
(function () {
  const vid = document.getElementById("vid"), empty = document.getElementById("vEmpty");
  const pick = document.getElementById("vPick"), file = document.getElementById("vFile"), link = document.getElementById("vLink");
  const show = src => { vid.src = src; vid.hidden = false; empty.hidden = true; };
  if (VIDEO_SRC) show(VIDEO_SRC);
  if (VIDEO_LINK) { link.href = VIDEO_LINK; link.hidden = false; }
  pick.addEventListener("click", () => file.click());
  file.addEventListener("change", () => { const f = file.files && file.files[0]; if (f) show(URL.createObjectURL(f)); });
  vid.addEventListener("play", () => Music.duck(true));
  vid.addEventListener("pause", () => Music.duck(false));
  vid.addEventListener("ended", () => Music.duck(false));
})();

/* ---------- background music: a small pentatonic piece made with Web Audio ---------- */
const Music = (function () {
  let ctx = null, master = null, bus = null, timer = null, on = false, ducked = false, idx = 3, n = 0, analyser = null, fdata = null;
  const SCALE = [0, 2, 5, 7, 9];   // C D F G A, the "Bac" pentatonic mode
  const hz = d => 261.63 * Math.pow(2, (SCALE[d % 5] + 12 * Math.floor(d / 5)) / 12);
  const level = () => (ducked ? 0.1 : 0.5);

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp); comp.connect(ctx.destination);
    analyser = ctx.createAnalyser(); analyser.fftSize = 64; fdata = new Uint8Array(analyser.frequencyBinCount); master.connect(analyser);
    bus = ctx.createGain(); bus.connect(master);
    const delay = ctx.createDelay(1.5); delay.delayTime.value = 0.42;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
    bus.connect(delay); delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(master);
    [[65.41, 0.07], [98, 0.05]].forEach(([f, g]) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const gn = ctx.createGain(); gn.gain.value = g; o.connect(gn); gn.connect(master); o.start();
    });
  }
  function pluck(f, v) {
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = f * 2.005;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0008, t + 1.8);
    const g2 = ctx.createGain(); g2.gain.value = 0.25;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(bus);
    o.start(t); o2.start(t); o.stop(t + 2); o2.stop(t + 2);
  }
  function gong() {
    const t = ctx.currentTime;
    [1, 2.76, 5.4].forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = 98 * m;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16 / (i + 1), t + 0.02); g.gain.exponentialRampToValueAtTime(0.0005, t + 5);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + 5.2);
    });
  }
  function step() {
    if (!ctx || ctx.state !== "running") return;
    if (n % 16 === 0) gong();
    if (Math.random() < 0.66) {
      const moves = [-2, -1, -1, 0, 1, 1, 2];
      idx = Math.max(0, Math.min(9, idx + moves[Math.floor(Math.random() * moves.length)]));
      pluck(hz(idx), 0.16 + Math.random() * 0.06);
    }
    n++;
  }
  function sync() {
    document.querySelectorAll("#soundNav,#soundHero").forEach(b => b.setAttribute("aria-pressed", on ? "true" : "false"));
    document.querySelector("#soundNav .lbl").textContent = on ? "Music on" : "Music off";
    document.getElementById("soundHero").textContent = on ? "Pause music" : "Play music";
  }
  function start() {
    try {
      if (!ctx) build();
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(level(), ctx.currentTime, 0.6);
      clearInterval(timer); timer = setInterval(step, 520);
      on = true; step();
    } catch (e) { on = false; }
    sync();
  }
  function stop() {
    on = false; clearInterval(timer);
    if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      setTimeout(() => { if (!on && ctx) ctx.suspend(); }, 900);
    }
    sync();
  }
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !on) return;
    document.hidden ? ctx.suspend() : ctx.resume();
  });
  document.querySelectorAll("#soundNav,#soundHero").forEach(b => b.addEventListener("click", () => (on ? stop() : start())));
  return {
    level() {
      if (!on || !analyser) return 0;
      analyser.getByteFrequencyData(fdata);
      let s = 0; for (let i = 0; i < 8; i++) s += fdata[i];
      return Math.min(1, (s / 8 / 255) * 3);
    },
    duck(v) { ducked = v; if (on && ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(level(), ctx.currentTime, 0.4); } }
  };
})();

/* ---------- motion layer ---------- */
function typeBubble(p) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const b = p.querySelector(".bubble");
  if (!b) return;
  if (!b.dataset.full) b.dataset.full = b.textContent;
  const full = b.dataset.full;
  if (!b.style.minHeight) b.style.minHeight = b.offsetHeight + "px";
  clearInterval(b._t);
  let i = 0; b.textContent = "";
  b._t = setInterval(() => { i++; b.textContent = full.slice(0, i); if (i >= full.length) clearInterval(b._t); }, 26);
}
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const hero = $(".hero");

  /* title split into letters */
  const h1 = $(".hero h1");
  h1.setAttribute("aria-label", "Bát Hùng Vương");
  let li = 0;
  $$("span", h1).forEach(sp => {
    sp.setAttribute("aria-hidden", "true");
    sp.innerHTML = Array.from(sp.textContent).map(ch => '<i style="--i:' + (li++) + '">' + ch + "</i>").join("");
  });

  /* word marquee */
  const star = '<svg viewBox="-10 -10 20 20" aria-hidden="true"><polygon points="' + starPts(0, 0, 9, 3.6, 8) + '" fill="#d8402a"/></svg>';
  const row = WORDS.map(w => "<span>" + w[0] + star + "</span>").join("");
  $("#mq").innerHTML = row + row;

  /* scroll: progress bar, hide nav on scroll down, scroll-spy, hero parallax */
  const prog = $("#progress"), nav = $(".nav");
  const spy = ["hero", "powers", "day", "comic", "words", "video", "team"].map(id => [document.getElementById(id), $('.links a[href="#' + id + '"]')]);
  let lastY = scrollY, ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = "scaleX(" + (H > 0 ? y / H : 0).toFixed(4) + ")";
    if (!reduce) hero.style.setProperty("--sy", Math.min(y, 900) * 0.12);
    const dy = y - lastY;
    if (Math.abs(dy) > 6) { nav.classList.toggle("hide", dy > 0 && y > 160); lastY = y; }
    const mid = innerHeight * 0.4;
    spy.forEach(([sec, a]) => { const r = sec.getBoundingClientRect(); a.classList.toggle("on", r.top <= mid && r.bottom > mid); });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* hero: floating embers that dodge the pointer, plus emblem parallax */
  const emb = $("#embers"), ectx = emb.getContext("2d");
  let W = 0, H = 0, parts = [], rafE = 0, mouse = { x: -999, y: -999 };
  const mk = init => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: 0.8 + Math.random() * 2.2, vy: 0.15 + Math.random() * 0.55, ph: Math.random() * 6.28, a: 0.25 + Math.random() * 0.6, c: Math.random() < 0.22 ? "216,64,42" : "217,164,65", s: Math.random() < 0.18 });
  function size() {
    const r = hero.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; emb.width = W * dpr; emb.height = H * dpr; ectx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts = Array.from({ length: Math.max(28, Math.min(90, Math.round(W * H / 20000))) }, () => mk(true));
  }
  function spark(x, y, r) {
    ectx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * 0.4 : r, px = x + rr * Math.cos(a), py = y + rr * Math.sin(a);
      i ? ectx.lineTo(px, py) : ectx.moveTo(px, py);
    }
    ectx.closePath(); ectx.fill();
  }
  function frame(t) {
    rafE = requestAnimationFrame(frame);
    hero.style.setProperty("--beat", Music.level().toFixed(3));
    ectx.clearRect(0, 0, W, H);
    parts.forEach(p => {
      p.y -= p.vy; p.x += Math.sin(t * 0.0008 + p.ph) * 0.35;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 14400) { const d = Math.sqrt(d2) || 1, f = (120 - d) / 120; p.x += dx / d * f * 3; p.y += dy / d * f * 3; }
      if (p.y < -12) Object.assign(p, mk(false));
      ectx.fillStyle = "rgba(" + p.c + "," + (p.a * (0.6 + 0.4 * Math.sin(t * 0.003 + p.ph))).toFixed(3) + ")";
      if (p.s) spark(p.x, p.y, p.r * 3.2); else { ectx.beginPath(); ectx.arc(p.x, p.y, p.r, 0, 6.283); ectx.fill(); }
    });
  }
  if (!reduce) {
    size();
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 200); });
    new IntersectionObserver(es => {
      if (es[0].isIntersecting) { if (!rafE) rafE = requestAnimationFrame(frame); } else { cancelAnimationFrame(rafE); rafE = 0; }
    }).observe(hero);
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      hero.style.setProperty("--hx", mouse.x + "px"); hero.style.setProperty("--hy", mouse.y + "px");
      if (fine) { hero.style.setProperty("--px", ((e.clientX / innerWidth - 0.5) * 2).toFixed(3)); hero.style.setProperty("--py", ((e.clientY / innerHeight - 0.5) * 2).toFixed(3)); }
    });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; hero.style.setProperty("--px", 0); hero.style.setProperty("--py", 0); });
  }

  /* hero profile card tilts with the pointer */
  const stage = $(".stage");
  if (stage && fine && !reduce) {
    const sv = $("svg", stage);
    stage.addEventListener("pointermove", e => {
      const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      sv.style.transform = "perspective(900px) rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 10).toFixed(2) + "deg) scale(1.03)";
    });
    stage.addEventListener("pointerleave", () => { sv.style.transform = ""; });
  }

  /* power cards: light follows the pointer */
  $$(".power").forEach(p => p.addEventListener("pointermove", e => {
    const r = p.getBoundingClientRect();
    p.style.setProperty("--mx", (e.clientX - r.left) + "px"); p.style.setProperty("--my", (e.clientY - r.top) + "px");
  }));

  /* magnetic buttons */
  if (fine && !reduce) $$(".btn,.sound").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px)";
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });

  /* reveal on scroll: elements below the first screen rise in, in small groups */
  if (!reduce && "IntersectionObserver" in window) {
    const seen = new Map();
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".head,.brief>div,.meet>div,.power,.tl li,.hobby,.vrow,.member,.video,.legend>div").forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      const n = seen.get(el.parentElement) || 0; seen.set(el.parentElement, n + 1);
      el.style.setProperty("--d", (n % 6) * 70 + "ms");
      el.classList.add("rv"); io.observe(el);
    });
  }

  /* comic: bubbles type themselves when a panel comes into view */
  if (!reduce && "IntersectionObserver" in window) {
    const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { typeBubble(e.target); io2.unobserve(e.target); } }), { threshold: 0.75 });
    $$(".panel").forEach(p => io2.observe(p));
  }

  /* comic: cursor follower over the rail */
  const rail = $("#rail"), cur = $("#cur");
  if (fine && !reduce && cur) {
    rail.classList.add("has-cur");
    let tx = 0, ty = 0, cx = 0, cy = 0, cs = 0, ts = 0, raf = 0, first = true;
    const loop = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; cs += (ts - cs) * 0.18;
      cur.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0) scale(" + cs.toFixed(3) + ")";
      raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 || Math.abs(ts - cs) > 0.01) ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    rail.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; if (first) { cx = tx; cy = ty; first = false; } kick(); });
    rail.addEventListener("pointerenter", () => { ts = 1; kick(); });
    rail.addEventListener("pointerleave", () => { ts = 0; first = true; kick(); });
    rail.addEventListener("pointerdown", () => { ts = 0.7; kick(); });
    rail.addEventListener("pointerup", () => { ts = 1; kick(); });
  }
})();

/* ---------- effects pack 2 ---------- */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const hasIO = "IntersectionObserver" in window;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* 1. loading curtain that splits open */
  const loader = $("#loader"), pct = $("#pct");
  let opened = false;
  function openLoader() {
    if (opened) return;
    opened = true;
    document.body.classList.add("loaded");
    loader.classList.add("go");
    setTimeout(() => loader.classList.add("gone"), 1000);
  }
  if (reduce) { opened = true; document.body.classList.add("loaded"); loader.classList.add("gone"); }
  else {
    const t0 = performance.now();
    (function run(t) {
      const p = Math.min(1, (t - t0) / 1400);
      pct.textContent = Math.round(p * 100) + "%";
      if (p < 1) requestAnimationFrame(run); else openLoader();
    })(t0);
    setTimeout(openLoader, 3500);
  }

  /* 2. marquee that speeds up and flips with the scroll direction */
  const mq = $("#mq"), mqWrap = mq.parentElement;
  let mx = 0, mdir = 1, mvel = 0, mlast = scrollY, mhov = false, mvis = true, mraf = 0;
  function mloop() {
    mraf = 0;
    if (!mvis) return;
    const half = mq.scrollWidth / 2, dy = scrollY - mlast;
    mlast = scrollY; mvel += (dy - mvel) * 0.1; mdir += ((mvel < -1 ? -1 : 1) - mdir) * 0.06;
    mx -= mhov ? 0 : mdir * (0.8 + Math.min(Math.abs(mvel), 60) * 0.3);
    if (half) { if (mx <= -half) mx += half; if (mx > 0) mx -= half; }
    mq.style.transform = "translate3d(" + mx.toFixed(2) + "px,0,0) skewX(" + clamp(-mvel * 0.2, -10, 10).toFixed(2) + "deg)";
    mraf = requestAnimationFrame(mloop);
  }
  if (!reduce && hasIO) {
    mqWrap.addEventListener("pointerenter", () => { mhov = true; });
    mqWrap.addEventListener("pointerleave", () => { mhov = false; });
    new IntersectionObserver(es => { mvis = es[0].isIntersecting; if (mvis && !mraf) mraf = requestAnimationFrame(mloop); }).observe(mqWrap);
  }

  /* 3. drifting outline stars with parallax, and a paragraph that lights up word by word */
  const decos = [];
  const spots = { project: [["8%", "80%", 150, 0.12], ["64%", "3%", 90, -0.08]], powers: [["8%", "2%", 110, 0.1]], hobbies: [["30%", "86%", 130, -0.1]], words: [["6%", "90%", 100, 0.14]], team: [["18%", "3%", 120, -0.1]] };
  Object.keys(spots).forEach(id => {
    const sec = document.getElementById(id);
    spots[id].forEach(([top, left, size, speed]) => {
      const sv = svgEl("svg", { viewBox: "-60 -60 120 120", class: "deco", "aria-hidden": "true" });
      sv.style.cssText = "top:" + top + ";left:" + left + ";width:" + size + "px;height:" + size + "px";
      svgEl("polygon", { points: starPts(0, 0, 56, 24, 8) }, sv); svgEl("circle", { r: 40 }, sv);
      sec.insertBefore(sv, sec.firstChild); decos.push({ el: sv, sec, speed });
    });
  });
  const para = $(".brief>div:nth-child(2) p");
  let words = [];
  if (para) {
    para.classList.add("hl");
    para.innerHTML = para.textContent.split(" ").map(w => "<span>" + w + "</span>").join(" ");
    words = $$("span", para);
    if (reduce) words.forEach(w => w.classList.add("on"));
  }
  let tick2 = false;
  function onScroll2() {
    tick2 = false;
    if (!reduce) decos.forEach(d => {
      const r = d.sec.getBoundingClientRect(), off = r.top + r.height / 2 - innerHeight / 2;
      d.el.style.transform = "translate3d(0," + (off * -d.speed).toFixed(1) + "px,0) rotate(" + (off * d.speed * 0.12).toFixed(1) + "deg)";
    });
    if (words.length && !reduce) {
      const r = para.getBoundingClientRect(), p = clamp((innerHeight * 0.9 - r.top) / (innerHeight * 0.45), 0, 1), n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    }
  }
  addEventListener("scroll", () => { if (!tick2) { tick2 = true; requestAnimationFrame(onScroll2); } }, { passive: true });
  addEventListener("resize", onScroll2);
  onScroll2();

  /* 4. numbers count up when the stats come into view */
  const statEls = $$("#stats b");
  if (statEls.length) {
    const targets = [POWERS.length, $$(".panel").length, WORDS.length, 24, $$(".member").length];
    statEls.forEach((b, i) => { b.dataset.n = targets[i]; b.textContent = targets[i]; });
    const box = $("#stats");
    if (!reduce && hasIO && box.getBoundingClientRect().top > innerHeight) {
      statEls.forEach(b => (b.textContent = "0"));
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        (function run(t) {
          const p = Math.min(1, (t - t0) / 1500), e = 1 - Math.pow(1 - p, 3);
          statEls.forEach(b => (b.textContent = Math.round(+b.dataset.n * e)));
          if (p < 1) requestAnimationFrame(run);
        })(t0);
      }, { threshold: 0.4 });
      io.observe(box);
    }
  }

  /* 5. headings scramble into place */
  function scramble(el) {
    const full = el.dataset.t || (el.dataset.t = el.textContent), pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    el.setAttribute("aria-label", full);
    let f = 0;
    const id = setInterval(() => {
      f++;
      const keep = Math.floor(full.length * f / 22);
      el.textContent = full.split("").map((c, i) => (c === " " || i < keep) ? c : pool[Math.floor(Math.random() * 26)]).join("");
      if (f >= 22) { clearInterval(id); el.textContent = full; }
    }, 34);
  }
  if (!reduce && hasIO) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); scramble(e.target); } }), { threshold: 0.7 });
    $$("section h2").forEach(h => { if (h.getBoundingClientRect().top > innerHeight) io.observe(h); });
  }

  /* 6. cursor ring that trails the pointer and grows over links */
  if (fine && !reduce) {
    const ring = document.createElement("div"), dot = document.createElement("div");
    ring.className = "ring hide"; dot.className = "dot hide";
    document.body.append(ring, dot);
    let mx2 = 0, my2 = 0, rx = 0, ry = 0, raf = 0, seen = false;
    const loop = () => {
      rx += (mx2 - rx) * 0.16; ry += (my2 - ry) * 0.16;
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      raf = (Math.abs(mx2 - rx) > 0.1 || Math.abs(my2 - ry) > 0.1) ? requestAnimationFrame(loop) : 0;
    };
    addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      mx2 = e.clientX; my2 = e.clientY;
      if (!seen) { seen = true; rx = mx2; ry = my2; }
      dot.style.transform = "translate3d(" + mx2 + "px," + my2 + "px,0)";
      const t = e.target, inRail = !!(t.closest && t.closest("#rail"));
      ring.classList.toggle("hide", inRail); dot.classList.toggle("hide", inRail);
      ring.classList.toggle("big", !!(t.closest && t.closest("a,button,.power,.hobby,.vrow,.member")));
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.documentElement.addEventListener("mouseleave", () => { ring.classList.add("hide"); dot.classList.add("hide"); });
  }

  /* 7. a burst of little stars wherever you press */
  if (!reduce) addEventListener("pointerdown", e => {
    if (e.button > 0) return;
    for (let i = 0; i < 9; i++) {
      const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.5, d = 36 + Math.random() * 52;
      const el = document.createElement("div");
      el.className = "burst"; el.style.left = e.clientX + "px"; el.style.top = e.clientY + "px";
      el.innerHTML = '<svg viewBox="-10 -10 20 20"><polygon points="' + starPts(0, 0, 9, 3.6, 8) + '" fill="' + (i % 3 ? "#d9a441" : "#d8402a") + '"/></svg>';
      document.body.appendChild(el);
      el.animate([
        { transform: "translate(-50%,-50%) scale(1) rotate(0deg)", opacity: 1 },
        { transform: "translate(calc(-50% + " + (Math.cos(a) * d).toFixed(1) + "px),calc(-50% + " + (Math.sin(a) * d).toFixed(1) + "px)) scale(.2) rotate(200deg)", opacity: 0 }
      ], { duration: 600 + Math.random() * 350, easing: "cubic-bezier(.2,.8,.2,1)" }).onfinish = () => el.remove();
    }
  });

  /* 8. comic panels: glare and a small 3D tilt under the pointer */
  $$(".panel").forEach(p => {
    const g = document.createElement("div"); g.className = "glare"; p.appendChild(g);
    if (!fine || reduce) return;
    const sv = $("svg", p);
    p.addEventListener("pointermove", e => {
      const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      p.style.setProperty("--gx", (x * 100) + "%"); p.style.setProperty("--gy", (y * 100) + "%");
      sv.style.transform = "perspective(700px) rotateY(" + ((x - 0.5) * 8).toFixed(2) + "deg) rotateX(" + ((0.5 - y) * 8).toFixed(2) + "deg) scale(1.04)";
    });
    p.addEventListener("pointerleave", () => { sv.style.transform = ""; });
  });

  /* 9. footer wordmark, letter by letter */
  const bm = $(".bigmark");
  if (bm) bm.innerHTML = Array.from(bm.textContent).map(c => "<i>" + c + "</i>").join("");
})();
