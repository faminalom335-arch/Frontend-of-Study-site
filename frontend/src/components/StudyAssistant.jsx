import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Sparkles,
  Upload,
  ArrowUp,
  FileText,
  Check,
  X,
  Lightbulb,
  MessageSquare,
  Settings,
  Search,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Zap,
  ListChecks,
  MessageCircle,
  ChevronDown,
  Bot,
  User,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Gem,
  Asterisk,
  Atom,
  SlidersHorizontal,
  Database,
  ChevronRight,
  Brain,
  Target,
  Minus,
  Wand2,
  Paperclip,
  Image as ImageIcon,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from "lucide-react";

/* Generic monogram glyph used as a placeholder mark (not a brand reproduction) */
const KMonogram = ({ className = "h-3.5 w-3.5", strokeWidth = 2.2 }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 4v16" />
    <path d="M7 12 L17 4" />
    <path d="M7 12 L17 20" />
  </svg>
);

/**
 * TypeScript interface reference (documented for consumer use):
 *
 * interface QuizQuestion {
 *   question: string;
 *   options: string[];
 *   correctAnswer: string;
 *   explanation: string;
 * }
 */

/* ---------------- Dummy Data ---------------- */

const DUMMY_QUIZ = [
  {
    question:
      "Which data structure uses LIFO (Last In, First Out) ordering for element access?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correctAnswer: "Stack",
    explanation:
      "A Stack follows the LIFO principle — the last element pushed onto the stack is the first one to be popped off. Think of a stack of plates: you always take the top one first. Queues, in contrast, use FIFO (First In, First Out).",
  },
  {
    question:
      "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    correctAnswer: "O(log n)",
    explanation:
      "Binary search repeatedly halves the search interval. After k comparisons, the size of the search space is n/2^k. We stop when the space is 1, giving k = log₂(n). Hence, the complexity is O(log n).",
  },
  {
    question:
      "In React, which hook is used to perform side effects such as data fetching?",
    options: ["useState", "useMemo", "useEffect", "useRef"],
    correctAnswer: "useEffect",
    explanation:
      "useEffect runs after the render is committed to the screen, making it ideal for side effects like data fetching, subscriptions, and DOM mutations. useState handles state, useMemo memoizes values, and useRef persists mutable values across renders.",
  },
  {
    question: "Which of the following is NOT a primary color in the RGB color model?",
    options: ["Red", "Green", "Yellow", "Blue"],
    correctAnswer: "Yellow",
    explanation:
      "The RGB color model uses Red, Green, and Blue as additive primary colors. Yellow is a primary color in subtractive models like CMYK (used in printing), but in RGB, yellow is formed by mixing red and green light.",
  },
  {
    question:
      "What keyword in JavaScript is used to declare a variable whose value cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    correctAnswer: "const",
    explanation:
      "const creates a binding that cannot be reassigned. Note that const does not make objects or arrays immutable — you can still mutate their contents — but the variable itself cannot be reassigned to a new reference.",
  },
];

const DUMMY_RECENT_CHATS = [
  { id: "c1", title: "Explain neural network backpropagation", date: "Today" },
  { id: "c2", title: "Brainstorm startup ideas for students", date: "Today" },
  { id: "c3", title: "Debug my Python recursion function", date: "Yesterday" },
  { id: "c4", title: "Summarize The Great Gatsby", date: "Yesterday" },
  { id: "c5", title: "Essay outline on climate policy", date: "2 days ago" },
  { id: "c6", title: "Calculus integration techniques", date: "4 days ago" },
];

const DUMMY_RECENT_MCQ = [
  { id: "m1", title: "Data Structures — Stacks & Queues", date: "Today" },
  { id: "m2", title: "React Hooks Deep Dive", date: "Today" },
  { id: "m3", title: "Binary Search Algorithms", date: "Yesterday" },
  { id: "m4", title: "Organic Chemistry — Alkanes", date: "Yesterday" },
  { id: "m5", title: "World War II Key Events", date: "2 days ago" },
  { id: "m6", title: "Photosynthesis Fundamentals", date: "1 week ago" },
];

/* ---------------- MCQ Generation Controls ---------------- */
/**
 * Complexity levels — modern, study-focused tiering inspired loosely by
 * Bloom's taxonomy. The backend should map these IDs to its prompting strategy.
 */
const COMPLEXITY_LEVELS = [
  {
    id: "recall",
    label: "Recall",
    description: "Quick fact-check, definitions",
    icon: Lightbulb,
  },
  {
    id: "apply",
    label: "Apply",
    description: "Practical use & worked scenarios",
    icon: Zap,
  },
  {
    id: "analyze",
    label: "Analyze",
    description: "Break it down, compare ideas",
    icon: Brain,
  },
  {
    id: "mastery",
    label: "Mastery",
    description: "Exam-grade, multi-step reasoning",
    icon: Target,
  },
];

/* ===== BACKEND INTEGRATION NOTE — read carefully when wiring the API =====

The MCQ composer collects three generation parameters and forwards them all
to the backend on submit:

  {
    text:          string,        // the user's pasted material (or filename)
    complexity:    "recall" | "apply" | "analyze" | "mastery",
    count:         number,        // user-requested # of MCQs (1..50)
    aiAutoCount:   boolean,       // if true → AI decides the optimal count
  }

Why `aiAutoCount` exists:
  Users will sometimes ask for 20 MCQs from a 2-line paragraph. To avoid the
  AI hallucinating filler questions, this toggle lets the user defer to the
  model's judgment. When `aiAutoCount === true`:
    1. The backend MUST IGNORE the `count` field entirely.
    2. The model picks a reasonable number based on the source's depth.
    3. The response should include the actual `count` used so the UI can
       reflect it back to the user.
  When `aiAutoCount === false`:
    The backend should honor `count` exactly, but is still free to refuse /
    warn the client if the source material is clearly insufficient.

Frontend's job is purely to collect & forward these params — the backend
is the source of truth for what gets generated.
======================================================================= */

const ComplexityPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = COMPLEXITY_LEVELS.find((l) => l.id === value) || COMPLEXITY_LEVELS[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        data-testid="complexity-trigger"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black text-white ring-1 ring-black/10">
          <CurrentIcon className="h-3 w-3" />
        </span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown
          className={cn(
            "h-[14px] w-[14px] text-zinc-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          data-testid="complexity-dropdown"
          className="absolute bottom-full left-0 z-50 mb-2 w-[300px] origin-bottom-left rounded-xl border border-zinc-200 bg-white p-1.5 shadow-[0_12px_40px_rgba(17,24,39,0.12)]"
        >
          <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Complexity
          </div>
          {COMPLEXITY_LEVELS.map((lvl) => {
            const active = lvl.id === value;
            const Icon = lvl.icon;
            return (
              <button
                key={lvl.id}
                data-testid={`complexity-${lvl.id}`}
                onClick={() => {
                  onChange(lvl.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
                  active
                    ? "bg-black text-white"
                    : "text-zinc-800 hover:bg-zinc-100"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1",
                    active
                      ? "bg-white text-black ring-white/30"
                      : "bg-black text-white ring-black/10"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold">
                    {lvl.label}
                  </div>
                  <div
                    className={cn(
                      "mt-0.5 truncate text-[11.5px]",
                      active ? "text-white/75" : "text-zinc-500"
                    )}
                  >
                    {lvl.description}
                  </div>
                </div>
                {active && <Check className="mt-0.5 h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CountStepper = ({ value, onChange, aiAuto, onToggleAiAuto, min = 1, max = 50 }) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-zinc-200 bg-white">
      {/* AI Auto pill (left segment) */}
      <button
        data-testid="ai-auto-toggle"
        onClick={onToggleAiAuto}
        title={
          aiAuto
            ? "AI decides the optimal number of questions"
            : "Let AI decide the number of questions"
        }
        className={cn(
          "flex items-center gap-1.5 px-2.5 text-[12px] font-semibold transition-colors",
          aiAuto
            ? "bg-black text-white"
            : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
        )}
      >
        <Wand2 className="h-[13px] w-[13px]" />
        Auto
      </button>

      <span className="w-px bg-zinc-200" />

      {/* Stepper (right segment) */}
      <div
        className={cn(
          "flex items-center",
          aiAuto && "pointer-events-none opacity-40"
        )}
      >
        <button
          data-testid="count-dec"
          onClick={dec}
          disabled={aiAuto || value <= min}
          className="flex h-full w-7 items-center justify-center text-zinc-600 transition hover:bg-zinc-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Decrease"
        >
          <Minus className="h-[13px] w-[13px]" />
        </button>
        <span
          data-testid="count-value"
          className="flex min-w-[36px] items-center justify-center px-1 text-[13px] font-semibold tabular-nums text-black"
        >
          {aiAuto ? "—" : value}
        </span>
        <button
          data-testid="count-inc"
          onClick={inc}
          disabled={aiAuto || value >= max}
          className="flex h-full w-7 items-center justify-center text-zinc-600 transition hover:bg-zinc-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Increase"
        >
          <Plus className="h-[13px] w-[13px]" />
        </button>
      </div>
    </div>
  );
};

/* ---------------- Settings persistence ---------------- */
const SETTINGS_KEY = "sa.settings.v1";

const DEFAULT_SETTINGS = {
  displayName: "Alex Student",
  email: "",
  defaultModelId: "gemini-3.1-pro",
  sendOnEnter: true, // false → Cmd/Ctrl+Enter sends, Enter inserts newline
};

const loadSettings = () => {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings) => {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
};

/* ---------------- NanoGPT API key (stored separately per user spec) ---------------- */
const API_KEY_STORAGE = "nanoGptApiKey";

const loadApiKey = () => {
  try {
    return window.localStorage.getItem(API_KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

const saveApiKey = (value) => {
  try {
    if (value && value.trim().length > 0) {
      window.localStorage.setItem(API_KEY_STORAGE, value.trim());
    } else {
      window.localStorage.removeItem(API_KEY_STORAGE);
    }
  } catch {
    /* ignore */
  }
};

/* ---------------- Fetch helpers for user's backend ----------------
 * Uses relative `/api/...` paths — compatible with Next.js App Router
 * same-origin deployment. When the frontend is served beside the
 * backend (as the user intends), these calls route correctly.
 */
const API_BASE =
  (typeof window !== "undefined" && window.__STUDY_AI_API_BASE__) || "";

const buildUrl = (path) => `${API_BASE}${path}`;

/** Convert a File to raw base64 (WITHOUT the `data:...;base64,` prefix). */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const commaIdx = result.indexOf(",");
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsDataURL(file);
  });

/** Convert an array of File objects → Gemini-style `inlineData` parts. */
const filesToInlineParts = async (files) => {
  if (!files || files.length === 0) return [];
  const parts = await Promise.all(
    files.map(async (f) => ({
      inlineData: {
        data: await fileToBase64(f),
        mimeType: f.type || "application/octet-stream",
      },
    }))
  );
  return parts;
};

/** POST a quiz generation request to the user's backend. */
const postGenerateQuiz = async ({ text, files, modelId, apiKey }) => {
  const res = await fetch(buildUrl("/api/generate-quiz"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, files, modelId, apiKey }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { status: res.status, ok: res.ok, data };
};

/** GET chat/quiz history from the user's backend. */
const getHistory = async () => {
  try {
    const res = await fetch(buildUrl("/api/history"), { method: "GET" });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
};

/* ---------------- AI Models ---------------- */

// Black & white styling for provider badges (study-friendly)
const PROVIDER_STYLES = {
  Google: "bg-black text-white ring-black/20",
  Anthropic: "bg-black text-white ring-black/20",
  OpenAI: "bg-black text-white ring-black/20",
  Kimi: "bg-black text-white ring-black/20",
};

// Generic abstract icons per provider (NOT official brand logos — placeholders)
const PROVIDER_ICONS = {
  Google: Gem,
  Anthropic: Asterisk,
  OpenAI: Atom,
  Kimi: KMonogram,
};

const ProviderIcon = ({ provider, className = "h-3.5 w-3.5" }) => {
  const Icon = PROVIDER_ICONS[provider];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={2.2} />;
};

const MODELS = [
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    description: "Most capable multimodal reasoning",
    badge: "NEW",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Fast, efficient for everyday tasks",
  },
  {
    id: "claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    description: "Balanced intelligence & speed",
    badge: "NEW",
  },
  {
    id: "claude-opus-4.5",
    name: "Claude Opus 4.5",
    provider: "Anthropic",
    description: "Deep reasoning for complex work",
  },
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    provider: "OpenAI",
    description: "Frontier general-purpose model",
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 mini",
    provider: "OpenAI",
    description: "Cost-efficient & quick",
  },
  {
    id: "kimi-k2",
    name: "Kimi K2",
    provider: "Kimi",
    description: "Long-context Chinese & English",
  },
  {
    id: "kimi-k1.5",
    name: "Kimi K1.5",
    provider: "Kimi",
    description: "Fast responses, broad knowledge",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------------- Model Switcher ---------------- */
const ModelSwitcher = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = MODELS.find((m) => m.id === value) || MODELS[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const grouped = MODELS.reduce((acc, m) => {
    acc[m.provider] = acc[m.provider] || [];
    acc[m.provider].push(m);
    return acc;
  }, {});

  return (
    <div className="relative" ref={ref}>
      <button
        data-testid="model-switcher"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
      >
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md ring-1",
            PROVIDER_STYLES[current.provider]
          )}
        >
          <ProviderIcon provider={current.provider} className="h-3 w-3" />
        </span>
        <span className="max-w-[160px] truncate">{current.name}</span>
        <ChevronDown
          className={cn(
            "h-[14px] w-[14px] text-zinc-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          data-testid="model-dropdown"
          className="absolute bottom-full left-0 z-50 mb-2 w-[340px] origin-bottom-left rounded-xl border border-zinc-200 bg-white p-1.5 shadow-[0_12px_40px_rgba(17,24,39,0.12)]"
        >
          <div className="max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
            {Object.entries(grouped).map(([provider, items]) => (
              <div key={provider} className="mb-1 last:mb-0">
                <div className="flex items-center gap-2 px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded ring-1",
                      PROVIDER_STYLES[provider]
                    )}
                  >
                    <ProviderIcon provider={provider} className="h-2.5 w-2.5" />
                  </span>
                  {provider}
                </div>
                {items.map((m) => {
                  const active = m.id === value;
                  return (
                    <button
                      key={m.id}
                      data-testid={`model-option-${m.id}`}
                      onClick={() => {
                        onChange(m.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
                        active
                          ? "bg-black text-white"
                          : "text-zinc-800 hover:bg-zinc-100"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1",
                          active
                            ? "bg-white text-black ring-white/30"
                            : "bg-black text-white ring-black/10"
                        )}
                      >
                        <ProviderIcon
                          provider={m.provider}
                          className="h-3.5 w-3.5"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-semibold">
                            {m.name}
                          </span>
                          {m.badge && (
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide",
                                active
                                  ? "bg-white/20 text-white"
                                  : "bg-zinc-900 text-white"
                              )}
                            >
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div
                          className={cn(
                            "mt-0.5 truncate text-[11.5px]",
                            active ? "text-white/75" : "text-zinc-500"
                          )}
                        >
                          {m.description}
                        </div>
                      </div>
                      {active && (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Settings Modal ---------------- */
const SETTINGS_TABS = [
  { id: "profile", label: "Profile", Icon: User },
  { id: "apikey", label: "API Key", Icon: KeyRound },
  { id: "preferences", label: "Preferences", Icon: SlidersHorizontal },
  { id: "data", label: "Data", Icon: Database },
];

const SettingsModal = ({
  open,
  onClose,
  settings,
  onSave,
  onClearChats,
  onClearMCQ,
  onResetAll,
  apiKey,
  onSaveApiKey,
}) => {
  const [tab, setTab] = useState("profile");
  const [draft, setDraft] = useState(settings);
  const [savedFlash, setSavedFlash] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState(apiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);

  // Re-sync local draft whenever the modal is opened or settings change
  useEffect(() => {
    if (open) {
      setDraft(settings);
      setApiKeyDraft(apiKey || "");
      setTab("profile");
      setSavedFlash(false);
      setShowApiKey(false);
    }
  }, [open, settings, apiKey]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const dirty =
    JSON.stringify(draft) !== JSON.stringify(settings) ||
    (apiKeyDraft || "") !== (apiKey || "");

  const handleSave = () => {
    onSave(draft);
    if ((apiKeyDraft || "") !== (apiKey || "")) {
      onSaveApiKey(apiKeyDraft.trim());
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1400);
  };

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const apiKeyMasked = apiKeyDraft
    ? `${apiKeyDraft.slice(0, 4)}${"•".repeat(
        Math.max(0, Math.min(24, apiKeyDraft.length - 8))
      )}${apiKeyDraft.length > 8 ? apiKeyDraft.slice(-4) : ""}`
    : "";

  return (
    <div
      data-testid="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 sm:px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_30px_80px_rgba(17,24,39,0.18)] sm:flex-row">
        {/* Tabs — horizontal on mobile, vertical on desktop */}
        <div className="flex shrink-0 gap-1 border-b border-zinc-200 bg-zinc-50/60 p-2 sm:w-[180px] sm:flex-col sm:gap-0 sm:border-b-0 sm:border-r sm:p-3">
          <div className="hidden px-2 pt-1 pb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 sm:block">
            Settings
          </div>
          {SETTINGS_TABS.map((t) => {
            const active = tab === t.id;
            const Icon = t.Icon;
            return (
              <button
                key={t.id}
                data-testid={`settings-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors sm:flex-none sm:justify-start",
                  active
                    ? "bg-black text-white"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-black"
                )}
              >
                <Icon className="h-[15px] w-[15px]" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex min-h-[420px] min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 sm:px-6 sm:py-4">
            <h2 className="text-[15px] font-semibold text-black">
              {SETTINGS_TABS.find((t) => t.id === tab)?.label}
            </h2>
            <button
              data-testid="settings-close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-black"
              aria-label="Close"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {tab === "profile" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-zinc-700">
                    Display name
                  </label>
                  <input
                    data-testid="settings-displayName"
                    type="text"
                    value={draft.displayName}
                    maxLength={40}
                    onChange={(e) => update({ displayName: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-black outline-none transition focus:border-zinc-500"
                    placeholder="Your name"
                  />
                  <p className="mt-1 text-[11.5px] text-zinc-500">
                    Shown in the sidebar and used when greeting you.
                  </p>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-zinc-700">
                    Email <span className="font-normal text-zinc-400">(optional)</span>
                  </label>
                  <input
                    data-testid="settings-email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => update({ email: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-black outline-none transition focus:border-zinc-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3">
                  <div className="mb-1 text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500">
                    Avatar preview
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                      {(draft.displayName || "?").trim().charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-medium text-black">
                        {draft.displayName || "Anonymous"}
                      </div>
                      <div className="truncate text-[12px] text-zinc-500">
                        {draft.email || "Free plan"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "apikey" && (
              <div className="space-y-5">
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                    <KeyRound className="h-[14px] w-[14px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-amber-900">
                      NanoGPT API Key required
                    </div>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-amber-800/90">
                      Your key is stored locally in this browser only (under{" "}
                      <code className="rounded bg-amber-100 px-1 py-0.5 text-[11px] text-amber-900">
                        nanoGptApiKey
                      </code>
                      ) and sent with each quiz-generation request. It never
                      leaves your device except to your backend.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="nano-api-key"
                    className="mb-1.5 block text-[12px] font-semibold text-zinc-700"
                  >
                    NanoGPT API Key
                  </label>
                  <div className="relative">
                    <input
                      id="nano-api-key"
                      data-testid="settings-apikey-input"
                      type={showApiKey ? "text" : "password"}
                      value={apiKeyDraft}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(e) => setApiKeyDraft(e.target.value)}
                      placeholder="sk-..."
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pr-20 font-mono text-[13px] text-black outline-none transition focus:border-zinc-500"
                    />
                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
                      <button
                        type="button"
                        data-testid="settings-apikey-toggle"
                        onClick={() => setShowApiKey((v) => !v)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                        aria-label={showApiKey ? "Hide key" : "Show key"}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-[14px] w-[14px]" />
                        ) : (
                          <Eye className="h-[14px] w-[14px]" />
                        )}
                      </button>
                      {apiKeyDraft && (
                        <button
                          type="button"
                          data-testid="settings-apikey-clear"
                          onClick={() => setApiKeyDraft("")}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Clear key"
                          title="Clear key"
                        >
                          <Trash2 className="h-[14px] w-[14px]" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-zinc-500">
                    {apiKeyDraft
                      ? showApiKey
                        ? "Full key shown — hide before sharing your screen."
                        : `Saved: ${apiKeyMasked || "••••••"}`
                      : "No key set. Quiz generation will return a 401 until you add one."}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3">
                  <div className="mb-1 text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500">
                    How it's used
                  </div>
                  <ul className="space-y-1 text-[12px] leading-relaxed text-zinc-600">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                      Attached to every{" "}
                      <code className="rounded bg-zinc-100 px-1 text-[11px] text-zinc-700">
                        POST /api/generate-quiz
                      </code>{" "}
                      request body.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                      Cleared instantly when you hit the trash icon.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                      Never logged or synced across devices.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {tab === "preferences" && (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-zinc-700">
                    Default AI model
                  </label>
                  <select
                    data-testid="settings-defaultModel"
                    value={draft.defaultModelId}
                    onChange={(e) =>
                      update({ defaultModelId: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px] text-black outline-none transition focus:border-zinc-500"
                  >
                    {Object.entries(
                      MODELS.reduce((acc, m) => {
                        acc[m.provider] = acc[m.provider] || [];
                        acc[m.provider].push(m);
                        return acc;
                      }, {})
                    ).map(([provider, items]) => (
                      <optgroup key={provider} label={provider}>
                        {items.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <p className="mt-1 text-[11.5px] text-zinc-500">
                    The model selected by default whenever you open the app.
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-black">
                        Send with Enter
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-zinc-500">
                        {draft.sendOnEnter
                          ? "Press Enter to send. Shift+Enter for a newline."
                          : "Press Cmd/Ctrl + Enter to send. Enter inserts a newline."}
                      </p>
                    </div>
                    <button
                      data-testid="settings-sendOnEnter"
                      role="switch"
                      aria-checked={draft.sendOnEnter}
                      onClick={() =>
                        update({ sendOnEnter: !draft.sendOnEnter })
                      }
                      className={cn(
                        "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
                        draft.sendOnEnter
                          ? "border-black bg-black"
                          : "border-zinc-300 bg-zinc-200"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform",
                          draft.sendOnEnter
                            ? "translate-x-[22px]"
                            : "translate-x-0.5"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "data" && (
              <div className="space-y-3">
                <p className="text-[12.5px] text-zinc-500">
                  All data is stored locally in your browser. Use these tools to
                  clean up.
                </p>

                <button
                  data-testid="settings-clear-chats"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete all chat history? This cannot be undone."
                      )
                    ) {
                      onClearChats();
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  <div>
                    <div className="text-[13.5px] font-semibold text-black">
                      Clear all chats
                    </div>
                    <div className="text-[11.5px] text-zinc-500">
                      Removes every chat from the sidebar.
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                </button>

                <button
                  data-testid="settings-clear-mcq"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete all MCQ history? This cannot be undone."
                      )
                    ) {
                      onClearMCQ();
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  <div>
                    <div className="text-[13.5px] font-semibold text-black">
                      Clear all MCQ sessions
                    </div>
                    <div className="text-[11.5px] text-zinc-500">
                      Removes every quiz from the sidebar.
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                </button>

                <button
                  data-testid="settings-reset-all"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Reset everything (settings + chats + quizzes) to defaults?"
                      )
                    ) {
                      onResetAll();
                      onClose();
                    }
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50/60 px-4 py-3 text-left transition hover:border-red-400 hover:bg-red-50"
                >
                  <div>
                    <div className="text-[13.5px] font-semibold text-red-700">
                      Reset everything
                    </div>
                    <div className="text-[11.5px] text-red-500/80">
                      Restore the app to its initial state.
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-red-400" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-zinc-200 px-5 py-3 sm:px-6">
            <span
              className={cn(
                "text-[12px] font-medium transition-opacity",
                savedFlash ? "text-emerald-600 opacity-100" : "opacity-0"
              )}
            >
              ✓ Saved
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
              >
                Cancel
              </button>
              <button
                data-testid="settings-save"
                onClick={handleSave}
                disabled={!dirty}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                  dirty
                    ? "bg-black text-white hover:bg-zinc-800 active:scale-[0.97]"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400"
                )}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Sidebar ---------------- */
const SectionTabs = ({ section, onChange }) => {
  const tabs = [
    { id: "chat", label: "Chat", Icon: MessageCircle },
    { id: "mcq", label: "MCQ", Icon: ListChecks },
  ];

  return (
    <div className="relative inline-flex items-center rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
      {/* sliding highlight */}
      <div
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-black transition-all duration-300 ease-out",
          section === "chat" ? "left-1" : "left-[calc(50%+0px)]"
        )}
      />
      {tabs.map((t) => {
        const active = section === t.id;
        const Icon = t.Icon;
        return (
          <button
            key={t.id}
            data-testid={`tab-${t.id}`}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-lg px-4 py-1.5 text-[12.5px] font-semibold transition-colors duration-200",
              active ? "text-white" : "text-zinc-600 hover:text-black"
            )}
          >
            <Icon className="h-[14px] w-[14px]" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

const Sidebar = ({
  open,
  onToggle,
  section,
  onSectionChange,
  activeId,
  onSelect,
  onNew,
  recentChats,
  recentMCQ,
  onDelete,
  displayName,
  onOpenSettings,
}) => {
  const [query, setQuery] = useState("");
  const pool = section === "chat" ? recentChats : recentMCQ;
  const filtered = pool.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  const newLabel = section === "chat" ? "New Chat" : "New Quiz";
  const recentLabel = section === "chat" ? "Recent Chats" : "Recent Quizzes";

  return (
    <>
      {/* Mobile backdrop — visible only on small screens when drawer is open */}
      {open && (
        <div
          data-testid="sidebar-backdrop"
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px] sm:hidden"
        />
      )}

      <aside
        data-testid="sidebar"
        className={cn(
          "h-screen shrink-0 transition-[width,transform] duration-300 ease-out",
          // Mobile: fixed overlay drawer (always 280px wide, slides in/out)
          "fixed inset-y-0 left-0 z-40 w-[280px]",
          open ? "translate-x-0" : "-translate-x-full",
          // Desktop: in-flow, width animates between 280 and 68
          "sm:relative sm:translate-x-0",
          open ? "sm:w-[280px]" : "sm:w-[68px]"
        )}
      >
      {/* Glass surface on white */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-white/70 backdrop-blur-2xl backdrop-saturate-150",
          "border-r border-zinc-200/80",
          "shadow-[inset_-1px_0_0_rgba(255,255,255,0.8)]"
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent" />

      <div className="relative flex h-full flex-col">
        {/* Header (toggle only, brand removed per spec) */}
        <div
          className={cn(
            "flex items-center px-3 pb-3 pt-4",
            open ? "justify-end" : "justify-center"
          )}
        >
          <button
            data-testid="sidebar-toggle"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-black/5 hover:text-black"
            aria-label="Toggle sidebar"
          >
            {open ? (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {/* Section tabs moved to top bar — kept here as a spacer */}

        {/* New button */}
        <div className="mt-3 px-3">
          <button
            data-testid="new-button"
            onClick={onNew}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
              "bg-black text-white hover:bg-zinc-800 shadow-sm",
              !open && "justify-center px-0"
            )}
          >
            <Plus className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            {open && <span className="truncate">{newLabel}</span>}
          </button>
        </div>

        {/* Search */}
        {open && (
          <div className="mt-3 px-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                data-testid="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  section === "chat" ? "Search chats..." : "Search quizzes..."
                }
                className="w-full rounded-lg bg-white/80 py-2 pl-9 pr-3 text-sm text-black placeholder:text-zinc-400 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-black/20"
              />
            </div>
          </div>
        )}

        {/* Recents */}
        <div className="mt-4 flex-1 overflow-hidden">
          {open && (
            <div className="px-5 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              {recentLabel}
            </div>
          )}
          <div className="h-full overflow-y-auto px-2 pb-4 [scrollbar-width:thin]">
            <ul className="space-y-0.5">
              {filtered.map((item) => (
                <li key={item.id}>
                  <div
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                      activeId === item.id
                        ? "bg-black/[0.06] text-black"
                        : "text-zinc-600 hover:bg-black/[0.04] hover:text-black",
                      !open && "justify-center px-0"
                    )}
                  >
                    <button
                      data-testid={`recent-item-${item.id}`}
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-3 text-left",
                        !open && "justify-center"
                      )}
                      title={item.title}
                    >
                      <MessageSquare className="h-[15px] w-[15px] shrink-0" />
                      {open && (
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-[13px] font-medium">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {item.date}
                          </span>
                        </div>
                      )}
                    </button>
                    {open && (
                      <button
                        data-testid={`delete-item-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 className="h-[14px] w-[14px]" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
              {open && filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-xs text-zinc-500">
                  No {section === "chat" ? "chats" : "quizzes"} found
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200/80 p-3">
          <button
            data-testid="open-settings"
            onClick={onOpenSettings}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-black/[0.04] hover:text-black",
              !open && "justify-center px-0"
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
              {(displayName || "?").trim().charAt(0).toUpperCase() || "?"}
            </div>
            {open && (
              <div className="flex min-w-0 flex-1 flex-col text-left">
                <span className="truncate text-[13px] font-medium text-black">
                  {displayName || "Anonymous"}
                </span>
                <span className="text-[11px] text-zinc-500">Free plan</span>
              </div>
            )}
            {open && <Settings className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};

/* ---------------- MCQ Card (paper style) ---------------- */
const MCQCard = ({ q, index, selected, onSelect }) => {
  const answered = selected !== null && selected !== undefined;

  return (
    <div
      data-testid={`mcq-card-${index}`}
      className="group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-6"
      style={{
        background:
          "linear-gradient(180deg, #fbf4de 0%, #f4ead0 60%, #eeddb6 100%)",
        borderColor: "#c7ad78",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(90,60,20,0.06), 0 10px 28px rgba(120,85,30,0.10)",
      }}
    >
      {/* Faint ruled lines — mimics exam paper */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(139,101,45,0.18) 27px, rgba(139,101,45,0.18) 28px)",
        }}
      />
      {/* Warm inner glow on the left edge — like a paper fold shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-8"
        style={{
          background:
            "linear-gradient(90deg, rgba(139,101,45,0.10), transparent)",
        }}
      />

      {/* Question header */}
      <div className="relative mb-5 flex items-start gap-3">
        <div
          className="flex h-8 min-w-[32px] shrink-0 items-center justify-center rounded-md px-2 text-[12px] font-semibold"
          style={{
            background: "#2a2218",
            color: "#fbf4de",
            boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset",
          }}
        >
          Q{index + 1}
        </div>
        <h3
          className="flex-1 text-[15px] leading-relaxed md:text-[17px]"
          style={{
            color: "#2a2218",
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontWeight: 650,
            letterSpacing: "-0.005em",
          }}
        >
          {q.question}
        </h3>
        <span
          data-testid={`mcq-${index}-mark`}
          className="ml-2 inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-semibold"
          style={{
            background: "#fff9e8",
            borderColor: "#c7ad78",
            color: "#6b5434",
          }}
          title="This question is worth 1 point"
        >
          <Target className="h-[10px] w-[10px]" />
          1 pt
        </span>
      </div>

      {/* Options */}
      <div className="relative grid gap-2 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === q.correctAnswer;
          // Tick-box states:
          //   - unanswered             → empty box
          //   - user picked & correct  → black tick
          //   - user picked & wrong    → red cross
          //   - user picked wrong AND this is the right one → auto black tick
          const showTick = answered && isCorrect; // correct answer always gets a tick once answered
          const showCross = answered && isSelected && !isCorrect;

          return (
            <button
              key={i}
              data-testid={`mcq-${index}-option-${i}`}
              disabled={answered}
              onClick={() => onSelect(opt)}
              className={cn(
                "group/opt relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-[13.5px] transition-all duration-200",
                !answered &&
                  "hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(120,85,30,0.15)]",
                answered && !isSelected && !isCorrect && "opacity-55"
              )}
              style={{
                borderColor: showCross
                  ? "#b23939"
                  : showTick
                  ? "#2a2218"
                  : "rgba(139,101,45,0.35)",
                background: showCross
                  ? "rgba(223,92,92,0.08)"
                  : showTick
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.35)",
                color: "#2a2218",
                fontFamily: "'Edu VIC WA NT Beginner', 'Comic Sans MS', cursive",
                fontWeight: 500,
                fontSize: "15px",
                lineHeight: "1.4",
              }}
            >
              {/* Tick-box */}
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] transition-colors"
                )}
                style={{
                  borderColor: showCross
                    ? "#b23939"
                    : showTick
                    ? "#2a2218"
                    : "#8a7348",
                  background: showTick
                    ? "#fbf4de"
                    : showCross
                    ? "#fff"
                    : "rgba(255,255,255,0.6)",
                }}
              >
                {showTick && (
                  <Check
                    className="h-[14px] w-[14px]"
                    strokeWidth={3}
                    style={{ color: "#2a2218" }}
                  />
                )}
                {showCross && (
                  <X
                    className="h-[14px] w-[14px]"
                    strokeWidth={3}
                    style={{ color: "#b23939" }}
                  />
                )}
              </div>

              {/* Option letter + text */}
              <span className="flex-1 leading-snug">
                <span
                  className="mr-1.5 font-semibold"
                  style={{
                    color: "#6b5434",
                    fontFamily: "'Manrope', system-ui, sans-serif",
                    fontWeight: 650,
                  }}
                >
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      <div
        className={cn(
          "relative grid overflow-hidden transition-all duration-500 ease-out",
          answered
            ? "mt-5 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <div
            data-testid={`mcq-${index}-explanation`}
            className="flex gap-3 rounded-xl border p-4"
            style={{
              background: "rgba(255,249,220,0.75)",
              borderColor: "#c7ad78",
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "rgba(234,179,8,0.18)",
                color: "#8a6a10",
                boxShadow: "inset 0 0 0 1px rgba(234,179,8,0.35)",
              }}
            >
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="mb-1 text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color: "#8a6a10",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontWeight: 700,
                }}
              >
                Explanation
              </div>
              <p
                className="text-[13.5px] leading-relaxed"
                style={{
                  color: "#3a2f1e",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                {q.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Result paper (shown after all MCQs answered) ---------------- */
const GRADE_TABLE = [
  { min: 97, grade: "A+", remark: "Outstanding work!" },
  { min: 93, grade: "A",  remark: "Excellent — very well done." },
  { min: 90, grade: "A-", remark: "Great job, nearly perfect." },
  { min: 87, grade: "B+", remark: "Strong performance." },
  { min: 83, grade: "B",  remark: "Solid effort, keep it up." },
  { min: 80, grade: "B-", remark: "Good attempt — a bit more to polish." },
  { min: 77, grade: "C+", remark: "Decent, keep practicing." },
  { min: 73, grade: "C",  remark: "Room to improve — you can do it." },
  { min: 70, grade: "C-", remark: "Needs more review." },
  { min: 67, grade: "D+", remark: "Revise the basics and try again." },
  { min: 63, grade: "D",  remark: "Keep at it — review and retry." },
  { min: 60, grade: "D-", remark: "Don't give up — practice helps." },
  { min: 0,  grade: "F",  remark: "Review the material and try once more." },
];

const gradeFor = (pct) => GRADE_TABLE.find((g) => pct >= g.min) || GRADE_TABLE[GRADE_TABLE.length - 1];

const RED_PEN = "#c42a30";
const HAND_FONT = "'Edu VIC WA NT Beginner', 'Comic Sans MS', cursive";

/* ---------- Best-score memory (per quiz) ----------
 * Stored in localStorage under `sa.bestscores.v1`. Keyed by quiz title + total
 * so different quizzes never collide. Backend can replace this with a real
 * per-user leaderboard later — the public shape is preserved.
 */
const BEST_SCORES_KEY = "sa.bestscores.v1";

const loadBestScores = () => {
  try {
    const raw = window.localStorage.getItem(BEST_SCORES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const saveBestScores = (obj) => {
  try {
    window.localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(obj));
  } catch {
    /* ignore */
  }
};

const quizKeyOf = (title, total) => `${(title || "quiz").trim()}::${total}`;

const QuizResult = ({ correct, total, onRetry, onClose, title }) => {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const { grade, remark } = gradeFor(pct);
  const dateStr = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  /* Compare against prior best & persist. Computed once per popup mount.
   * Guarded with a ref so React 18 StrictMode's double effect-invoke in dev
   * doesn't double-count attempts or clobber the comparison. */
  const [compare, setCompare] = useState(null);
  const persistedRef = useRef(false);
  useEffect(() => {
    if (persistedRef.current) return;
    persistedRef.current = true;

    const all = loadBestScores();
    const key = quizKeyOf(title, total);
    const prior = all[key];
    const attemptsNow = (prior?.attempts || 0) + 1;

    let status;
    if (!prior) status = "first";
    else if (correct > prior.bestCorrect) status = "new-best";
    else if (correct === prior.bestCorrect) status = "matched";
    else status = "below";

    setCompare({
      status,
      attempts: attemptsNow,
      priorBest: prior
        ? {
            bestCorrect: prior.bestCorrect,
            bestGrade: prior.bestGrade,
            bestPct: prior.bestPct,
          }
        : null,
      delta: prior ? correct - prior.bestCorrect : null,
    });

    // Persist: keep the best-ever, but always increment attempts
    const shouldUpdateBest = !prior || correct > prior.bestCorrect;
    all[key] = {
      bestCorrect: shouldUpdateBest ? correct : prior.bestCorrect,
      bestPct: shouldUpdateBest ? pct : prior.bestPct,
      bestGrade: shouldUpdateBest ? grade : prior.bestGrade,
      attempts: attemptsNow,
      lastAt: new Date().toISOString(),
    };
    saveBestScores(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-testid="quiz-result"
      className="relative mb-5 overflow-hidden rounded-2xl border p-5 sm:p-7"
      style={{
        background:
          "linear-gradient(180deg, #fbf4de 0%, #f4ead0 60%, #eeddb6 100%)",
        borderColor: "#c7ad78",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(90,60,20,0.06), 0 10px 28px rgba(120,85,30,0.12)",
      }}
    >
      {/* Ruled lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(139,101,45,0.18) 27px, rgba(139,101,45,0.18) 28px)",
        }}
      />
      {/* Left-edge fold shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-8"
        style={{
          background:
            "linear-gradient(90deg, rgba(139,101,45,0.10), transparent)",
        }}
      />

      {/* New-best stamp (corner sticker style) */}
      {compare?.status === "new-best" && (
        <div
          data-testid="new-best-stamp"
          className="sa-stamp-in pointer-events-none absolute right-3 top-3 z-10 sm:right-4 sm:top-4"
        >
          <div
            className="flex flex-col items-center justify-center rounded-full px-3 py-2 text-center"
            style={{
              border: `2.5px solid ${RED_PEN}`,
              color: RED_PEN,
              background: "rgba(255,249,220,0.92)",
              fontFamily: HAND_FONT,
              fontWeight: 700,
              lineHeight: 1,
              boxShadow: "0 4px 12px rgba(196,42,48,0.22)",
            }}
          >
            <span style={{ fontSize: "11px", letterSpacing: "0.1em" }}>★ NEW ★</span>
            <span style={{ fontSize: "18px", marginTop: 2 }}>BEST!</span>
          </div>
        </div>
      )}

      {/* Top row: label + retry */}
      <div className="relative mb-4 flex items-start justify-between">
        <div>
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: "#8a6a10",
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontWeight: 700,
            }}
          >
            Result sheet
          </div>
          <div
            className="mt-1 text-[11.5px]"
            style={{
              color: "#8a7348",
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}
          >
            Graded on {dateStr}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            data-testid="quiz-retry"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: "#c7ad78",
              background: "rgba(255,255,255,0.55)",
              color: "#3a2f1e",
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontWeight: 650,
            }}
          >
            <RefreshCw className="h-[13px] w-[13px]" />
            Retry
          </button>
          {onClose && (
            <button
              data-testid="quiz-result-close"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:-translate-y-0.5"
              style={{
                borderColor: "#c7ad78",
                background: "rgba(255,255,255,0.55)",
                color: "#3a2f1e",
              }}
            >
              <X className="h-[15px] w-[15px]" />
            </button>
          )}
        </div>
      </div>

      {/* Main grade row */}
      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
        {/* Big grade inside hand-drawn red circle */}
        <div className="relative flex h-[128px] w-[128px] shrink-0 items-center justify-center self-center sm:self-auto">
          {/* Hand-drawn double ellipse */}
          <svg
            viewBox="0 0 128 128"
            className="absolute inset-0"
            aria-hidden="true"
          >
            <ellipse
              cx="64"
              cy="64"
              rx="56"
              ry="52"
              fill="none"
              stroke={RED_PEN}
              strokeWidth="2.4"
              strokeLinecap="round"
              transform="rotate(-6 64 64)"
              style={{ opacity: 0.92 }}
            />
            <ellipse
              cx="64"
              cy="64"
              rx="54"
              ry="50"
              fill="none"
              stroke={RED_PEN}
              strokeWidth="1.6"
              strokeLinecap="round"
              transform="rotate(-2 64 64)"
              style={{ opacity: 0.55 }}
            />
          </svg>
          <span
            data-testid="quiz-grade"
            style={{
              color: RED_PEN,
              fontFamily: HAND_FONT,
              fontWeight: 700,
              fontSize: grade.length > 1 ? "64px" : "78px",
              lineHeight: 1,
              transform: "rotate(-4deg)",
              textShadow: "0 1px 0 rgba(196,42,48,0.15)",
            }}
          >
            {grade}
          </span>
        </div>

        {/* Score + remark */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className="text-[13px] uppercase tracking-wider"
              style={{
                color: "#6b5434",
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontWeight: 650,
              }}
            >
              Score
            </span>
            <span
              data-testid="quiz-score"
              style={{
                color: RED_PEN,
                fontFamily: HAND_FONT,
                fontWeight: 700,
                fontSize: "40px",
                lineHeight: 1,
                transform: "rotate(-2deg)",
                display: "inline-block",
              }}
            >
              {correct}/{total}
            </span>
            <span
              style={{
                color: RED_PEN,
                fontFamily: HAND_FONT,
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: 1,
                transform: "rotate(-1deg)",
                display: "inline-block",
                opacity: 0.9,
              }}
            >
              ({pct}%)
            </span>
          </div>

          {/* Hand-drawn red underline under the score */}
          <svg
            viewBox="0 0 240 10"
            preserveAspectRatio="none"
            className="mt-1 h-[8px] w-[180px] max-w-full"
            aria-hidden="true"
          >
            <path
              d="M 2 6 Q 60 2, 120 5 T 238 4"
              fill="none"
              stroke={RED_PEN}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: 0.85 }}
            />
          </svg>

          {/* Remark */}
          <p
            data-testid="quiz-remark"
            className="mt-4 leading-snug"
            style={{
              color: RED_PEN,
              fontFamily: HAND_FONT,
              fontWeight: 600,
              fontSize: "19px",
              transform: "rotate(-0.8deg)",
              transformOrigin: "left center",
              display: "inline-block",
            }}
          >
            {remark}
          </p>

          {/* Best-score comparison note (red pen) */}
          {compare && (
            <div
              data-testid="quiz-compare"
              className="mt-3 flex items-center gap-2"
              style={{
                color: RED_PEN,
                fontFamily: HAND_FONT,
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              {compare.status === "first" && (
                <span style={{ transform: "rotate(-0.5deg)", display: "inline-block" }}>
                  First attempt — setting your benchmark.
                </span>
              )}
              {compare.status === "new-best" && (
                <span style={{ transform: "rotate(-0.5deg)", display: "inline-block" }}>
                  New best! <span style={{ fontWeight: 700 }}>+{compare.delta}</span> from your last best · Attempt #{compare.attempts}
                </span>
              )}
              {compare.status === "matched" && (
                <span style={{ transform: "rotate(-0.5deg)", display: "inline-block" }}>
                  = Matched your best · Attempt #{compare.attempts}
                </span>
              )}
              {compare.status === "below" && (
                <span style={{ transform: "rotate(-0.5deg)", display: "inline-block" }}>
                  Prev best: {compare.priorBest.bestCorrect}/{total} ({compare.priorBest.bestGrade}) · Attempt #{compare.attempts}
                </span>
              )}
            </div>
          )}

          {/* Signature line */}
          <div
            className="mt-5 flex items-center justify-between gap-3"
            style={{
              color: "#8a7348",
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}
          >
            <span className="text-[11.5px]">
              Review your answers below ↓
            </span>
            <span
              style={{
                color: RED_PEN,
                fontFamily: HAND_FONT,
                fontWeight: 600,
                fontSize: "16px",
                transform: "rotate(-3deg)",
                display: "inline-block",
              }}
            >
              — Quasar AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Quiz View ---------------- */
const QuizView = ({ questions, answers, onAnswer, onReset, onRetry, title }) => {
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const correct = Object.entries(answers).filter(
    ([idx, ans]) => questions[Number(idx)].correctAnswer === ans
  ).length;
  const completed = total > 0 && answered === total;

  // Result popup state — auto-opens the moment the quiz transitions to complete.
  const [resultOpen, setResultOpen] = useState(false);
  const prevCompletedRef = useRef(false);

  useEffect(() => {
    if (completed && !prevCompletedRef.current) {
      // small delay so the last option's tick animation finishes first
      const t = setTimeout(() => setResultOpen(true), 350);
      prevCompletedRef.current = true;
      return () => clearTimeout(t);
    }
    if (!completed) prevCompletedRef.current = false;
  }, [completed]);

  // ESC closes the popup
  useEffect(() => {
    if (!resultOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setResultOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [resultOpen]);

  const handleRetryFromResult = () => {
    setResultOpen(false);
    onRetry?.();
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-32 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700">
            <Zap className="h-3 w-3 text-amber-500" />
            Generated quiz
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            {title || "Quiz session"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {total} questions · Pick an option to reveal the explanation
          </p>
        </div>
        <button
          data-testid="reset-quiz"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
        >
          <Plus className="h-4 w-4 rotate-45" />
          Clear
        </button>
      </div>

      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Progress:{" "}
            <span className="font-semibold text-black">
              {answered}/{total}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Target className="h-[12px] w-[12px] text-zinc-700" />
            Score:{" "}
            <span className="font-semibold text-black tabular-nums">
              {correct}
            </span>
            <span className="text-zinc-400">/ {total} pts</span>
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <MCQCard
            key={i}
            q={q}
            index={i}
            selected={answers[i]}
            onSelect={(opt) => onAnswer(i, opt)}
          />
        ))}
      </div>

      {/* Floating "View Result" pill — visible after completion if the popup was dismissed */}
      {completed && !resultOpen && (
        <button
          data-testid="view-result"
          onClick={() => setResultOpen(true)}
          className="fixed bottom-24 right-4 z-30 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold shadow-lg transition hover:-translate-y-0.5 sm:bottom-28 sm:right-6"
          style={{
            background: "linear-gradient(180deg, #fbf4de 0%, #eeddb6 100%)",
            borderColor: "#c7ad78",
            color: RED_PEN,
            fontFamily: HAND_FONT,
            fontWeight: 700,
            boxShadow: "0 10px 28px rgba(120,85,30,0.22)",
          }}
        >
          <Target className="h-[14px] w-[14px]" style={{ color: RED_PEN }} />
          View Result
        </button>
      )}

      {/* Result popup */}
      {resultOpen && (
        <div
          data-testid="result-modal"
          className="fixed inset-0 z-50 flex items-center justify-center px-3 py-6 sm:px-4"
        >
          {/* Backdrop */}
          <div
            className="sa-fade-in absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setResultOpen(false)}
          />

          {/* Paper */}
          <div
            className="sa-paper-in relative z-10 w-full max-w-[640px]"
          >
            <QuizResult
              correct={correct}
              total={total}
              onRetry={handleRetryFromResult}
              onClose={() => setResultOpen(false)}
              title={title}
            />
          </div>
        </div>
      )}
    </section>
  );
};

/* ---------------- MCQ Composer (upload-focused) ---------------- */
const MCQComposer = ({ onSubmitText, onUpload, sendOnEnter }) => {  const [text, setText] = useState("");
  const [complexity, setComplexity] = useState("apply");
  const [count, setCount] = useState(5);
  const [aiAutoCount, setAiAutoCount] = useState(false);
  const fileRef = useRef(null);
  const taRef = useRef(null);

  const handleInput = (e) => {
    setText(e.target.value);
    const el = taRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    }
  };

  const buildPayload = () => ({
    text,
    complexity,
    count,
    aiAutoCount,
  });

  const handleSubmit = () => {
    if (text.trim().length === 0) return;
    onSubmitText(buildPayload());
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const handleFile = (file) => {
    if (!file) return;
    onUpload({
      file,
      complexity,
      count,
      aiAutoCount,
    });
  };

  const handleKey = (e) => {
    const isSendCombo = sendOnEnter
      ? e.key === "Enter" && !e.shiftKey
      : e.key === "Enter" && (e.metaKey || e.ctrlKey);
    if (isSendCombo) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="group relative rounded-2xl border border-zinc-200 bg-white/80 p-2 shadow-[0_12px_40px_rgba(17,24,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 focus-within:border-zinc-400 focus-within:shadow-[0_16px_50px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,1)]">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 to-transparent opacity-70" />

        <div className="relative">
          <textarea
            data-testid="mcq-textarea"
            ref={taRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Paste text or upload a file to generate MCQs..."
            className="block max-h-[220px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] leading-relaxed text-black placeholder:text-zinc-400 outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <button
                data-testid="upload-button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
              >
                <Upload className="h-[15px] w-[15px]" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <ComplexityPicker value={complexity} onChange={setComplexity} />
              <CountStepper
                value={count}
                onChange={setCount}
                aiAuto={aiAutoCount}
                onToggleAiAuto={() => setAiAutoCount((v) => !v)}
              />
            </div>

            <button
              data-testid="generate-mcq"
              onClick={handleSubmit}
              disabled={text.trim().length === 0}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                text.trim().length === 0
                  ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                  : "bg-black text-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] hover:bg-zinc-800 active:scale-[0.97]"
              )}
            >
              <span>Generate{aiAutoCount ? "" : ` ${count}`} MCQ{aiAutoCount || count !== 1 ? "s" : ""}</span>
              <ArrowUp className="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-zinc-500">
        Quasar AI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

/* ---------------- Chat Composer (with model switcher + file upload) ---------------- */
const ChatComposer = ({ onSend, model, onModelChange, sendOnEnter, disabled }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]); // File[]
  const taRef = useRef(null);
  const fileRef = useRef(null);

  const handleInput = (e) => {
    setText(e.target.value);
    const el = taRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    }
  };

  const canSend =
    !disabled && (text.trim().length > 0 || files.length > 0);

  const handleSubmit = () => {
    if (!canSend) return;
    onSend(text, files);
    setText("");
    setFiles([]);
    if (taRef.current) taRef.current.style.height = "auto";
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleKey = (e) => {
    const isSendCombo = sendOnEnter
      ? e.key === "Enter" && !e.shiftKey
      : e.key === "Enter" && (e.metaKey || e.ctrlKey);
    if (isSendCombo) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    // Hard cap 4 attachments, total 20MB
    const MAX_FILES = 4;
    const MAX_BYTES = 20 * 1024 * 1024;
    const merged = [...files, ...picked].slice(0, MAX_FILES);
    const totalBytes = merged.reduce((s, f) => s + (f.size || 0), 0);
    if (totalBytes > MAX_BYTES) {
      alert("Attachments exceed 20MB total. Please pick smaller files.");
      return;
    }
    setFiles(merged);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const formatBytes = (n) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="group relative rounded-2xl border border-zinc-200 bg-white/80 p-2 shadow-[0_12px_40px_rgba(17,24,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 focus-within:border-zinc-400 focus-within:shadow-[0_16px_50px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,1)]">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 to-transparent opacity-70" />

        <div className="relative">
          {/* Attached file chips */}
          {files.length > 0 && (
            <div
              data-testid="chat-attachments"
              className="flex flex-wrap gap-1.5 px-2 pb-1 pt-1"
            >
              {files.map((f, i) => {
                const isImage = (f.type || "").startsWith("image/");
                return (
                  <div
                    key={`${f.name}-${i}`}
                    data-testid={`chat-attachment-${i}`}
                    className="group/chip inline-flex max-w-[220px] items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[12px] text-zinc-700 shadow-sm"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-100 text-zinc-600">
                      {isImage ? (
                        <ImageIcon className="h-[12px] w-[12px]" />
                      ) : (
                        <FileText className="h-[12px] w-[12px]" />
                      )}
                    </span>
                    <span className="truncate font-medium" title={f.name}>
                      {f.name}
                    </span>
                    <span className="shrink-0 text-[10.5px] text-zinc-400">
                      {formatBytes(f.size || 0)}
                    </span>
                    <button
                      data-testid={`chat-attachment-remove-${i}`}
                      onClick={() => removeFile(i)}
                      className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <textarea
            data-testid="chat-textarea"
            ref={taRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Ask anything — attach an image or PDF to include context..."
            className="block max-h-[220px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] leading-relaxed text-black placeholder:text-zinc-400 outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                multiple
                className="hidden"
                onChange={handleFilePick}
              />
              <button
                data-testid="chat-attach"
                onClick={() => fileRef.current?.click()}
                title="Attach image or PDF"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[13px] font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
              >
                <Paperclip className="h-[14px] w-[14px]" />
                <span className="hidden sm:inline">Attach</span>
              </button>
              <ModelSwitcher value={model} onChange={onModelChange} />
            </div>

            <button
              data-testid="send-chat"
              onClick={handleSubmit}
              disabled={!canSend}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                !canSend
                  ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                  : "bg-black text-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] hover:bg-zinc-800 active:scale-[0.97]"
              )}
            >
              <span>Send</span>
              <ArrowUp className="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-zinc-500">
        Responses may be inaccurate. Verify important information.
      </p>
    </div>
  );
};

/* ---------------- Chat Messages ---------------- */
const DUMMY_ASSISTANT_REPLY = (userText, modelName) =>
  `Great question! Here's a quick take using ${modelName}:\n\nYou asked — "${userText.slice(
    0,
    120
  )}${userText.length > 120 ? "…" : ""}"\n\nLet me break it down into three parts:\n\n1. Core idea — the underlying concept and why it matters.\n2. A concrete example so it clicks intuitively.\n3. Common pitfalls to watch out for as you apply it.\n\nWant me to dive deeper on any of these, or try a worked example?`;

/* Extract a quiz array from whatever shape the backend returned.
 * Accepts: raw array, {questions: [...]}, {quiz: [...]}, {data: {questions: [...]}}, etc.
 * Returns an array of QuizQuestion-ish objects, or null if nothing looks like a quiz.
 */
const extractQuizQuestions = (payload) => {
  if (!payload) return null;
  const candidates = [
    payload,
    payload.questions,
    payload.quiz,
    payload.mcqs,
    payload.data?.questions,
    payload.data?.quiz,
    payload.result?.questions,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) {
      const looksLikeQuiz = c.every(
        (q) =>
          q &&
          typeof q === "object" &&
          typeof q.question === "string" &&
          Array.isArray(q.options)
      );
      if (looksLikeQuiz) return c;
    }
  }
  return null;
};

const extractAssistantText = (payload) => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  return (
    payload.text ||
    payload.message ||
    payload.response ||
    payload.answer ||
    payload.output ||
    ""
  );
};

/** Inline mini-quiz renderer used inside chat bubbles. */
const InlineQuizBubble = ({ questions, testId = "inline-quiz" }) => {
  const [answers, setAnswers] = useState({});
  const [open, setOpen] = useState({}); // expanded-explanation per index
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const correct = questions.reduce(
    (s, q, i) => s + (answers[i] === q.correctAnswer ? 1 : 0),
    0
  );

  const pick = (i, opt) => {
    if (answers[i] !== undefined) return;
    setAnswers((p) => ({ ...p, [i]: opt }));
    setOpen((p) => ({ ...p, [i]: true }));
  };

  return (
    <div data-testid={testId} className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-[12px] text-zinc-700">
        <ListChecks className="h-[14px] w-[14px] text-zinc-500" />
        <span className="font-semibold">
          {total} question{total === 1 ? "" : "s"} generated
        </span>
        <span className="text-zinc-400">·</span>
        <span>
          Answered{" "}
          <span className="font-semibold text-black tabular-nums">
            {answered}
          </span>
          /{total}
        </span>
        {answered > 0 && (
          <>
            <span className="text-zinc-400">·</span>
            <span>
              Correct{" "}
              <span className="font-semibold text-emerald-700 tabular-nums">
                {correct}
              </span>
              /{answered}
            </span>
          </>
        )}
      </div>

      {questions.map((q, i) => {
        const userPick = answers[i];
        const isAnswered = userPick !== undefined;
        const showExp = !!open[i];
        return (
          <div
            key={i}
            data-testid={`${testId}-q-${i}`}
            className="rounded-xl border border-zinc-200 bg-white p-3"
          >
            <div className="mb-2 flex items-start gap-2">
              <span className="inline-flex h-6 min-w-[26px] items-center justify-center rounded-md bg-black px-1.5 text-[11px] font-semibold text-white">
                Q{i + 1}
              </span>
              <h4 className="flex-1 text-[13.5px] font-semibold leading-snug text-black">
                {q.question}
              </h4>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {(q.options || []).map((opt, oi) => {
                const isSelected = userPick === opt;
                const isCorrect = opt === q.correctAnswer;
                const showTick = isAnswered && isCorrect;
                const showCross = isAnswered && isSelected && !isCorrect;
                return (
                  <button
                    key={oi}
                    data-testid={`${testId}-q-${i}-opt-${oi}`}
                    disabled={isAnswered}
                    onClick={() => pick(i, opt)}
                    className={cn(
                      "group/opt flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[12.5px] transition",
                      !isAnswered &&
                        "border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm",
                      isAnswered &&
                        !isSelected &&
                        !isCorrect &&
                        "border-zinc-200 bg-white opacity-60",
                      showTick && "border-emerald-500 bg-emerald-50/70",
                      showCross && "border-red-400 bg-red-50/70"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px]",
                        showTick
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : showCross
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-zinc-300 bg-white"
                      )}
                    >
                      {showTick && (
                        <Check className="h-[10px] w-[10px]" strokeWidth={3} />
                      )}
                      {showCross && (
                        <X className="h-[10px] w-[10px]" strokeWidth={3} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mr-1 font-semibold text-zinc-500">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
            {isAnswered && q.explanation && (
              <div className="mt-2">
                <button
                  data-testid={`${testId}-q-${i}-toggle`}
                  onClick={() => setOpen((p) => ({ ...p, [i]: !p[i] }))}
                  className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-zinc-600 hover:text-black"
                >
                  <Lightbulb className="h-[12px] w-[12px]" />
                  {showExp ? "Hide explanation" : "Show explanation"}
                  <ChevronDown
                    className={cn(
                      "h-[12px] w-[12px] transition-transform",
                      showExp && "rotate-180"
                    )}
                  />
                </button>
                {showExp && (
                  <p className="mt-1 rounded-md bg-amber-50/70 px-2.5 py-1.5 text-[12px] leading-relaxed text-amber-900 ring-1 ring-amber-200/70">
                    {q.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Error banner rendered inline in the chat stream. */
const ChatErrorBubble = ({ kind, message, onOpenSettings }) => (
  <div
    data-testid={`chat-error-${kind || "generic"}`}
    className="flex gap-3"
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 ring-1 ring-red-200">
      <AlertTriangle className="h-4 w-4" />
    </div>
    <div className="max-w-[88%] rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-[13.5px] leading-relaxed text-red-800 sm:max-w-[80%]">
      <div className="mb-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-red-600">
        {kind === "auth" ? "API key required" : "Request failed"}
      </div>
      <div>{message}</div>
      {kind === "auth" && onOpenSettings && (
        <button
          data-testid="chat-error-open-settings"
          onClick={onOpenSettings}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-[12px] font-semibold text-white transition hover:bg-red-700"
        >
          <KeyRound className="h-[12px] w-[12px]" />
          Open API Key settings
          <ExternalLink className="h-[11px] w-[11px]" />
        </button>
      )}
    </div>
  </div>
);

const ChatMessage = ({ role, content, modelName, modelProvider, files, quiz }) => {
  const isUser = role === "user";
  return (
    <div
      data-testid={`chat-message-${role}`}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white ring-1 ring-black/10">
          {modelProvider ? (
            <ProviderIcon provider={modelProvider} className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
      )}
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed sm:max-w-[80%]",
          isUser
            ? "bg-black text-white"
            : "border border-zinc-200 bg-white text-zinc-800 shadow-sm"
        )}
      >
        {!isUser && modelName && (
          <div className="mb-1 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500">
            {modelProvider && (
              <ProviderIcon
                provider={modelProvider}
                className="h-3 w-3 text-black"
              />
            )}
            {modelName}
          </div>
        )}

        {/* Attached file chips (for user messages) */}
        {isUser && Array.isArray(files) && files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {files.map((f, i) => {
              const isImage = (f.mimeType || "").startsWith("image/");
              return (
                <div
                  key={`${f.name}-${i}`}
                  className="inline-flex max-w-[200px] items-center gap-1.5 rounded-md bg-white/15 px-2 py-1 text-[11.5px] ring-1 ring-white/20"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white/20">
                    {isImage ? (
                      <ImageIcon className="h-[11px] w-[11px]" />
                    ) : (
                      <FileText className="h-[11px] w-[11px]" />
                    )}
                  </span>
                  <span className="truncate" title={f.name}>
                    {f.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {content && <div className="whitespace-pre-wrap">{content}</div>}

        {/* Inline quiz (for assistant messages) */}
        {!isUser && Array.isArray(quiz) && quiz.length > 0 && (
          <div className={cn(content && "mt-3")}>
            <InlineQuizBubble questions={quiz} testId="assistant-inline-quiz" />
          </div>
        )}

        {!isUser && (
          <div className="mt-3 flex items-center gap-1 border-t border-zinc-100 pt-2 text-zinc-400">
            <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-700">
              <Copy className="h-[13px] w-[13px]" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-700">
              <RefreshCw className="h-[13px] w-[13px]" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-700">
              <ThumbsUp className="h-[13px] w-[13px]" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-700">
              <ThumbsDown className="h-[13px] w-[13px]" />
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

const TypingIndicator = ({ modelProvider }) => (
  <div data-testid="typing-indicator" className="flex gap-3">
    {/* Avatar with sonar pulse rings */}
    <div className="relative h-8 w-8 shrink-0">
      <span className="sa-ping-ring" />
      <span className="sa-ping-ring delay-1" />
      <div className="sa-breathe relative flex h-8 w-8 items-center justify-center rounded-full bg-black text-white ring-1 ring-black/10">
        {modelProvider ? (
          <ProviderIcon provider={modelProvider} className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
    </div>

    {/* Animated bubble: EQ bars + shimmering "Thinking" text */}
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-end gap-[3px] h-[18px]">
        <span className="sa-eq-bar" />
        <span className="sa-eq-bar" />
        <span className="sa-eq-bar" />
        <span className="sa-eq-bar" />
        <span className="sa-eq-bar" />
      </div>
      <span className="sa-shimmer-text text-[13px]">Thinking</span>
    </div>
  </div>
);

/* ---------------- Hero (per section) ---------------- */
const CHAT_HEADLINES = [
  "What shall we explore today?",
  "Where shall we begin?",
  "What's on your mind?",
  "Got a question? I've got time.",
  "Ready when you are.",
  "Let's figure something out.",
  "What are you curious about?",
  "Pick a topic — I'll dig in.",
  "Tell me what you're learning.",
  "Got a problem to crack?",
  "What's puzzling you today?",
  "Let's chase a thought.",
  "Ask me anything.",
  "What's the spark?",
  "Throw an idea my way.",
];

const ChatHero = ({ onPick }) => {
  // Pick a fresh headline per mount/refresh
  const [headline] = useState(
    () => CHAT_HEADLINES[Math.floor(Math.random() * CHAT_HEADLINES.length)]
  );
  const prompts = [
    "Explain quantum entanglement simply",
    "Help me draft an email to my professor",
    "Debug this JavaScript closure issue",
    "Summarize the key causes of WWII",
  ];
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 text-center sm:px-6">
      <h1 className="mx-auto max-w-2xl text-[28px] font-semibold leading-[1.15] tracking-tight text-black sm:text-4xl md:text-5xl">
        {headline}
      </h1>
      <div className="mt-8 flex flex-wrap justify-center gap-2 md:mt-10">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[12.5px] text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

const MCQ_HEADLINES = [
  "What shall we quiz on today?",
  "Pick a topic — I'll bring the questions.",
  "Got something to study? Drop it in.",
  "Turn study material into mastery.",
  "Test what you know.",
  "What are you preparing for?",
  "Let's build your next quiz.",
  "Ready for a knowledge check?",
  "Throw a topic my way.",
  "Where shall we sharpen up?",
];

const MCQHero = () => {
  const [headline] = useState(
    () => MCQ_HEADLINES[Math.floor(Math.random() * MCQ_HEADLINES.length)]
  );
  const suggestions = [
    "Quiz me on photosynthesis",
    "Python OOP fundamentals",
    "World War II timeline",
    "Linear algebra basics",
  ];
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 text-center sm:px-6">
      <h1 className="mx-auto max-w-2xl text-[28px] font-semibold leading-[1.15] tracking-tight text-black sm:text-4xl md:text-5xl">
        {headline}
      </h1>
      <div className="mt-8 flex flex-wrap justify-center gap-2 md:mt-10">
        {suggestions.map((s) => (
          <button
            key={s}
            className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[12.5px] text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Persistence helpers (localStorage) ---------------- */
const STORAGE_KEY = "sa.recents.v1";

const loadRecents = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveRecents = (chats, mcq) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ chats, mcq })
    );
  } catch {
    /* ignore quota / privacy errors */
  }
};

const truncateTitle = (text, max = 50) => {
  const t = String(text || "").trim();
  if (!t) return "New conversation";
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
};

/* ---------------- Root ---------------- */
export default function StudyAssistant() {
  // Default sidebar: open on >= sm screens, closed on mobile.
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 640;
  });
  const [section, setSection] = useState("chat"); // 'chat' | 'mcq'
  const [activeId, setActiveId] = useState(null);

  // Settings (persisted)
  const [settings, setSettings] = useState(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // NanoGPT API key (stored in localStorage as `nanoGptApiKey`)
  const [apiKey, setApiKey] = useState(() => loadApiKey());
  const handleSaveApiKey = (next) => {
    setApiKey(next || "");
    saveApiKey(next || "");
  };

  // Recent lists hydrated from localStorage so deletes & additions persist.
  // Falls back to dummy data on first ever load.
  const [recentChats, setRecentChats] = useState(() => {
    const saved = loadRecents();
    return saved && Array.isArray(saved.chats) ? saved.chats : DUMMY_RECENT_CHATS;
  });
  const [recentMCQ, setRecentMCQ] = useState(() => {
    const saved = loadRecents();
    return saved && Array.isArray(saved.mcq) ? saved.mcq : DUMMY_RECENT_MCQ;
  });

  // Persist whenever the recent lists change.
  useEffect(() => {
    saveRecents(recentChats, recentMCQ);
  }, [recentChats, recentMCQ]);

  // Pull history from backend on mount (and whenever caller invokes it).
  // Backend returns `[{ id, title, createdAt }]`. Map to our local shape.
  const refreshHistory = async () => {
    const items = await getHistory();
    if (!items) return;
    const formatDate = (iso) => {
      if (!iso) return "";
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const now = new Date();
      const sameDay = d.toDateString() === now.toDateString();
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      const isYesterday = d.toDateString() === yest.toDateString();
      if (sameDay) return "Today";
      if (isYesterday) return "Yesterday";
      const days = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (days < 7) return `${days} days ago`;
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    };
    const mapped = items.map((h) => ({
      id: String(h.id),
      title: h.title || "Untitled",
      date: formatDate(h.createdAt),
      _createdAt: h.createdAt,
    }));
    // Populate both chat & MCQ lists from the same source; backend can
    // expand with a `kind` field later to split them.
    setRecentChats(mapped);
    setRecentMCQ(mapped);
  };

  useEffect(() => {
    refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MCQ state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [activeQuizTitle, setActiveQuizTitle] = useState("");
  const [mcqLoading, setMcqLoading] = useState(false);
  const [mcqError, setMcqError] = useState(null); // { kind, message }

  // Chat state
  const [messages, setMessages] = useState([]); // {role, content, model, provider}
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState(() => {
    const saved = loadSettings();
    return saved.defaultModelId || MODELS[0].id;
  });
  const chatScrollRef = useRef(null);

  const currentModel = MODELS.find((m) => m.id === model) || MODELS[0];

  // Keep selected model in sync with settings.defaultModelId when settings change
  // (only if the user hasn't started chatting in this session)
  useEffect(() => {
    if (messages.length === 0 && !isTyping && settings.defaultModelId) {
      setModel(settings.defaultModelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.defaultModelId]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* --- MCQ handlers ---
   * startQuiz(payload) wires the MCQ composer to the backend's
   * `POST /api/generate-quiz` endpoint. Payload shapes:
   *   { text, complexity, count, aiAutoCount }
   *   { file, complexity, count, aiAutoCount }
   * We pass the generation hints (complexity/count/aiAutoCount) through as
   * structured text appended to the prompt so existing `/api/generate-quiz`
   * contracts don't need to change.
   */
  const startQuiz = async (payload) => {
    const p = payload && typeof payload === "object" ? payload : {};
    const modelId = currentModel.id;
    const apiKey = loadApiKey();

    // Derive prompt text + file list
    const userText = typeof p.text === "string" ? p.text.trim() : "";
    const theFile = p.file || null;

    // Friendly sidebar title
    let title = "New MCQ session";
    if (userText) title = truncateTitle(userText);
    else if (theFile && theFile.name) title = `Quiz from ${theFile.name}`;
    setActiveQuizTitle(title);

    // Auto-create a sidebar entry for this new MCQ session
    if (!activeId) {
      const newId = `m_${Date.now()}`;
      setRecentMCQ((prev) => [
        { id: newId, title, date: "Just now" },
        ...prev,
      ]);
      setActiveId(newId);
    }

    // Compose prompt with generation hints
    const hints = [];
    if (p.complexity) hints.push(`Complexity level: ${p.complexity}.`);
    if (p.aiAutoCount) hints.push("Pick the optimal number of questions yourself.");
    else if (p.count) hints.push(`Generate exactly ${p.count} MCQs.`);
    const hintLine = hints.length > 0 ? `\n\n[${hints.join(" ")}]` : "";
    const promptText = (userText || (theFile ? `Generate an MCQ quiz from the attached file "${theFile.name}".` : "")) + hintLine;

    setQuestions([]);
    setAnswers({});
    setMcqError(null);
    setMcqLoading(true);

    requestAnimationFrame(() => {
      document
        .getElementById("quiz-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    try {
      const fileParts = theFile ? await filesToInlineParts([theFile]) : [];
      const { status, ok, data } = await postGenerateQuiz({
        text: promptText,
        files: fileParts,
        modelId,
        apiKey,
      });

      if (status === 401) {
        setMcqError({
          kind: "auth",
          message:
            "Your NanoGPT API key is missing or invalid. Please add a valid key in Settings → API Key.",
        });
        setMcqLoading(false);
        return;
      }

      if (!ok) {
        const backendMsg =
          (data && (data.error || data.message || data.detail)) ||
          `Request failed with status ${status}.`;
        setMcqError({ kind: "generic", message: String(backendMsg) });
        setMcqLoading(false);
        return;
      }

      const quiz = extractQuizQuestions(data);
      if (!quiz || quiz.length === 0) {
        setMcqError({
          kind: "generic",
          message:
            "The backend did not return any questions. Try rephrasing or use a richer source.",
        });
        setMcqLoading(false);
        return;
      }

      setQuestions(quiz);
      setAnswers({});
      setMcqLoading(false);
      refreshHistory();
    } catch (err) {
      setMcqError({
        kind: "generic",
        message:
          "Couldn't reach the quiz server. Check that your backend is running at /api/generate-quiz.",
      });
      setMcqLoading(false);
    }
  };
  const handleAnswer = (i, opt) => {
    if (answers[i] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [i]: opt }));
  };
  const handleResetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setActiveQuizTitle("");
    setActiveId(null);
    setMcqError(null);
    setMcqLoading(false);
  };

  // Retake the same quiz — keep questions, just clear answers.
  const handleRetryQuiz = () => {
    setAnswers({});
    setMcqError(null);
    requestAnimationFrame(() => {
      document
        .getElementById("quiz-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  /* --- Chat handlers ---
   * Signature: handleSend(text, filesArray)
   * Wires directly to the user's backend at `POST /api/generate-quiz`.
   * Converts attached File objects into Gemini-style inlineData parts,
   * sends { text, files, modelId, apiKey } and gracefully handles
   * 401 auth errors by prompting the user to open Settings → API Key.
   */
  const handleSend = async (text, filesArray) => {
    const textStr = (text || "").toString();
    const incomingFiles = Array.isArray(filesArray) ? filesArray : [];
    if (textStr.trim().length === 0 && incomingFiles.length === 0) return;

    // Auto-create a sidebar entry for this new chat on first send
    if (!activeId) {
      const newId = `c_${Date.now()}`;
      const title =
        truncateTitle(textStr) ||
        (incomingFiles[0] ? `Chat about ${incomingFiles[0].name}` : "New chat");
      setRecentChats((prev) => [
        { id: newId, title, date: "Just now" },
        ...prev,
      ]);
      setActiveId(newId);
    }

    // Build file metadata for the rendered user bubble
    const fileMeta = incomingFiles.map((f) => ({
      name: f.name,
      size: f.size,
      mimeType: f.type || "application/octet-stream",
    }));

    const userMsg = {
      role: "user",
      content: textStr,
      files: fileMeta,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    const modelName = currentModel.name;
    const modelProvider = currentModel.provider;
    const modelId = currentModel.id;

    try {
      // Convert File objects → Gemini inlineData parts
      const fileParts = await filesToInlineParts(incomingFiles);

      const { status, ok, data } = await postGenerateQuiz({
        text: textStr,
        files: fileParts,
        modelId,
        apiKey: loadApiKey(),
      });

      if (status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            role: "error",
            kind: "auth",
            content:
              "Your NanoGPT API key is missing or invalid. Please add a valid key in Settings → API Key to generate quizzes.",
          },
        ]);
        setIsTyping(false);
        return;
      }

      if (!ok) {
        const backendMsg =
          (data && (data.error || data.message || data.detail)) ||
          `Request failed with status ${status}.`;
        setMessages((prev) => [
          ...prev,
          { role: "error", kind: "generic", content: String(backendMsg) },
        ]);
        setIsTyping(false);
        return;
      }

      // Success — try to extract a quiz; fall back to plain text
      const quiz = extractQuizQuestions(data);
      const assistantText = extractAssistantText(data);

      const assistantMsg = {
        role: "assistant",
        content:
          assistantText ||
          (quiz
            ? `Here's a ${quiz.length}-question quiz I put together for you.`
            : ""),
        model: modelName,
        provider: modelProvider,
        quiz: quiz || null,
        raw: !quiz && !assistantText ? data : null,
      };

      // If we got neither quiz nor text, show pretty-printed JSON as fallback
      if (!assistantText && !quiz && data) {
        assistantMsg.content =
          "Received a response but couldn't detect a quiz or text payload. Raw data:\n\n" +
          "```json\n" +
          JSON.stringify(data, null, 2) +
          "\n```";
      }

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      // Refresh sidebar history from backend (non-blocking)
      refreshHistory();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          kind: "generic",
          content:
            "Couldn't reach the quiz server. Check that your backend is running and reachable at /api/generate-quiz.",
        },
      ]);
      setIsTyping(false);
    }
  };
  const handleResetChat = () => {
    setMessages([]);
    setIsTyping(false);
    setActiveId(null);
  };

  /* --- Sidebar events --- */
  // On small screens, auto-close the drawer after the user picks an item or
  // hits the section / new buttons so the content area is immediately visible.
  const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth < 640;

  const handleSectionChange = (s) => {
    setSection(s);
    setActiveId(null);
  };
  const handleNew = () => {
    if (section === "chat") handleResetChat();
    else handleResetQuiz();
    if (isMobile()) setSidebarOpen(false);
  };
  const handleSelect = (id) => {
    setActiveId(id);
    if (section === "chat") {
      setMessages([
        {
          role: "user",
          content: "Can you give me a quick overview of this topic?",
        },
        {
          role: "assistant",
          content: DUMMY_ASSISTANT_REPLY(
            "Quick overview of this topic",
            currentModel.name
          ),
          model: currentModel.name,
          provider: currentModel.provider,
        },
      ]);
    } else {
      setQuestions(DUMMY_QUIZ);
      setAnswers({});
    }
    if (isMobile()) setSidebarOpen(false);
  };

  // Delete a recent item (chat or MCQ depending on section).
  // If we're deleting the currently-open one, also clear its main-pane state.
  const handleDelete = (id) => {
    if (section === "chat") {
      setRecentChats((prev) => prev.filter((c) => c.id !== id));
    } else {
      setRecentMCQ((prev) => prev.filter((c) => c.id !== id));
    }
    if (activeId === id) {
      if (section === "chat") handleResetChat();
      else handleResetQuiz();
    }
  };

  /* --- Settings handlers --- */
  const handleSaveSettings = (next) => {
    setSettings(next);
  };
  const handleClearAllChats = () => {
    setRecentChats([]);
    handleResetChat();
  };
  const handleClearAllMCQ = () => {
    setRecentMCQ([]);
    handleResetQuiz();
  };
  const handleResetAll = () => {
    setSettings(DEFAULT_SETTINGS);
    setRecentChats(DUMMY_RECENT_CHATS);
    setRecentMCQ(DUMMY_RECENT_MCQ);
    handleResetChat();
    handleResetQuiz();
    setModel(DEFAULT_SETTINGS.defaultModelId);
  };

  const hasChat = messages.length > 0 || isTyping;
  const hasQuiz = questions.length > 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black antialiased">
      {/* Subtle dotted texture */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(17,24,39,1) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative z-10 flex h-screen w-full">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          section={section}
          onSectionChange={handleSectionChange}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
          recentChats={recentChats}
          recentMCQ={recentMCQ}
          onDelete={handleDelete}
          displayName={settings.displayName}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main className="relative flex h-screen min-w-0 flex-1 flex-col">
          {/* Floating Chat / MCQ switcher — no full-width header so it won't clash with browser chrome */}
          <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center sm:top-4">
            <div className="pointer-events-auto">
              <SectionTabs section={section} onChange={handleSectionChange} />
            </div>
          </div>

          {/* Mobile-only sidebar trigger — shown when drawer is closed on small screens */}
          {!sidebarOpen && (
            <button
              data-testid="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-400 hover:text-black sm:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          )}

          {/* Scroll area */}
          <div
            ref={chatScrollRef}
            className="relative flex flex-1 flex-col overflow-y-auto"
          >
            {section === "chat" ? (
              <>
                {!hasChat && (
                  <div className="flex flex-1 items-center justify-center px-4 py-8">
                    <ChatHero onPick={handleSend} />
                  </div>
                )}
                {hasChat && (
                  <div className="mx-auto w-full max-w-3xl space-y-5 px-4 pb-24 pt-20 sm:px-6">
                    {messages.map((m, i) =>
                      m.role === "error" ? (
                        <ChatErrorBubble
                          key={i}
                          kind={m.kind}
                          message={m.content}
                          onOpenSettings={() => setSettingsOpen(true)}
                        />
                      ) : (
                        <ChatMessage
                          key={i}
                          role={m.role}
                          content={m.content}
                          modelName={m.model}
                          modelProvider={m.provider}
                          files={m.files}
                          quiz={m.quiz}
                        />
                      )
                    )}
                    {isTyping && (
                      <TypingIndicator modelProvider={currentModel.provider} />
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {!hasQuiz && !mcqLoading && !mcqError && (
                  <div className="flex flex-1 items-center justify-center px-4 py-8">
                    <MCQHero />
                  </div>
                )}
                <div id="quiz-anchor" />
                {mcqLoading && (
                  <div
                    data-testid="mcq-loading"
                    className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-8 sm:px-6"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                    <div className="text-center">
                      <div className="text-[14px] font-semibold text-black">
                        Generating your quiz...
                      </div>
                      <div className="mt-0.5 text-[12px] text-zinc-500">
                        Sending to {currentModel.name} — this usually takes a
                        few seconds.
                      </div>
                    </div>
                  </div>
                )}
                {!mcqLoading && mcqError && (
                  <div
                    data-testid="mcq-error"
                    className="mx-auto w-full max-w-3xl px-4 pt-24 sm:px-6"
                  >
                    <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 ring-1 ring-red-200">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
                          {mcqError.kind === "auth"
                            ? "API key required"
                            : "Couldn't generate quiz"}
                        </div>
                        <p className="mt-0.5 text-[13.5px] leading-relaxed text-red-800">
                          {mcqError.message}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {mcqError.kind === "auth" && (
                            <button
                              data-testid="mcq-error-open-settings"
                              onClick={() => setSettingsOpen(true)}
                              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-1 text-[12px] font-semibold text-white transition hover:bg-red-700"
                            >
                              <KeyRound className="h-[12px] w-[12px]" />
                              Open API Key settings
                            </button>
                          )}
                          <button
                            data-testid="mcq-error-dismiss"
                            onClick={() => setMcqError(null)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-2.5 py-1 text-[12px] font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {hasQuiz && !mcqLoading && (
                  <div className="pt-20">
                    <QuizView
                      questions={questions}
                      answers={answers}
                      onAnswer={handleAnswer}
                      onReset={handleResetQuiz}
                      onRetry={handleRetryQuiz}
                      title={activeQuizTitle || "Quiz session"}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Composer */}
          <div
            className={cn(
              "py-4",
              (section === "chat" && hasChat) || (section === "mcq" && hasQuiz)
                ? "border-t border-zinc-200/80 bg-white/70 backdrop-blur-xl"
                : ""
            )}
          >
            {section === "chat" ? (
              <ChatComposer
                onSend={handleSend}
                model={model}
                onModelChange={setModel}
                sendOnEnter={settings.sendOnEnter}
                disabled={isTyping}
              />
            ) : (
              <MCQComposer
                onSubmitText={startQuiz}
                onUpload={startQuiz}
                sendOnEnter={settings.sendOnEnter}
              />
            )}
          </div>
        </main>
      </div>

      {/* Settings modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onClearChats={handleClearAllChats}
        onClearMCQ={handleClearAllMCQ}
        onResetAll={handleResetAll}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
