import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkle,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Infinity as InfinityIcon,
  Command,
  Zap,
  Lock,
  RefreshCw,
  Brain,
  FileText,
  Upload,
  ListChecks,
  Target,
  BarChart3,
  Bot,
  Star,
  Plus,
  Minus,
  Menu,
  X as XIcon,
  Github,
  Twitter,
  Globe,
  Quote,
  Lightbulb,
  MessageSquare,
  Layers,
  Keyboard,
  Cpu,
} from "lucide-react";

/* ========================================================================
 * LandingPage — strict black / white / grayscale
 * ------------------------------------------------------------------------
 * Shares the visual language of /login:
 *   • animated dot grid + drifting orbs on black surfaces
 *   • typewriter headline w/ blinking caret
 *   • Manrope display type, zinc grayscale ramp
 *   • bordered cards w/ soft shadows, monochrome icons
 * ====================================================================== */

const cn = (...c) => c.filter(Boolean).join(" ");

/* ---------------- shared bits ---------------- */
const WordMark = ({ onDark = true, size = "md" }) => {
  const big = size === "lg";
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg",
          big ? "h-9 w-9" : "h-8 w-8",
          onDark ? "bg-white text-black" : "bg-black text-white"
        )}
      >
        <Sparkle className={big ? "h-[18px] w-[18px]" : "h-4 w-4"} strokeWidth={2.4} />
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2",
            onDark ? "bg-white ring-black" : "bg-black ring-white"
          )}
        />
      </div>
      <span
        className={cn(
          "font-semibold tracking-[0.18em]",
          big ? "text-[16px]" : "text-[14.5px]",
          onDark ? "text-white" : "text-black"
        )}
        style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
      >
        STUDY·AI
      </span>
    </div>
  );
};

/* Animated background for any dark section */
const DarkGridBg = () => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty("--mx", `${x * 6}px`);
    el.style.setProperty("--my", `${y * 6}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          transform: "translate(calc(var(--mx,0px)), calc(var(--my,0px)))",
          transition: "transform 300ms ease-out",
        }}
      />
      <div className="lp-orb absolute -top-40 -right-24 h-[420px] w-[420px] rounded-full bg-white/[0.06] blur-3xl" />
      <div className="lp-orb-2 absolute -bottom-40 -left-16 h-[360px] w-[360px] rounded-full bg-white/[0.04] blur-3xl" />
      <div className="lp-sweep absolute inset-0" />
    </div>
  );
};

/* Tiny reveal-on-scroll hook */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("lp-reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

/* =====================================================================
 * NAV BAR
 * ==================================================================== */
const NavBar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="shrink-0">
          <WordMark onDark />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            data-testid="nav-signin"
            onClick={() => navigate("/login")}
            className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Sign in
          </button>
          <button
            data-testid="nav-cta"
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-[13px] font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            Get started
            <ArrowRight className="h-[14px] w-[14px] transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* mobile */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-white/80 md:hidden"
        >
          {menuOpen ? <XIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-[14px] font-medium text-white/80 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="mt-2 rounded-lg bg-white px-3 py-2 text-[14px] font-semibold text-black"
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

/* =====================================================================
 * HERO — black, typewriter + product preview card
 * ==================================================================== */
const TAGLINES = [
  "Study smarter, not harder.",
  "From notes to mastery in minutes.",
  "Your personal AI study partner.",
  "Turn any topic into a quiz — instantly.",
];

const Hero = () => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  // Cycle taglines — each new line is rendered via key re-mount which
  // re-triggers the word-by-word blur-slide animation below.
  useEffect(() => {
    const t = setTimeout(() => setIdx((i) => (i + 1) % TAGLINES.length), 3800);
    return () => clearTimeout(t);
  }, [idx]);

  const words = TAGLINES[idx].split(" ");

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-black pb-24 pt-28 text-white sm:pb-32 sm:pt-32"
    >
      <DarkGridBg />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* LEFT — copy */}
          <div className="mx-auto max-w-[680px] text-center lg:mx-0 lg:text-left">
            <h1
              className="text-[44px] font-bold leading-[1.02] tracking-tight sm:text-[64px] lg:text-[76px]"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              {/* min-height locks the space so CTAs don't jump when a new
                  tagline wraps to a different number of lines. */}
              <span
                key={idx}
                data-testid="hero-headline"
                className="flex min-h-[2.24em] flex-wrap items-start justify-center gap-x-[0.28em] gap-y-[0.08em] lg:justify-start"
              >
                {words.map((w, i) => (
                  <span
                    key={`${idx}-${i}`}
                    className="lp-word inline-block will-change-transform"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <button
                data-testid="hero-primary-cta"
                onClick={() => navigate("/login")}
                className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-[14px] font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(255,255,255,0.25)] active:translate-y-0 active:scale-[0.99]"
              >
                <span className="lp-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
                Get started — it's free
                <ArrowRight className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <a
                data-testid="hero-secondary-cta"
                href="#how"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-5 text-[14px] font-semibold text-white transition hover:border-white/40 hover:bg-white/[0.08]"
              >
                See how it works
                <ArrowUpRight className="h-[15px] w-[15px]" />
              </a>
            </div>
          </div>

          {/* RIGHT — stylised product preview */}
          <HeroPreview />
        </div>
      </div>

      {/* soft black → white blend into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-b from-transparent via-black/0 to-white"
      />
    </section>
  );
};

/* =====================================================================
 * TILT CARD — 3D hover effect (cursor-tracking perspective + glare)
 * ---------------------------------------------------------------------
 * The card tilts toward the cursor and a soft radial "light" follows
 * the pointer, so every photo-like card feels responsive to touch.
 * ==================================================================== */
const TiltCard = ({
  children,
  className,
  max = 10,
  glare = "light", // "light" (for dark cards) | "dark" (for white cards)
  testId,
}) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -max;
    const ry = (px - 0.5) * max;
    el.style.setProperty("--tx", `${ry}deg`);
    el.style.setProperty("--ty", `${rx}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.style.setProperty("--ga", "1");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0deg");
    el.style.setProperty("--ty", "0deg");
    el.style.setProperty("--ga", "0");
  };

  return (
    <div
      ref={ref}
      data-testid={testId}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("lp-tilt", className)}
    >
      <div className="lp-tilt-inner h-full w-full">
        {children}
        <div
          aria-hidden="true"
          className={cn(
            "lp-glare pointer-events-none absolute inset-0 rounded-[inherit]",
            glare === "dark" ? "lp-glare-dark" : "lp-glare-light"
          )}
        />
      </div>
    </div>
  );
};

/* ---------- Hero product preview (stylised app mock) ---------- */
const HeroPreview = () => (
  <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
    {/* Drifting ambient light */}
    <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-white/[0.04] blur-2xl" />

    {/* Browser chrome — wrapped in TiltCard so it reacts to cursor */}
    <TiltCard
      testId="hero-preview-card"
      max={9}
      glare="light"
      className="rounded-2xl"
    >
      <div className="lp-float-y relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/60 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="ml-3 flex flex-1 items-center gap-1.5 rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55">
            <Lock className="h-[10px] w-[10px]" />
            study·ai/chat
          </div>
        </div>

        {/* Faux chat */}
        <div className="space-y-3 bg-white p-5 text-black">
          {/* user */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl bg-black px-3.5 py-2 text-[12.5px] text-white">
              Quiz me on photosynthesis — 5 questions, analyze level.
            </div>
          </div>
          {/* assistant */}
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="max-w-[85%] rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[12.5px]">
              <div className="mb-1 text-[9.5px] font-semibold uppercase tracking-wider text-zinc-500">
                Gemini 3.1 Pro
              </div>
              Here's a 5-question quiz at{" "}
              <span className="font-semibold">Analyze</span> level. Good luck!
            </div>
          </div>

          {/* MCQ peek */}
          <div
            className="relative overflow-hidden rounded-xl border p-3"
            style={{
              background:
                "linear-gradient(180deg, #fbf4de 0%, #f4ead0 60%, #eeddb6 100%)",
              borderColor: "#c7ad78",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.3]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 21px, rgba(139,101,45,0.2) 21px, rgba(139,101,45,0.2) 22px)",
              }}
            />
            <div className="relative flex items-start gap-2">
              <span
                className="inline-flex h-6 min-w-[24px] items-center justify-center rounded px-1.5 text-[10px] font-bold"
                style={{ background: "#2a2218", color: "#fbf4de" }}
              >
                Q1
              </span>
              <div className="text-[12px] font-semibold text-[#2a2218]">
                During the light-dependent reactions, where is ATP synthesised?
              </div>
            </div>
            <div className="relative mt-2 grid grid-cols-2 gap-1.5 text-[11px] text-[#2a2218]">
              {[
                { t: "Stroma", ok: false, picked: false },
                { t: "Thylakoid membrane", ok: true, picked: true },
                { t: "Outer envelope", ok: false, picked: false },
                { t: "Cytosol", ok: false, picked: false },
              ].map((o) => (
                <div
                  key={o.t}
                  className="flex items-center gap-1.5 rounded-md border px-1.5 py-1"
                  style={{
                    borderColor: o.ok ? "#2a2218" : "rgba(139,101,45,0.35)",
                    background: o.ok ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)",
                  }}
                >
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border-[1.5px]"
                    style={{
                      borderColor: o.ok ? "#2a2218" : "#8a7348",
                      background: o.ok ? "#fbf4de" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {o.ok && <Check className="h-[9px] w-[9px]" strokeWidth={3} />}
                  </span>
                  <span style={{ fontFamily: "'Edu VIC WA NT Beginner', cursive" }}>
                    {o.t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-[11px] text-zinc-600">
            <Sparkles className="h-[11px] w-[11px]" />
            Typing your next question...
          </div>
        </div>
      </div>
    </TiltCard>

    {/* Floating review chip */}
    <div className="lp-float-y absolute -bottom-4 right-0 hidden items-center gap-2 rounded-xl border border-white/10 bg-black/80 px-3 py-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-lg sm:flex">
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-[12px] w-[12px] fill-white text-white" />
        ))}
      </div>
      <div className="text-[11.5px] font-semibold">4.9 from 8k students</div>
    </div>
  </div>
);

/* =====================================================================
 * FEATURES GRID — 6 cards
 * ==================================================================== */
const FEATURES = [
  {
    Icon: Upload,
    title: "Notes → Quiz in seconds",
    body: "Drop a PDF, image, or paste text. We'll craft precise MCQs tuned to your material.",
  },
  {
    Icon: Brain,
    title: "Bloom's-style complexity",
    body: "Recall, Apply, Analyze, Mastery. Dial the difficulty to match your exam.",
  },
  {
    Icon: Cpu,
    title: "Every frontier model",
    body: "Switch between Gemini, Claude, GPT, and Kimi — one keyboard shortcut away.",
  },
  {
    Icon: FileText,
    title: "Paper-style grading",
    body: "Results arrive like a real exam paper — red-pen feedback, A+ to F grades.",
  },
  {
    Icon: BarChart3,
    title: "Mastery tracking",
    body: "Best-score memory across retries. Watch yourself get sharper, test after test.",
  },
  {
    Icon: Keyboard,
    title: "Keyboard-first flow",
    body: "Everything's ⌘K-fast. Chat, quiz, switch models, review — without a mouse.",
  },
];

const FeaturesGrid = () => {
  const ref = useReveal();
  return (
    <section
      id="features"
      className="relative bg-white pb-20 pt-12 sm:pb-28 sm:pt-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="Built for how students actually study."
          sub="Every detail designed to remove friction between you and the next concept."
        />

        <div
          ref={ref}
          className="lp-reveal mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ Icon, title, body }, i) => (
            <TiltCard
              key={title}
              testId={`feature-card-${i}`}
              max={8}
              glare="dark"
              className="rounded-2xl"
            >
              <div
                className="group relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-black hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </div>
                <h3
                  className="text-[16.5px] font-bold text-black"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  {title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600">
                  {body}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-zinc-400 transition-colors duration-300 group-hover:text-black">
                  Learn more
                  <ArrowUpRight className="h-[13px] w-[13px]" />
                </div>
                {/* corner glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-black/[0.03] blur-2xl transition-all duration-500 group-hover:bg-black/[0.06]" />
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ title, sub, onDark }) => (
  <div className="mx-auto max-w-2xl text-center">
    <h2
      className={cn(
        "text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[42px]",
        onDark ? "text-white" : "text-black"
      )}
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      {title}
    </h2>
    {sub && (
      <p
        className={cn(
          "mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed",
          onDark ? "text-white/65" : "text-zinc-600"
        )}
      >
        {sub}
      </p>
    )}
  </div>
);

/* =====================================================================
 * HOW IT WORKS — 3 numbered steps, black section
 * ==================================================================== */
const STEPS = [
  {
    Icon: Upload,
    title: "Drop your material",
    body: "Notes, lecture slides, a whole textbook chapter, even a photo of the whiteboard — we read it all.",
  },
  {
    Icon: Sparkles,
    title: "Pick your flavour",
    body: "Choose a model, set the complexity, and decide whether AI should auto-tune the question count.",
  },
  {
    Icon: ListChecks,
    title: "Take the exam",
    body: "Answer in a paper-style interface. Get graded with red-pen feedback and a best-score memory.",
  },
];

const HowItWorks = () => {
  const ref = useReveal();
  return (
    <section
      id="how"
      className="relative overflow-hidden bg-black py-20 text-white sm:py-28"
    >
      <DarkGridBg />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          onDark
          title="Three steps. Zero friction."
          sub="From a photo of your notes to a graded quiz — in under a minute."
        />

        <div ref={ref} className="lp-reveal mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map(({ Icon, title, body }, i) => (
            <TiltCard
              key={title}
              testId={`step-card-${i}`}
              max={9}
              glare="light"
              className="rounded-2xl"
            >
              <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.04]">
                {/* big number behind */}
                <div
                  className="pointer-events-none absolute right-4 top-2 text-[84px] font-black leading-none tracking-tight text-white/[0.05]"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  0{i + 1}
                </div>
                <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                  <Icon className="h-[19px] w-[19px]" strokeWidth={2} />
                </div>
                <div className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Step {i + 1}
                </div>
                <h3
                  className="relative mt-1 text-[18px] font-bold leading-snug"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  {title}
                </h3>
                <p className="relative mt-2 text-[13.5px] leading-relaxed text-white/65">
                  {body}
                </p>

                {/* connector arrow */}
                {i < STEPS.length - 1 && (
                  <div className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 translate-x-full text-white/20 md:block">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
/* =====================================================================
 * Animated MCQ Paper — student-answers → system-checks → top-grade loop
 *
 * Phase machine:
 *   0  rest (empty checkboxes)         — 900ms
 *   1  answering Q1 (active ring)      — 420ms
 *   2  Q1 ticked, answering Q2         — 420ms
 *   3  Q2 ticked, answering Q3         — 420ms
 *   4  All ticked, "checking answers…" — 1100ms
 *   5  Graded: A+ stamp slams in       — 2600ms hold
 * (then restarts from 0)
 * ==================================================================== */
const MCQ_QS = [
  {
    q: "Which data structure uses LIFO order?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correct: 1,
  },
  {
    q: "Worst-case time complexity of linear search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 2,
  },
  {
    q: "Which algorithm has O(log n) average complexity?",
    options: ["Bubble sort", "Binary search", "Linear search", "Depth-first search"],
    correct: 1,
  },
];

const PHASE_DURATIONS = [900, 420, 420, 420, 1100, 2600];

const AnimatedMCQPaper = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase((p) => (p + 1) % PHASE_DURATIONS.length);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  // phase → which questions are "already answered" (check visible)
  const answeredCount = phase >= 4 ? 3 : Math.max(0, phase - 0) - (phase === 0 ? 0 : 0);
  // cleaner:
  // phase 0 → 0 answered
  // phase 1 → Q1 actively being picked (not yet ticked)
  // phase 2 → Q1 ticked, Q2 active
  // phase 3 → Q2 ticked, Q3 active
  // phase ≥ 4 → all 3 ticked
  const isAnswered = (idx) => {
    if (phase === 0) return false;
    if (phase >= 4) return true;
    return idx < phase - 1;
  };
  const isActive = (idx) => {
    if (phase === 0 || phase >= 4) return false;
    return idx === phase - 1;
  };

  const checking = phase === 4;
  const graded = phase === 5;

  return (
    <div className="relative">
      {/* paper card */}
      <div
        className="relative overflow-hidden rounded-2xl border p-5 shadow-[0_20px_50px_rgba(120,85,30,0.14)]"
        style={{
          background:
            "linear-gradient(180deg, #fbf4de 0%, #f4ead0 60%, #eeddb6 100%)",
          borderColor: "#c7ad78",
        }}
        data-testid="animated-mcq-paper"
      >
        {/* ruled lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.32]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(139,101,45,0.18) 27px, rgba(139,101,45,0.18) 28px)",
          }}
        />

        {/* questions */}
        <div className="relative space-y-4">
          {MCQ_QS.map((q, qi) => {
            const answered = isAnswered(qi);
            const active = isActive(qi);
            return (
              <div key={qi} data-testid={`mcq-q-${qi}`}>
                <div className="mb-2 flex items-start gap-2">
                  <span
                    className="inline-flex h-6 min-w-[24px] shrink-0 items-center justify-center rounded px-1.5 text-[10.5px] font-bold"
                    style={{ background: "#2a2218", color: "#fbf4de" }}
                  >
                    Q{qi + 1}
                  </span>
                  <div
                    className="text-[12.5px] leading-snug"
                    style={{
                      color: "#2a2218",
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 650,
                    }}
                  >
                    {q.q}
                  </div>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.correct;
                    const showTick = answered && isCorrect;
                    const showActive = active && isCorrect;
                    return (
                      <div
                        key={opt}
                        className={cn(
                          "relative flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[11.5px] transition-all duration-300",
                          showActive && "lp-mcq-active"
                        )}
                        style={{
                          borderColor: showTick
                            ? "#2a2218"
                            : "rgba(139,101,45,0.35)",
                          background: showTick
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(255,255,255,0.35)",
                        }}
                      >
                        <span
                          className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-[1.5px]"
                          style={{
                            borderColor: showTick ? "#2a2218" : "#8a7348",
                            background: showTick
                              ? "#fbf4de"
                              : "rgba(255,255,255,0.6)",
                          }}
                        >
                          {showTick && (
                            <Check
                              className="lp-check-in h-[10px] w-[10px]"
                              strokeWidth={3}
                              style={{ color: "#2a2218" }}
                            />
                          )}
                          {/* active pen-hover pulse ring */}
                          {showActive && (
                            <span
                              aria-hidden="true"
                              className="lp-pen-ring absolute -inset-1 rounded-md"
                              style={{ borderColor: "#2a2218" }}
                            />
                          )}
                        </span>
                        <span
                          style={{
                            fontFamily:
                              "'Edu VIC WA NT Beginner', 'Comic Sans MS', cursive",
                            color: "#2a2218",
                          }}
                        >
                          <span
                            className="mr-1 font-semibold"
                            style={{
                              color: "#6b5434",
                              fontFamily: "'Manrope', sans-serif",
                            }}
                          >
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          {opt}
                        </span>

                        {/* flying pen that lands on the active correct option */}
                        {showActive && (
                          <span
                            aria-hidden="true"
                            className="lp-pen-fly pointer-events-none absolute -right-1 -top-4"
                          >
                            <PenGlyph />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* "Checking answers…" badge */}
        <div
          className={cn(
            "relative mt-4 flex items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all duration-300",
            checking
              ? "lp-pop opacity-100"
              : graded
              ? "opacity-0"
              : "opacity-0"
          )}
          style={{
            borderColor: "rgba(139,101,45,0.45)",
            background: "rgba(255,255,255,0.55)",
            color: "#2a2218",
          }}
        >
          <span className="lp-sonic relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ background: "#2a2218" }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: "#2a2218" }}
            />
          </span>
          Checking answers…
        </div>

        {/* final handwritten remark when graded */}
        <div
          className={cn(
            "relative mt-4 flex items-center justify-between gap-3 text-[12px] transition-all duration-500",
            graded ? "lp-remark-in opacity-100" : "opacity-0"
          )}
          style={{ color: "#c42a30" }}
        >
          <span
            style={{
              fontFamily: "'Edu VIC WA NT Beginner', cursive",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Excellent work! 3/3 ✓
          </span>
          <span
            style={{
              fontFamily: "'Edu VIC WA NT Beginner', cursive",
              fontSize: "11.5px",
              opacity: 0.85,
            }}
          >
            — graded in 0.8s
          </span>
        </div>
      </div>

      {/* A+ stamp — slams in when graded */}
      <div
        aria-hidden={!graded}
        className={cn(
          "absolute -right-3 -top-3 flex h-16 w-16 items-center justify-center rounded-full border-[2.5px] transition-all",
          graded ? "lp-stamp-in opacity-100" : "opacity-0"
        )}
        style={{
          borderColor: "#c42a30",
          background: "rgba(255,249,220,0.96)",
          boxShadow: "0 8px 20px rgba(196,42,48,0.25)",
        }}
      >
        <span
          style={{
            color: "#c42a30",
            fontFamily: "'Edu VIC WA NT Beginner', cursive",
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1,
          }}
        >
          A+
        </span>
      </div>
    </div>
  );
};

/* Tiny pen glyph used for the "student is picking an answer" flourish */
const PenGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="#2a2218"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: "rotate(14deg)" }}
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="1.5" fill="#2a2218" />
  </svg>
);


/* =====================================================================
 * SHOWCASE — alternating feature+visual rows
 * ==================================================================== */
const Showcase = () => {
  const ref1 = useReveal();
  const ref2 = useReveal();
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl space-y-24 px-5 sm:px-8">
        {/* Row 1: chat */}
        <div
          ref={ref1}
          className="lp-reveal grid items-center gap-10 lg:grid-cols-2"
        >
          <div className="text-center lg:text-left">
            <h3
              className="text-[28px] font-bold leading-tight tracking-tight text-black sm:text-[34px]"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              Talk to the smartest model for the job.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-zinc-600 lg:mx-0">
              Gemini for multimodal, Claude for long reasoning, GPT for nuance,
              Kimi for long context. Hot-swap with a click — no new accounts,
              no copy-paste.
            </p>
            <ul className="mx-auto mt-5 inline-block space-y-2.5 text-left lg:mx-0 lg:block">
              {[
                "Attach PDFs or images inline",
                "Keep conversations, drop the ones you don't need",
                "Copy, regenerate, thumbs-up in one keystroke",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-zinc-700">
                  <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-white">
                    <Check className="h-[10px] w-[10px]" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual — chat mock */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-black px-4 py-2.5 text-[13px] text-white">
                    Explain backpropagation intuitively.
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-[13px]">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Claude Sonnet 4.6
                    </div>
                    Imagine tuning a guitar by ear. You strum, hear it's off,
                    and adjust. Backprop does the same — it strums, measures
                    error, and nudges weights the other way.
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-[12.5px] text-zinc-500">
                    <div className="flex items-end gap-[2px] h-[12px]">
                      <span className="sa-eq-bar" style={{ height: 12 }} />
                      <span className="sa-eq-bar" style={{ height: 12 }} />
                      <span className="sa-eq-bar" style={{ height: 12 }} />
                      <span className="sa-eq-bar" style={{ height: 12 }} />
                    </div>
                    <span className="sa-shimmer-text">Thinking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: MCQ paper (reversed on lg) */}
        <div
          ref={ref2}
          className="lp-reveal grid items-center gap-10 lg:grid-cols-2"
        >
          <div className="order-2 lg:order-1 relative">
            <AnimatedMCQPaper />
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h3
              className="text-[28px] font-bold leading-tight tracking-tight text-black sm:text-[34px]"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              Graded like a real exam. Handwritten, even.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-zinc-600 lg:mx-0">
              Options appear on paper-textured cards. Wrong picks get a red ✗,
              the right one auto-ticks. Your final sheet lands with a grade and
              a remark in red pen. Nostalgia meets clarity.
            </p>
            <ul className="mx-auto mt-5 inline-block space-y-2.5 text-left lg:mx-0 lg:block">
              {[
                "A+ to F grading with a remark",
                "Best-score memory across retries",
                "Per-question explanation on demand",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 text-[13.5px] text-zinc-700"
                >
                  <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-white">
                    <Check className="h-[10px] w-[10px]" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
 * FAQ
 * ==================================================================== */
const FAQS = [
  {
    q: "Do I need my own API keys?",
    a: "No. The Free tier works out of the box with our included models. You can also bring your own key later if you want absolute control.",
  },
  {
    q: "Is my study material stored anywhere?",
    a: "Your notes and quizzes are encrypted in transit. On the Free plan, history lives locally in your browser. Pro adds end-to-end-encrypted cloud sync.",
  },
  {
    q: "What file types can I upload?",
    a: "PDFs, images (JPG / PNG / HEIC / WEBP), plain text, and direct paste. We extract the learning surface automatically.",
  },
  {
    q: "Which models are included?",
    a: "Free: our smaller-but-smart tier. Pro: every frontier model — Gemini 3.1 Pro, Claude Sonnet 4.6 & Opus 4.5, GPT-5.2, Kimi K2 — switchable mid-chat.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. One click from Settings. You keep access until the end of the current billing period.",
  },
  {
    q: "Is there a student discount?",
    a: "Yes — GitHub Student Developer Pack gives you 12 months of Pro, and we run regular university-specific drops.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const ref = useReveal();
  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          title="Everything you were going to ask."
        />
        <div ref={ref} className="lp-reveal mt-10 space-y-2">
          {FAQS.map((f, i) => {
            const active = open === i;
            return (
              <div
                key={f.q}
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors duration-200",
                  active
                    ? "border-black bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                )}
              >
                <button
                  data-testid={`faq-toggle-${i}`}
                  onClick={() => setOpen(active ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={active}
                >
                  <span className="text-[14.5px] font-semibold text-black">
                    {f.q}
                  </span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                      active
                        ? "border-black bg-black text-white"
                        : "border-zinc-300 text-zinc-600"
                    )}
                  >
                    {active ? (
                      <Minus className="h-[14px] w-[14px]" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-[14px] w-[14px]" strokeWidth={2.5} />
                    )}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    active
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-zinc-600">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
 * FINAL CTA
 * ==================================================================== */
const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-black py-20 text-white sm:py-28">
      <DarkGridBg />
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2
          className="text-[38px] font-bold leading-[1.05] tracking-tight sm:text-[52px]"
          style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
        >
          Ace the next one.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/65">
          Join 8,000+ students turning their notes into mastery. No card, no
          setup, no pressure — just smarter studying.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            data-testid="final-cta-primary"
            onClick={() => navigate("/login")}
            className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-white px-5 text-[14px] font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(255,255,255,0.28)] active:translate-y-0 active:scale-[0.99]"
          >
            <span className="lp-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
            Get started — it's free
            <ArrowRight className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
 * FOOTER
 * ==================================================================== */
const Footer = () => (
  <footer className="border-t border-white/10 bg-black py-14 text-white/65">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
      <div>
        <WordMark onDark />
        <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed">
          Your personal AI study partner. Built for curious minds and clean
          desks.
        </p>
        <div className="mt-5 flex gap-2">
          {[Github, Twitter, Globe].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {[
        {
          t: "Product",
          l: ["Features", "How it works", "Changelog"],
        },
        { t: "Company", l: ["About", "Blog", "Careers", "Contact"] },
        {
          t: "Resources",
          l: ["Help center", "Terms", "Privacy", "Status"],
        },
      ].map((col) => (
        <div key={col.t}>
          <div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/55">
            {col.t}
          </div>
          <ul className="space-y-2">
            {col.l.map((i) => (
              <li key={i}>
                <a
                  href="#"
                  className="text-[13px] text-white/70 transition hover:text-white"
                >
                  {i}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/10 px-5 pt-6 text-[11.5px] text-white/45 sm:px-8 md:flex-row">
      <span>© {new Date().getFullYear()} Study·AI. All rights reserved.</span>
      <span className="inline-flex items-center gap-4">
        <a href="#" className="transition hover:text-white">
          Terms
        </a>
        <a href="#" className="transition hover:text-white">
          Privacy
        </a>
        <a href="#" className="transition hover:text-white">
          Cookies
        </a>
      </span>
    </div>
  </footer>
);

/* =====================================================================
 * ROOT
 * ==================================================================== */
export default function LandingPage() {
  // smooth anchor scroll with offset for fixed nav
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      data-testid="landing-page"
      className="min-h-screen w-full overflow-x-hidden bg-white text-black antialiased"
    >
      <NavBar />
      <Hero />
      <FeaturesGrid />
      <HowItWorks />
      <Showcase />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
