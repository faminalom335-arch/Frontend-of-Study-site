import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Github,
  KeyRound,
  X,
  ShieldCheck,
  Sparkles,
  Sparkle,
  Infinity as InfinityIcon,
  Command,
} from "lucide-react";

/* ========================================================================
 * LoginPage
 * ------------------------------------------------------------------------
 * A modern, smart, and interactive login experience built with strict
 * black / white / grayscale palette and zero raw primary colors.
 *
 * Features:
 *   • Split-screen layout (black brand hero ↔ white auth form)
 *   • Sign In / Sign Up tab switcher with sliding indicator
 *   • Floating-label inputs with live validation + success ticks
 *   • Show/hide password, caps-lock warning, password strength meter
 *   • Social sign-in buttons (monochrome, no brand colors)
 *   • Remember me + Forgot password modal (email + code flow UI)
 *   • Shake-on-error feedback, animated submit spinner + checkmark
 *   • Mouse-reactive dot-grid background on the brand panel
 *   • Rotating typewriter tagline
 *   • Fully keyboard-accessible & reduced-motion aware
 *
 * Drop-in reusable — pass your own `onSubmit` handler to wire to any backend.
 * ====================================================================== */

/* ---------- tiny util ---------- */
const cn = (...cls) => cls.filter(Boolean).join(" ");
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- monochrome brand glyphs (not trademark logos) ---------- */
const GoogleGlyph = ({ className = "h-[16px] w-[16px]" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5h5" />
    <path d="M7.5 15.5A6 6 0 0 0 18 12" />
  </svg>
);

const AppleGlyph = ({ className = "h-[16px] w-[16px]" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.365 1.43c0 1.14-.43 2.23-1.15 3.04-.79.9-2.06 1.6-3.12 1.5-.13-1.12.44-2.29 1.15-3.04.77-.82 2.1-1.44 3.12-1.5zm3.58 17.25c-.64 1.48-.95 2.13-1.77 3.43-1.15 1.82-2.77 4.09-4.77 4.1-1.78.02-2.24-1.16-4.66-1.14-2.42.01-2.93 1.16-4.71 1.14-2-.02-3.54-2.07-4.69-3.89C-2.21 19.2-2.61 13.98 0 10.84c1.12-1.35 3.17-2.26 5.04-2.26 1.93 0 3.15 1.06 4.75 1.06 1.55 0 2.5-1.06 4.73-1.06 1.67 0 3.45.92 4.7 2.51-4.14 2.27-3.47 8.19 1.72 9.59z" transform="translate(2.5,-.5)" />
  </svg>
);

const WordMark = ({ className = "" }) => (
  <div className={cn("inline-flex items-center gap-2", className)}>
    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
      <Sparkle className="h-4 w-4" strokeWidth={2.4} />
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white ring-2 ring-black" />
    </div>
    <span
      className="text-[15px] font-semibold tracking-[0.18em] text-white"
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      STUDY·AI
    </span>
  </div>
);

/* =====================================================================
 * Floating-Label Input
 * Smart behaviours:
 *   • Label floats up on focus or when a value is present
 *   • Optional right-side icon slot (used for the show/hide password eye)
 *   • Success tick when `valid === true`
 *   • Error state: dark shake + error message underneath
 * ==================================================================== */
const FloatingInput = ({
  id,
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  onKeyDown,
  autoComplete,
  right,
  valid,
  error,
  disabled,
  testId,
  autoFocus,
}) => {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;
  const active = focused || filled;

  return (
    <div className="group">
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-white transition-all duration-200",
          error
            ? "border-black shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
            : focused
            ? "border-black shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
            : "border-zinc-300 hover:border-zinc-500",
          disabled && "opacity-60"
        )}
      >
        {Icon && (
          <span
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors duration-200",
              active && "text-black"
            )}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
        )}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-10 origin-left transition-all duration-200 ease-out",
            active
              ? "top-1.5 translate-y-0 scale-[0.78] text-[12px] font-semibold text-black"
              : "top-1/2 -translate-y-1/2 text-[14px] font-medium text-zinc-500"
          )}
        >
          {label}
        </label>
        <input
          id={id}
          data-testid={testId}
          type={type}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "peer w-full bg-transparent pl-10 pr-11 pt-5 pb-1.5 text-[14.5px] font-medium text-black outline-none placeholder:text-transparent",
            disabled && "cursor-not-allowed"
          )}
          placeholder={label}
        />
        {/* Right slot: success tick OR custom (e.g. eye icon) */}
        <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {valid && !right && (
            <span
              data-testid={`${testId}-valid`}
              className="lp-pop flex h-6 w-6 items-center justify-center rounded-full bg-black text-white"
              aria-label="Valid"
            >
              <Check className="h-[12px] w-[12px]" strokeWidth={3} />
            </span>
          )}
          {right}
        </div>
      </div>
      {error && (
        <div
          data-testid={`${testId}-error`}
          className="mt-1.5 flex items-center gap-1.5 px-1 text-[12px] font-medium text-black"
        >
          <AlertCircle className="h-[13px] w-[13px]" strokeWidth={2.5} />
          {error}
        </div>
      )}
    </div>
  );
};

/* =====================================================================
 * Password strength meter — 0 (empty) → 4 (excellent)
 * ==================================================================== */
const scorePassword = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (pw.length >= 14) score = Math.min(4, score + 1);
  return Math.min(4, score);
};

const STRENGTH_META = [
  { label: "Too short", tone: "bg-zinc-300" },
  { label: "Weak", tone: "bg-zinc-500" },
  { label: "Fair", tone: "bg-zinc-700" },
  { label: "Strong", tone: "bg-black" },
  { label: "Excellent", tone: "bg-black" },
];

const PasswordStrength = ({ password }) => {
  const score = scorePassword(password);
  if (!password) return null;
  const meta = STRENGTH_META[score];
  return (
    <div
      data-testid="password-strength"
      className="mt-2 flex items-center gap-2"
    >
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? meta.tone : "bg-zinc-200"
            )}
            style={{ transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
      <span
        data-testid="password-strength-label"
        className="w-[72px] text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-700"
      >
        {meta.label}
      </span>
    </div>
  );
};

/* =====================================================================
 * Tab Switcher with sliding indicator
 * ==================================================================== */
const TabSwitcher = ({ mode, onChange }) => {
  const isSignIn = mode === "signin";
  return (
    <div className="relative inline-flex w-full items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1">
      <div
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-black shadow-sm transition-all duration-300 ease-out",
          isSignIn ? "left-1" : "left-[calc(50%+0px)]"
        )}
      />
      {[
        { id: "signin", label: "Sign in" },
        { id: "signup", label: "Create account" },
      ].map((t) => {
        const active = t.id === mode;
        return (
          <button
            key={t.id}
            data-testid={`tab-${t.id}`}
            onClick={() => onChange(t.id)}
            type="button"
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold transition-colors duration-200",
              active ? "text-white" : "text-zinc-600 hover:text-black"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

/* =====================================================================
 * Social button
 * ==================================================================== */
const SocialButton = ({ icon: Icon, label, onClick, testId }) => (
  <button
    type="button"
    data-testid={testId}
    onClick={onClick}
    className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] active:translate-y-0 active:scale-[0.98]"
  >
    <Icon className="h-[16px] w-[16px]" />
    <span className="hidden sm:inline">{label}</span>
    <span className="absolute inset-y-0 left-0 w-0 bg-black/5 transition-all duration-500 group-hover:w-full" />
  </button>
);

/* =====================================================================
 * Forgot Password Modal (2-step: enter email → enter OTP)
 * ==================================================================== */
const ForgotPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const codeRefs = useRef([]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setEmail("");
      setCode(["", "", "", "", "", ""]);
      setSending(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sendCode = async () => {
    if (!EMAIL_RX.test(email)) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setStep(2);
    setTimeout(() => codeRefs.current[0]?.focus(), 80);
  };

  const onCodeChange = (i, v) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const onCodeKey = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const codeComplete = code.every((c) => c.length === 1);

  return (
    <div
      data-testid="forgot-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="lp-fade absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="lp-pop-in relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between px-6 pt-5">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-black"
                aria-label="Back"
              >
                <ArrowLeft className="h-[15px] w-[15px]" />
              </button>
            )}
            <h3 className="text-[16px] font-bold text-black">
              {step === 1 ? "Reset your password" : "Enter the code"}
            </h3>
          </div>
          <button
            type="button"
            data-testid="forgot-close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-black"
            aria-label="Close"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-3">
          {step === 1 && (
            <>
              <p className="mb-4 text-[13px] leading-relaxed text-zinc-600">
                Enter your account email and we'll send you a 6-digit code to
                reset it.
              </p>
              <FloatingInput
                id="forgot-email"
                testId="forgot-email"
                label="Email address"
                type="email"
                icon={Mail}
                autoComplete="email"
                value={email}
                onChange={setEmail}
                valid={EMAIL_RX.test(email)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendCode();
                }}
              />
              <button
                type="button"
                data-testid="forgot-send"
                onClick={sendCode}
                disabled={!EMAIL_RX.test(email) || sending}
                className={cn(
                  "mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98]",
                  !EMAIL_RX.test(email) || sending
                    ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                    : "bg-black text-white hover:bg-zinc-900"
                )}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send code
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-4 text-[13px] leading-relaxed text-zinc-600">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-black">{email}</span>. It
                expires in 10 minutes.
              </p>
              <div className="flex justify-between gap-2">
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (codeRefs.current[i] = el)}
                    data-testid={`forgot-code-${i}`}
                    value={d}
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(e) => onCodeChange(i, e.target.value)}
                    onKeyDown={(e) => onCodeKey(i, e)}
                    className={cn(
                      "h-12 w-10 rounded-xl border text-center text-[18px] font-semibold text-black outline-none transition-all",
                      d
                        ? "border-black bg-white"
                        : "border-zinc-300 bg-white hover:border-zinc-500",
                      "focus:border-black focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                data-testid="forgot-verify"
                disabled={!codeComplete}
                onClick={onClose}
                className={cn(
                  "mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98]",
                  codeComplete
                    ? "bg-black text-white hover:bg-zinc-900"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400"
                )}
              >
                Verify & continue
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="mt-3 w-full text-center text-[12px] font-semibold text-zinc-500 underline-offset-4 transition hover:text-black hover:underline"
              >
                Resend code in 30s
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
 * Brand panel (LEFT, black) — animated dot grid + typewriter
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

  // Parallax dot grid tracks the cursor for a subtle 3D feel
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
      className="lp-grid relative hidden overflow-hidden bg-black text-white md:flex md:flex-col md:w-[46%] md:min-w-[460px]"
    >
      {/* animated dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          transform:
            "translate(calc(var(--mx,0px)), calc(var(--my,0px)))",
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
        <WordMark />

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
            Generate quizzes from any note. Chat with the smartest models. Track
            your mastery — all in one place.
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
 * MAIN: LoginPage
 * ==================================================================== */
export default function LoginPage({ onAuthSuccess, onSocial, onSubmit }) {
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsLock, setCapsLock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({}); // { name?, email?, password?, form? }
  const [forgotOpen, setForgotOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const cardRef = useRef(null);
  const emailRef = useRef(null);

  // Reset partial errors when the user switches mode
  useEffect(() => {
    setErrors({});
    setDone(false);
  }, [mode]);

  const emailValid = EMAIL_RX.test(email);
  const pwScore = useMemo(() => scorePassword(password), [password]);

  const validate = () => {
    const e = {};
    if (mode === "signup" && name.trim().length < 2) {
      e.name = "Please enter your name.";
    }
    if (!emailValid) e.email = "Please enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (mode === "signup" && pwScore < 2) {
      e.password = "Pick a stronger password (8+ chars, mixed case, digit).";
    }
    return e;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 520);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (busy) return;
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      triggerShake();
      return;
    }
    setErrors({});
    setBusy(true);

    try {
      if (typeof onSubmit === "function") {
        await onSubmit({ mode, name, email, password, remember });
      } else {
        // Demo path — pretend to call API
        await new Promise((r) => setTimeout(r, 1400));
      }
      setDone(true);
      setTimeout(() => {
        setBusy(false);
        onAuthSuccess && onAuthSuccess({ mode, email, name });
      }, 900);
    } catch (err) {
      setBusy(false);
      setErrors({
        form:
          (err && err.message) ||
          "Something went wrong. Please try again in a moment.",
      });
      triggerShake();
    }
  };

  const handleSocial = (provider) => {
    if (typeof onSocial === "function") onSocial(provider);
    else {
      // Demo — just flash a loading state
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        setDone(true);
        setTimeout(() => {
          setDone(false);
          onAuthSuccess && onAuthSuccess({ mode: "social", provider });
        }, 800);
      }, 900);
    }
  };

  const onPwKey = (e) => {
    // Caps-lock detection
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  };

  return (
    <div
      data-testid="login-page"
      className="relative flex min-h-screen w-full overflow-hidden bg-white text-black antialiased"
    >
      {/* mobile top texture */}
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

      {/* RIGHT: form panel */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* top-right helper */}
        <div className="flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
          {/* Mobile wordmark */}
          <div className="inline-flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white">
              <Sparkle className="h-[14px] w-[14px]" strokeWidth={2.4} />
            </div>
            <span
              className="text-[13px] font-semibold tracking-[0.18em] text-black"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              STUDY·AI
            </span>
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

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <form
            ref={cardRef}
            onSubmit={handleSubmit}
            className={cn(
              "w-full max-w-[420px] transition-transform",
              shake && "lp-shake"
            )}
            noValidate
          >
            {/* Heading */}
            <div className="mb-6">
              <h2
                className="text-[26px] font-bold leading-tight tracking-tight text-black sm:text-[30px]"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                {mode === "signin"
                  ? "Welcome back."
                  : "Create your account."}
              </h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-zinc-600">
                {mode === "signin"
                  ? "Pick up where you left off."
                  : "Start mastering topics in minutes. No credit card required."}
              </p>
            </div>

            {/* Tabs */}
            <TabSwitcher mode={mode} onChange={setMode} />

            {/* Social row */}
            <div className="mt-5 flex items-stretch gap-2">
              <SocialButton
                testId="social-google"
                icon={GoogleGlyph}
                label="Google"
                onClick={() => handleSocial("google")}
              />
              <SocialButton
                testId="social-github"
                icon={Github}
                label="GitHub"
                onClick={() => handleSocial("github")}
              />
              <SocialButton
                testId="social-apple"
                icon={AppleGlyph}
                label="Apple"
                onClick={() => handleSocial("apple")}
              />
            </div>

            {/* divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                or with email
              </span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            {/* Fields — animate in via mode switch */}
            <div
              key={mode}
              className="lp-swap space-y-3.5"
              data-testid={`form-${mode}`}
            >
              {mode === "signup" && (
                <FloatingInput
                  id="lp-name"
                  testId="input-name"
                  label="Full name"
                  icon={UserIcon}
                  autoComplete="name"
                  value={name}
                  onChange={setName}
                  error={errors.name}
                  valid={name.trim().length >= 2 && !errors.name}
                />
              )}
              <FloatingInput
                id="lp-email"
                testId="input-email"
                label="Email address"
                type="email"
                icon={Mail}
                autoComplete="email"
                value={email}
                onChange={setEmail}
                error={errors.email}
                valid={emailValid && !errors.email}
                autoFocus={mode === "signin"}
              />
              <div>
                <FloatingInput
                  id="lp-password"
                  testId="input-password"
                  label="Password"
                  icon={Lock}
                  type={showPw ? "text" : "password"}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={setPassword}
                  onKeyDown={onPwKey}
                  error={errors.password}
                  right={
                    <button
                      type="button"
                      data-testid="toggle-password"
                      tabIndex={-1}
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                    >
                      {showPw ? (
                        <EyeOff className="h-[15px] w-[15px]" />
                      ) : (
                        <Eye className="h-[15px] w-[15px]" />
                      )}
                    </button>
                  }
                />
                {/* Caps-lock warning */}
                {capsLock && (
                  <div
                    data-testid="capslock-warning"
                    className="lp-pop mt-1.5 flex items-center gap-1.5 px-1 text-[12px] font-medium text-black"
                  >
                    <KeyRound className="h-[13px] w-[13px]" />
                    Caps Lock is on
                  </div>
                )}
                {mode === "signup" && <PasswordStrength password={password} />}
              </div>
            </div>

            {/* Form-level error */}
            {errors.form && (
              <div
                data-testid="form-error"
                className="lp-pop mt-4 flex items-start gap-2 rounded-xl border border-black bg-zinc-50 px-3 py-2 text-[12.5px] font-medium text-black"
              >
                <AlertCircle
                  className="mt-0.5 h-[14px] w-[14px] shrink-0"
                  strokeWidth={2.5}
                />
                {errors.form}
              </div>
            )}

            {/* Remember / Forgot */}
            <div className="mt-4 flex items-center justify-between">
              <label
                data-testid="remember-me"
                className="inline-flex cursor-pointer select-none items-center gap-2 text-[12.5px] font-medium text-zinc-700"
              >
                <span
                  className={cn(
                    "relative flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    remember
                      ? "border-black bg-black"
                      : "border-zinc-300 bg-white group-hover:border-zinc-500"
                  )}
                >
                  {remember && (
                    <Check
                      className="h-[10px] w-[10px] text-white"
                      strokeWidth={3}
                    />
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="sr-only"
                />
                Remember me for 30 days
              </label>

              {mode === "signin" && (
                <button
                  type="button"
                  data-testid="forgot-link"
                  onClick={() => setForgotOpen(true)}
                  className="text-[12.5px] font-semibold text-black underline-offset-4 transition hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              data-testid="submit-button"
              disabled={busy}
              className={cn(
                "group relative mt-5 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-[14px] font-semibold transition-all duration-200",
                done
                  ? "bg-black text-white"
                  : busy
                  ? "cursor-progress bg-zinc-900 text-white"
                  : "bg-black text-white hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] active:translate-y-0 active:scale-[0.99]"
              )}
            >
              {/* shine sweep */}
              {!busy && !done && (
                <span className="lp-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              )}

              {done ? (
                <span className="lp-pop inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black">
                    <Check className="h-[13px] w-[13px]" strokeWidth={3.5} />
                  </span>
                  {mode === "signin" ? "Signed in!" : "Welcome aboard!"}
                </span>
              ) : busy ? (
                <>
                  <Loader2 className="h-[15px] w-[15px] animate-spin" />
                  {mode === "signin"
                    ? "Signing you in..."
                    : "Creating your account..."}
                </>
              ) : (
                <>
                  {mode === "signin" ? "Sign in" : "Create account"}
                  <ArrowRight className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Footer */}
            <p className="mt-5 text-center text-[11.5px] leading-relaxed text-zinc-500">
              {mode === "signup" ? "By creating an account, " : "By continuing, "}
              you agree to our{" "}
              <a href="#terms" className="font-semibold text-black underline-offset-2 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#privacy" className="font-semibold text-black underline-offset-2 hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <p className="mt-3 text-center text-[12.5px] text-zinc-600">
              {mode === "signin" ? "New here? " : "Already have an account? "}
              <button
                type="button"
                data-testid="toggle-mode"
                onClick={() =>
                  setMode((m) => (m === "signin" ? "signup" : "signin"))
                }
                className="font-semibold text-black underline-offset-4 transition hover:underline"
              >
                {mode === "signin" ? "Create an account" : "Sign in instead"}
              </button>
            </p>
          </form>
        </div>

        {/* Mobile footer stats */}
        <div className="flex items-center justify-center gap-4 px-5 pb-6 text-[11px] text-zinc-500 sm:px-8 md:hidden">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-[11px] w-[11px]" /> Secure
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-300" />
          <span>Free forever tier</span>
        </div>
      </div>

      <ForgotPasswordModal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  );
}
