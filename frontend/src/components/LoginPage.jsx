import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Loader2,
  Check,
  ShieldCheck,
  Sparkles,
  Sparkle,
  Infinity as InfinityIcon,
  Command,
} from "lucide-react";

/* ========================================================================
 * LoginPage — Google-only sign-in
 * ------------------------------------------------------------------------
 * Strict black / white / grayscale palette. Split-screen layout with an
 * animated brand panel and a clean, single-CTA Google sign-in card.
 *
 * Usage:
 *   <LoginPage onAuthSuccess={(payload) => ...} onGoogle={(cb) => ...} />
 *
 * If `onGoogle` is not provided, runs in demo mode with a 1.2 s mock flow.
 * ====================================================================== */

const cn = (...cls) => cls.filter(Boolean).join(" ");

/* ---------------- Monochrome "G" glyph (not the official Google logo) ---------------- */
const GoogleGlyph = ({ className = "h-[18px] w-[18px]" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5h5" />
    <path d="M7.5 15.5A6 6 0 0 0 18 12" />
  </svg>
);

/* ---------------- Wordmark ---------------- */
const WordMark = ({ onDark = true, className = "" }) => (
  <div className={cn("inline-flex items-center gap-2", className)}>
    <div
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-lg",
        onDark ? "bg-white text-black" : "bg-black text-white"
      )}
    >
      <Sparkle className="h-4 w-4" strokeWidth={2.4} />
      <span
        className={cn(
          "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2",
          onDark ? "bg-white ring-black" : "bg-black ring-white"
        )}
      />
    </div>
    <span
      className={cn(
        "text-[15px] font-semibold tracking-[0.18em]",
        onDark ? "text-white" : "text-black"
      )}
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      STUDY·AI
    </span>
  </div>
);

/* =====================================================================
 * Brand panel (LEFT, black) — animated dot grid + typewriter tagline
 * ==================================================================== */
const TAGLINES = [
  "Study smarter, not harder.",
  "From notes to mastery in minutes.",
  "Your personal AI study partner.",
  "Turn any topic into a quiz — instantly.",
];

const BrandPanel = () => {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Typewriter
  useEffect(() => {
    const full = TAGLINES[taglineIdx];
    const speed = deleting ? 28 : 55;
    if (!deleting && typed === full) {
      const holdT = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(holdT);
    }
    if (deleting && typed === "") {
      setDeleting(false);
      setTaglineIdx((i) => (i + 1) % TAGLINES.length);
      return;
    }
    const t = setTimeout(() => {
      setTyped((s) =>
        deleting ? full.slice(0, s.length - 1) : full.slice(0, s.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [typed, deleting, taglineIdx]);

  // Mouse-reactive dot grid
  const gridRef = useRef(null);
  const onMove = (e) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty("--mx", `${x * 6}px`);
    el.style.setProperty("--my", `${y * 6}px`);
  };
  const onLeave = () => {
    const el = gridRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  return (
    <div
      ref={gridRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="lp-grid relative hidden overflow-hidden bg-black text-white md:flex md:w-[46%] md:min-w-[460px] md:flex-col"
    >
      {/* animated dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          transform: "translate(calc(var(--mx,0px)), calc(var(--my,0px)))",
          transition: "transform 300ms ease-out",
        }}
      />

      {/* drifting orbs */}
      <div className="lp-orb pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-white/[0.06] blur-3xl" />
      <div className="lp-orb-2 pointer-events-none absolute -bottom-40 -left-16 h-[360px] w-[360px] rounded-full bg-white/[0.04] blur-3xl" />

      {/* diagonal light sweep */}
      <div className="lp-sweep pointer-events-none absolute inset-0" />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-10 lg:p-12">
        <WordMark onDark />

        <div className="max-w-[420px]">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
            <Sparkles className="h-[11px] w-[11px]" />
            AI-native study
          </div>
          <h1
            className="text-[34px] font-bold leading-[1.05] tracking-tight lg:text-[42px]"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            <span className="block min-h-[1.2em]">
              {typed}
              <span className="lp-caret ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-white align-middle" />
            </span>
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-white/65">
            Generate quizzes from any note. Chat with the smartest models.
            Track your mastery — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "8k+", v: "Students" },
              { k: "120k", v: "Quizzes graded" },
              { k: "4.9", v: "Avg rating" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 backdrop-blur-sm"
              >
                <div
                  className="text-[22px] font-bold leading-none tracking-tight"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
                >
                  {s.k}
                </div>
                <div className="mt-1 text-[10.5px] uppercase tracking-[0.14em] text-white/50">
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-[13px] w-[13px]" />
              End-to-end encrypted
            </span>
            <span className="inline-flex items-center gap-1.5">
              <InfinityIcon className="h-[13px] w-[13px]" />
              Free forever tier
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Command className="h-[13px] w-[13px]" />
              Keyboard first
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
 * MAIN: LoginPage (Google-only)
 * ==================================================================== */
export default function LoginPage({ onAuthSuccess, onGoogle }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleGoogle = async () => {
    if (busy || done) return;
    setBusy(true);
    try {
      if (typeof onGoogle === "function") {
        await onGoogle();
      } else {
        // Demo — pretend to call the Google OAuth flow
        await new Promise((r) => setTimeout(r, 1200));
      }
      setDone(true);
      setTimeout(() => {
        setBusy(false);
        onAuthSuccess && onAuthSuccess({ provider: "google" });
      }, 900);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid="login-page"
      className="relative flex min-h-screen w-full overflow-hidden bg-white text-black antialiased"
    >
      {/* Subtle texture for the mobile view */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.04] md:hidden"
        style={{
          backgroundImage:
            "radial-gradient(rgba(17,24,39,1) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <BrandPanel />

      {/* RIGHT: Google sign-in card */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* top bar */}
        <div className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
          <div className="md:hidden">
            <WordMark onDark={false} />
          </div>
          <span className="hidden md:block" />
          <button
            type="button"
            data-testid="help-link"
            className="text-[12.5px] font-semibold text-zinc-500 transition hover:text-black"
          >
            Need help?
          </button>
        </div>

        {/* center card */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            {/* Heading */}
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-700">
                <Sparkle className="h-[11px] w-[11px]" />
                Welcome
              </div>
              <h2
                className="text-[28px] font-bold leading-tight tracking-tight text-black sm:text-[32px]"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                Sign in to continue.
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-600">
                Use your Google account to pick up where you left off — no
                passwords to remember.
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              data-testid="google-signin"
              onClick={handleGoogle}
              disabled={busy || done}
              className={cn(
                "group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl text-[15px] font-semibold transition-all duration-200",
                done
                  ? "bg-black text-white"
                  : busy
                  ? "cursor-progress bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-black hover:-translate-y-0.5 hover:border-black hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] active:translate-y-0 active:scale-[0.99]"
              )}
            >
              {/* shine sweep on idle */}
              {!busy && !done && (
                <span className="lp-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
              )}

              {done ? (
                <span className="lp-pop inline-flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                    <Check className="h-[14px] w-[14px]" strokeWidth={3.5} />
                  </span>
                  Signed in successfully
                </span>
              ) : busy ? (
                <>
                  <Loader2 className="h-[17px] w-[17px] animate-spin" />
                  Redirecting to Google…
                </>
              ) : (
                <>
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300",
                      "group-hover:rotate-[360deg]"
                    )}
                  >
                    <GoogleGlyph className="h-[16px] w-[16px]" />
                  </span>
                  Continue with Google
                  <ArrowRight className="h-[16px] w-[16px] transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* meta row */}
            <div className="mt-5 flex items-center justify-center gap-4 text-[11.5px] text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-[12px] w-[12px]" />
                OAuth 2.0 · Encrypted
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-300" />
              <span>One-click, no password</span>
            </div>

            {/* Legal */}
            <p className="mt-10 text-center text-[11.5px] leading-relaxed text-zinc-500">
              By continuing you agree to our{" "}
              <a
                href="#terms"
                className="font-semibold text-black underline-offset-2 hover:underline"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#privacy"
                className="font-semibold text-black underline-offset-2 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>

            <p className="mt-3 text-center text-[12px] text-zinc-500">
              More sign-in options coming soon.
            </p>
          </div>
        </div>

        {/* Mobile footer */}
        <div className="flex items-center justify-center gap-4 px-5 pb-6 text-[11px] text-zinc-500 sm:px-8 md:hidden">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-[11px] w-[11px]" /> Secure
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-300" />
          <span>Free forever tier</span>
        </div>
      </div>
    </div>
  );
}
