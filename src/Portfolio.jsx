import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpRight, Mail, Download } from "lucide-react";


function GithubIcon({ size = 18, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...rest}
    >
      <path d="M12 0.5C5.65 0.5 0.5 5.66 0.5 12.03c0 5.1 3.29 9.42 7.86 10.95 0.57 0.11 0.78-0.25 0.78-0.55 0-0.27-0.01-1.16-0.02-2.11-3.2 0.7-3.88-1.36-3.88-1.36-0.52-1.34-1.28-1.69-1.28-1.69-1.04-0.72 0.08-0.7 0.08-0.7 1.15 0.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35 0.96 0.1-0.75 0.4-1.25 0.73-1.54-2.56-0.29-5.25-1.28-5.25-5.71 0-1.26 0.45-2.29 1.19-3.1-0.12-0.29-0.52-1.47 0.11-3.06 0 0 0.97-0.31 3.18 1.18 0.92-0.26 1.91-0.38 2.9-0.39 0.98 0.01 1.97 0.13 2.9 0.39 2.2-1.49 3.17-1.18 3.17-1.18 0.63 1.59 0.23 2.77 0.11 3.06 0.74 0.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.27 5.7 0.41 0.36 0.78 1.06 0.78 2.14 0 1.54-0.01 2.79-0.01 3.17 0 0.3 0.2 0.66 0.79 0.55 4.57-1.53 7.86-5.85 7.86-10.95C23.5 5.66 18.35 0.5 12 0.5z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/*  bg      #ffffff   paper white                                      */
/*  ink     #0a0a0a   near-black                                       */
/*  mid     #6e6e6e   secondary copy                                   */
/*  line    #dcdcdc   hairlines                                        */
/*  invert  #0a0a0a bg / #ffffff text  (CTA + one editorial block)     */
/*  Display: 'Archivo Black'  — huge, blunt, poster-weight headlines   */
/*  Body:    'Inter'          — quiet, neutral workhorse               */
/*  Utility: 'IBM Plex Mono'  — index numbers, labels, tags            */
/*  Signature: giant word-by-word clip reveals + running marquees +    */
/*             a custom dot cursor that swells into a label on hover   */
/* ------------------------------------------------------------------ */

const FONT_ID = "pf-fonts-v2";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const l = document.createElement("link");
    l.id = FONT_ID;
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}

/* ---------------- scroll reveal ---------------- */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.unobserve(node);
        }
      },
      { threshold },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on];
}

function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, on] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`rv ${on ? "rv-on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* word-by-word clip-path headline reveal */
function SplitReveal({ text, className = "", baseDelay = 0, step = 70 }) {
  const [ref, on] = useReveal(0.3);
  const words = text.split(" ");
  return (
    <span ref={ref} className={`split-wrap ${className}`}>
      {words.map((w, i) => (
        <span className="split-mask" key={i}>
          <span
            className={`split-word ${on ? "split-on" : ""}`}
            style={{ transitionDelay: `${baseDelay + i * step}ms` }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

/* magnetic button wrapper */
function Magnetic({ children, className = "", as: Tag = "button", ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Marquee({ items, reverse = false, className = "" }) {
  const track = [...items, ...items];
  return (
    <div className={`marquee ${className}`}>
      <div className={`marquee-track ${reverse ? "marquee-rev" : ""}`}>
        {track.map((t, i) => (
          <span className="marquee-item" key={i}>
            {t}
            <span className="marquee-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    idx: "01",
    name: "DeliveryDesk",
    year: "2026",
    blurb:
      "A multi-role courier & parcel management system — Customer, Admin, Agent and Rider panels covering booking, live tracking, and branch operations end to end.",
    tech: "Laravel — PHP — MySQL — Blade — Tailwind",
    repo: "https://github.com/uroojismail48/DeliveryDesk",
    demo: null,
  },
  {
    idx: "02",
    name: "CineFlex",
    year: "2026",
    blurb:
     " Movie & TV discovery app built with React, TMDB API, Swiper, Clerk for User Management, and React Router — featuring genre filters, carousels, and dynamic routing.",
    tech: "JavaScript - ReactJS - ReduxToolkit- Clerk - Swiper Js - React Router - IMDB API",
    repo: "https://github.com/uroojismail48/CineFlex",
    demo: "cine-flex-iota.vercel.app",
  },
    {
    idx: "03",
    name: "ChatMate",
    year: "2026",
    blurb:
     " Movie & TV discovery app built with React, TMDB API, Swiper, Clerk for User Management, and React Router — featuring genre filters, carousels, and dynamic routing.",
    tech: "JavaScript - ReactJS - ReduxToolkit- Clerk - Swiper Js - React Router - IMDB API",
    repo: "https://github.com/uroojismail48/ChatMate",
    demo: "chat-mate-peach.vercel.app",
  },
  {
    idx: "04",
    name: "ClarityLens",
    year: "2026",
    blurb:
      "AI-powered image enhancer built with React, using the PicWish API to automatically improve brightness, sharpness, and color balance of photos.",
    tech: "JavaScript - ReactJS - TailwindCss - PicWishApi -",
    repo: "https://github.com/uroojismail48/Pixora",
    demo: "pixora-ten-rosy.vercel.app",
  },

];

const SKILL_ROW_1 = [
  "HTML",
  "CSS"
"JavaScript"{}
  "React JS",
  "Redux Toolkit",
 "Next JS",
  "TypeScript",
    "Bootstrap",
  "Tailwind CSS",
  "React Router",
  "Tanstack Query(React Query)"
];
const SKILL_ROW_2 = [
  "Laravel",
  "PHP",
  "MySQL",
  "Git/Github",
  "REST APIs",
  "Axios"
];

export default function Portfolio() {
  useFonts();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [cursorOn, setCursorOn] = useState(false);
  const [toast, setToast] = useState("");
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  /* preloader counter */
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1600;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setLoaded(true), 260);
    };
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = "hidden";
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (loaded) document.body.style.overflow = "";
  }, [loaded]);

  /* custom cursor tracking */
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      if (!cursorOn) setCursorOn(true);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorOn]);

  const enterCursor = (label) => setCursorLabel(label);
  const leaveCursor = () => setCursorLabel("");

  const scrollTo = useCallback((id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className={`pf ${cursorOn ? "pf-cursor-on" : ""}`}>
      <style>{CSS}</style>

      {/* -------- preloader -------- */}
      <div className={`preloader ${loaded ? "preloader-done" : ""}`}>
        <span className="preloader-num">
          {String(progress).padStart(3, "0")}
        </span>
        <div className="preloader-bar">
          <div className="preloader-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* -------- custom cursor -------- */}
      <div
        ref={cursorRef}
        className={`cursor ${cursorLabel ? "cursor-label" : ""}`}
      >
        <span className="cursor-dot" />
        {cursorLabel && <span className="cursor-text">{cursorLabel}</span>}
      </div>

      {/* -------- nav -------- */}
      <header className="nav">
        <button className="nav-logo" onClick={() => scrollTo("top")}>
          UROOJ<span className="nav-logo-dot">.</span>
        </button>
        <nav className="nav-links">
          {["about", "work", "skills", "contact"].map((id) => (
            <button
              key={id}
              className="nav-link"
              onMouseEnter={() => enterCursor("")}
              onMouseLeave={leaveCursor}
              onClick={() => scrollTo(id)}
            >
              {id}
            </button>
          ))}
        </nav>
        <a
          className="nav-cta"
          href="mailto:uroojismail48@gmail.com"
          onMouseEnter={() => enterCursor("SAY HI")}
          onMouseLeave={leaveCursor}
        >
          Available for work
        </a>
      </header>

      {/* -------- hero -------- */}
      <section id="top" className="hero">
        <div className="hero-eyebrow">
          <span className="dot-live" /> Frontend Developer — Karachi
        </div>

        <h1 className="hero-title">
          <SplitReveal text="I BUILD INTERFACES" baseDelay={200} />
          <br />
          <SplitReveal text="THAT FEEL" baseDelay={700} />{" "}
          <span className="hero-outline">
            <SplitReveal text="INEVITABLE." baseDelay={950} />
          </span>
        </h1>

        <Reveal delay={1300} className="hero-sub-row">
          <p className="hero-sub">
            React, Redux Toolkit, TypeScript and Next.js on the surface —
            Laravel, PHP and MySQL underneath. I build the whole thing, not just
            the pretty part.
          </p>
          <Magnetic
            className="hero-btn"
            onClick={() => scrollTo("work")}
            onMouseEnter={() => enterCursor("VIEW")}
            onMouseLeave={leaveCursor}
          >
            See the work <ArrowUpRight size={18} />
          </Magnetic>
        </Reveal>
      </section>

      <Marquee
        items={[
          "AVAILABLE FOR FREELANCE",
          "REACT",
          "NEXT.JS",
          "TYPESCRIPT",
          "LARAVEL",
          "OPEN TO WORK",
        ]}
        className="marquee-hero"
      />

      {/* -------- about -------- */}
      <section id="about" className="section">
        <div className="section-index">01</div>
        <Reveal className="section-label">
          <span className="tag">// about</span>
        </Reveal>
        <Reveal delay={80} className="about-statement">
          Frontend-focused, full-stack grounded. I care about the last 5% — the
          transition that feels right, the state that never breaks, the API
          response that arrives exactly when the UI expects it.
        </Reveal>
        <div className="about-grid">
          <Reveal delay={140} className="about-block">
            <span className="about-block-label">Focus</span>
            <p>
              React · Redux Toolkit · TypeScript · Next.js — building interfaces
              that hold up under real use, not just demos.
            </p>
          </Reveal>
          <Reveal delay={220} className="about-block">
            <span className="about-block-label">Foundation</span>
            <p>
              PHP, Laravel and MySQL underneath — enough backend fluency to
              design frontends that respect how the data actually moves.
            </p>
          </Reveal>
          <Reveal delay={300} className="about-block">
            <span className="about-block-label">Off the clock</span>
            <p>
              Exploring cybersecurity fundamentals and wireless networking tools
              on Kali Linux — a different kind of system thinking.
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------- work -------- */}
      <section id="work" className="section section-work">
        <div className="section-index">02</div>
        <Reveal className="section-label">
          <span className="tag">// selected work</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="section-title">Recent builds.</h2>
        </Reveal>

        <div className="work-list">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.idx} delay={i * 100} className="work-row" as="a">
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="work-row-link"
                onMouseEnter={() => enterCursor("VIEW REPO")}
                onMouseLeave={leaveCursor}
              >
                <span className="work-num">{p.idx}</span>
                <div className="work-mid">
                  <h3 className="work-name">{p.name}</h3>
                  <p className="work-blurb">{p.blurb}</p>
                  <span className="work-tech">{p.tech}</span>
                </div>
                <div className="work-right">
                  <span className="work-year">{p.year}</span>
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="work-demo"
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        enterCursor("LIVE DEMO");
                      }}
                    >
                      Live 
                    </a>
                  )}
                  <ArrowUpRight size={22} className="work-arrow" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------- skills -------- */}
      <section id="skills" className="section section-skills">
        <div className="section-index">03</div>
        <Reveal className="section-label">
          <span className="tag tag-invert">// stack</span>
        </Reveal>
        <Marquee items={SKILL_ROW_1} className="marquee-skills" />
        <Marquee items={SKILL_ROW_2} reverse className="marquee-skills" />
      </section>

      {/* -------- contact (inverted) -------- */}
      <section id="contact" className="section section-contact">
        <div className="section-index section-index-light">04</div>
        <Reveal className="section-label">
          <span className="tag tag-invert">// contact</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="contact-title">
            Let's build
            <br />
            something{" "}
            <span className="hero-outline hero-outline-light">real.</span>
          </h2>
        </Reveal>

        <Reveal delay={160} className="contact-actions">
          <Magnetic
            as="a"
            className="contact-btn"
            href="mailto:uroojismail48@gmail.com"
            onMouseEnter={() => enterCursor("EMAIL")}
            onMouseLeave={leaveCursor}
          >
            <Mail size={18} /> uroojismail48@gmail.com
          </Magnetic>
          <Magnetic
            as="a"
            className="contact-btn contact-btn-ghost"
            href="https://github.com/uroojismail48"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => enterCursor("GITHUB")}
            onMouseLeave={leaveCursor}
          >
            <GithubIcon size={18} /> GitHub
          </Magnetic>
          <Magnetic
            className="contact-btn contact-btn-ghost"
            onClick={() => showToast("Resume coming soon")}
            onMouseEnter={() => enterCursor("SOON")}
            onMouseLeave={leaveCursor}
          >
            <Download size={18} /> Resume
          </Magnetic>
        </Reveal>

        <footer className="footer-inner">
          <span>© {new Date().getFullYear()} Urooj Ismail</span>
          <span>Karachi, Pakistan</span>
        </footer>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
const CSS = `
:root {
  --bg: #ffffff;
  --ink: #0a0a0a;
  --mid: #6e6e6e;
  --line: #dcdcdc;
}
* { box-sizing: border-box; }
.pf {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}
.pf-cursor-on { cursor: none; }
.pf-cursor-on a, .pf-cursor-on button { cursor: none; }
@media (max-width: 860px) {
  .pf-cursor-on { cursor: auto; }
  .pf-cursor-on a, .pf-cursor-on button { cursor: pointer; }
  .cursor { display: none; }
}

/* ---------- preloader ---------- */
.preloader {
  position: fixed; inset: 0; z-index: 200;
  background: var(--ink);
  color: #fff;
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 40px;
  transition: transform 0.9s cubic-bezier(0.76,0,0.24,1);
}
.preloader-done { transform: translateY(-100%); pointer-events: none; }
.preloader-num {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(48px, 10vw, 120px);
  line-height: 1;
}
.preloader-bar { width: 240px; height: 2px; background: rgba(255,255,255,0.25); margin-bottom: 14px; }
.preloader-fill { height: 100%; background: #fff; transition: width 0.1s linear; }

/* ---------- custom cursor ---------- */
.cursor {
  position: fixed; top: 0; left: 0; z-index: 150;
  pointer-events: none;
  transform: translate(-50%, -50%);
}
.cursor-dot {
  display: block;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--ink);
  transition: width 0.25s ease, height 0.25s ease, opacity 0.25s ease;
}
.cursor-label .cursor-dot { opacity: 0; }
.cursor-text {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  display: none;
  white-space: nowrap;
  background: var(--ink);
  color: #fff;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 10px 16px;
  border-radius: 999px;
}
.cursor-label .cursor-text { display: block; animation: cpop 0.2s ease; }
@keyframes cpop { from { transform: translate(-50%,-50%) scale(0.7); opacity:0; } to { transform: translate(-50%,-50%) scale(1); opacity:1; } }

/* ---------- reveal ---------- */
.rv { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
.rv-on { opacity: 1; transform: translateY(0); }

.split-wrap { display: inline; }
.split-mask { display: inline-block; overflow: hidden; vertical-align: bottom; }
.split-word {
  display: inline-block;
  transform: translateY(115%);
  transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
}
.split-on { transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .rv, .split-word { opacity: 1; transform: none; transition: none; }
}

/* ---------- nav ---------- */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  padding: 26px 40px;
  mix-blend-mode: difference;
  color: #fff;
}
.nav-logo { background: none; border: none; font-family: 'Archivo Black', sans-serif; font-size: 16px; color: #fff; cursor: pointer; letter-spacing: 0.02em; }
.nav-logo-dot { color: #fff; }
.nav-links { display: flex; gap: 32px; }
.nav-link { background: none; border: none; color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; }
.nav-cta { font-family: 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #fff; text-decoration: none; border: 1px solid #fff; padding: 8px 14px; border-radius: 999px; }
@media (max-width: 760px) { .nav-links { display: none; } .nav { padding: 20px 22px; } }

/* ---------- hero ---------- */
.hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 140px 40px 60px; }
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px; width: fit-content;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--mid); margin-bottom: 28px;
}
.dot-live { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; }
.hero-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(36px, 8.6vw, 108px);
  line-height: 0.96;
  letter-spacing: -0.01em;
  margin: 0 0 40px;
  text-transform: uppercase;
    color: black;
}
.hero-outline {
  -webkit-text-stroke: 2px var(--ink);
  color: transparent;
}
.hero-outline-light { -webkit-text-stroke: 2px #fff; color: transparent; }
.hero-sub-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; flex-wrap: wrap; border-top: 1px solid var(--line); padding-top: 28px; }
.hero-sub { max-width: 460px; color: var(--mid); font-size: 16px; line-height: 1.7; margin: 0; }
.hero-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ink); color: #fff;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em;
  padding: 16px 26px; border-radius: 999px; border: none; cursor: pointer; white-space: nowrap;
}

/* ---------- marquee ---------- */
.marquee { overflow: hidden; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 18px 0; }
.marquee-track { display: flex; width: max-content; animation: mscroll 22s linear infinite; }
.marquee-rev { animation-direction: reverse; }
@keyframes mscroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.marquee-item {
  display: inline-flex; align-items: center; gap: 20px;
  font-family: 'Archivo Black', sans-serif; text-transform: uppercase;
  font-size: clamp(18px, 3vw, 30px);
  padding: 0 24px;
  color: var(--ink);
  white-space: nowrap;
}
.marquee-star { color: var(--mid); font-size: 14px; }
.marquee-skills .marquee-item { font-size: clamp(15px,2vw,20px); }
@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }

/* ---------- sections ---------- */
.section { position: relative; padding: 110px 40px; max-width: 1240px; margin: 0 auto; }
.section-index {
  position: absolute; top: 40px; right: 40px;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--mid);
}
.section-index-light { color: rgba(255,255,255,0.5); }
.section-label { margin-bottom: 28px; }
.tag { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--mid); }
.tag-invert { color: rgba(255,255,255,0.6); }
.section-title { font-family: 'Archivo Black', sans-serif; font-size: clamp(30px,5vw,50px); text-transform: uppercase; margin: 0 0 50px; }

/* ---------- about ---------- */
.about-statement {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(24px, 3.4vw, 40px);
  line-height: 1.25;
  text-transform: uppercase;
  max-width: 920px;
  margin: 0 0 60px;
}
.about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; border-top: 1px solid var(--line); padding-top: 40px; }
.about-block-label { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--mid); margin-bottom: 12px; }
.about-block p { margin: 0; font-size: 15.5px; line-height: 1.7; color: var(--ink); }
@media (max-width: 860px) { .about-grid { grid-template-columns: 1fr; } }

/* ---------- work ---------- */
.work-list { border-top: 1px solid var(--line); }
.work-row { border-bottom: 1px solid var(--line); }
.work-row-link {
  display: flex; align-items: center; gap: 28px;
  padding: 40px 0;
  text-decoration: none; color: var(--ink);
  transition: padding-left 0.35s ease, opacity 0.3s ease;
}
.work-row-link:hover { padding-left: 16px; }
.work-num { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--mid); width: 32px; flex-shrink: 0; }
.work-mid { flex: 1; min-width: 0; }
.work-name { font-family: 'Archivo Black', sans-serif; font-size: clamp(24px, 4vw, 44px); text-transform: uppercase; margin: 0 0 10px; }
.work-blurb { color: var(--mid); font-size: 15px; line-height: 1.65; max-width: 600px; margin: 0 0 12px; }
.work-tech { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--mid); }
.work-right { display: flex; align-items: center; gap: 18px; flex-shrink: 0; }
.work-year { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--mid); }
.work-demo { font-family: 'IBM Plex Mono', monospace; font-size: 12px; text-decoration: underline; color: var(--ink); }
.work-arrow { transition: transform 0.3s ease; }
.work-row-link:hover .work-arrow { transform: translate(4px,-4px); }
@media (max-width: 700px) {
  .work-row-link { flex-wrap: wrap; }
  .work-right { width: 100%; justify-content: space-between; padding-top: 12px; }
}

/* ---------- skills ---------- */
.section-skills { padding-left: 0; padding-right: 0; max-width: 100%; }
.section-skills .section-label, .section-skills .section-index { padding: 0 40px; }
.section-skills .section-index { position: static; text-align: right; margin-bottom: -20px; }
.section-skills .section-label { max-width: 1240px; margin-left: auto; margin-right: auto; }

/* ---------- contact (inverted) ---------- */
.section-contact { background: var(--ink); color: #fff; max-width: 100%; margin-top: 0; }
.section-contact .section-inner, .section-contact { padding: 110px 40px 40px; }
.contact-title { font-family: 'Archivo Black', sans-serif; font-size: clamp(38px, 8vw, 88px); text-transform: uppercase; line-height: 0.98; margin: 0 0 60px; max-width: 1240px; margin-left: auto; margin-right: auto; }
.contact-actions { display: flex; flex-wrap: wrap; gap: 16px; max-width: 1240px; margin: 0 auto 100px; }
.contact-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: #fff; color: var(--ink);
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em;
  padding: 16px 24px; border-radius: 999px; text-decoration: none; border: 1px solid #fff; cursor: pointer;
}
.contact-btn-ghost { background: transparent; color: #fff; }
.footer-inner { max-width: 1240px; margin: 0 auto; display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 24px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.6); }

/* ---------- magnetic ---------- */
.magnetic { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1); }

/* ---------- toast ---------- */
.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  background: var(--ink); color: #fff;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px;
  padding: 12px 22px; border-radius: 999px; z-index: 120;
}

*:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
`;
