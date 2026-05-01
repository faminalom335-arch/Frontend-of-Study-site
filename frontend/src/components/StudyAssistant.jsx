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
}) => {
  const [query, setQuery] = useState("");
  const pool = section === "chat" ? recentChats : recentMCQ;
  const filtered = pool.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  const newLabel = section === "chat" ? "New Chat" : "New Quiz";
  const recentLabel = section === "chat" ? "Recent Chats" : "Recent Quizzes";

  return (
    <aside
      data-testid="sidebar"
      className={cn(
        "relative h-screen shrink-0 transition-[width] duration-300 ease-out",
        open ? "w-[280px]" : "w-[68px]"
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
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-black/[0.04] hover:text-black",
              !open && "justify-center px-0"
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
              A
            </div>
            {open && (
              <div className="flex min-w-0 flex-1 flex-col text-left">
                <span className="truncate text-[13px] font-medium text-black">
                  Alex Student
                </span>
                <span className="text-[11px] text-zinc-500">Free plan</span>
              </div>
            )}
            {open && <Settings className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

/* ---------------- MCQ Card ---------------- */
const MCQCard = ({ q, index, selected, onSelect }) => {
  const answered = selected !== null && selected !== undefined;

  return (
    <div
      data-testid={`mcq-card-${index}`}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-300 hover:border-zinc-300"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-7 min-w-[28px] items-center justify-center rounded-md bg-black/[0.05] px-2 text-[11px] font-semibold text-black">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="text-[15px] font-medium leading-relaxed text-black md:text-base">
          {q.question}
        </h3>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === q.correctAnswer;
          const showCorrect = answered && isCorrect;
          const showIncorrect = answered && isSelected && !isCorrect;

          return (
            <button
              key={i}
              data-testid={`mcq-${index}-option-${i}`}
              disabled={answered}
              onClick={() => onSelect(opt)}
              className={cn(
                "group/opt relative flex items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300",
                !answered &&
                  "border-zinc-200 bg-white text-black hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-50",
                showCorrect &&
                  "border-emerald-500/60 bg-emerald-50 text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]",
                showIncorrect &&
                  "border-red-500/60 bg-red-50 text-red-800 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]",
                answered && !isSelected && !isCorrect && "opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors",
                  !answered &&
                    "border-zinc-300 bg-white text-zinc-600 group-hover/opt:border-zinc-500 group-hover/opt:text-black",
                  showCorrect &&
                    "border-emerald-500/60 bg-emerald-500/15 text-emerald-700",
                  showIncorrect &&
                    "border-red-500/60 bg-red-500/15 text-red-700",
                  answered && !isSelected && !isCorrect && "border-zinc-200"
                )}
              >
                {showCorrect ? (
                  <Check className="h-3.5 w-3.5" />
                ) : showIncorrect ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </div>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "grid overflow-hidden transition-all duration-500 ease-out",
          answered
            ? "mt-5 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <div
            data-testid={`mcq-${index}-explanation`}
            className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Explanation
              </div>
              <p className="text-[13.5px] leading-relaxed text-zinc-800">
                {q.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Quiz View ---------------- */
const QuizView = ({ questions, answers, onAnswer, onReset }) => {
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const correct = Object.entries(answers).filter(
    ([idx, ans]) => questions[Number(idx)].correctAnswer === ans
  ).length;

  return (
    <section className="mx-auto w-full max-w-3xl px-6 pb-32">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700">
            <Zap className="h-3 w-3 text-amber-500" />
            Generated quiz
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Data Structures — Stacks & Queues
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
          <span>
            Correct:{" "}
            <span className="font-semibold text-emerald-600">{correct}</span>
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
    </section>
  );
};

/* ---------------- MCQ Composer (upload-focused) ---------------- */
const MCQComposer = ({ onSubmitText, onUpload }) => {
  const [text, setText] = useState("");
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

  const handleSubmit = () => {
    if (text.trim().length === 0) return;
    onSubmitText(text);
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6">
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

          <div className="flex items-center justify-between px-2 pb-1 pt-1">
            <div className="flex items-center gap-1.5">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                }}
              />
              <button
                data-testid="upload-button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-black"
              >
                <Upload className="h-[15px] w-[15px]" />
                <span>Upload PDF / Image</span>
              </button>
              <button className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-black sm:inline-flex">
                <FileText className="h-[15px] w-[15px]" />
                <span>Use template</span>
              </button>
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
              <span>Generate MCQs</span>
              <ArrowUp className="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-zinc-500">
        Study AI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

/* ---------------- Chat Composer (with model switcher) ---------------- */
const ChatComposer = ({ onSend, model, onModelChange }) => {
  const [text, setText] = useState("");
  const taRef = useRef(null);

  const handleInput = (e) => {
    setText(e.target.value);
    const el = taRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    }
  };

  const handleSubmit = () => {
    if (text.trim().length === 0) return;
    onSend(text);
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6">
      <div className="group relative rounded-2xl border border-zinc-200 bg-white/80 p-2 shadow-[0_12px_40px_rgba(17,24,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 focus-within:border-zinc-400 focus-within:shadow-[0_16px_50px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,1)]">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 to-transparent opacity-70" />

        <div className="relative">
          <textarea
            data-testid="chat-textarea"
            ref={taRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Ask anything — start a conversation..."
            className="block max-h-[220px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] leading-relaxed text-black placeholder:text-zinc-400 outline-none"
          />

          <div className="flex items-center justify-between gap-2 px-2 pb-1 pt-1">
            <ModelSwitcher value={model} onChange={onModelChange} />

            <button
              data-testid="send-chat"
              onClick={handleSubmit}
              disabled={text.trim().length === 0}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                text.trim().length === 0
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

const ChatMessage = ({ role, content, modelName, modelProvider }) => {
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
          "max-w-[80%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed",
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
        <div className="whitespace-pre-wrap">{content}</div>
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
    <div className="mx-auto w-full max-w-3xl px-6 pb-8 pt-20 text-center md:pt-32">
      <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-black md:text-5xl">
        {headline}
      </h1>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
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

const MCQHero = () => {
  const suggestions = [
    "Quiz me on photosynthesis",
    "Python OOP fundamentals",
    "World War II timeline",
    "Linear algebra basics",
  ];
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-8 pt-16 text-center md:pt-24">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700">
        <ListChecks className="h-3 w-3 text-amber-500" />
        Generate MCQs from text or images
      </div>
      <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-black md:text-5xl">
        Turn any material into a quiz.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-500">
        Upload notes, paste text, or describe a topic. I'll craft multiple-choice
        questions with detailed explanations to deepen your understanding.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [section, setSection] = useState("chat"); // 'chat' | 'mcq'
  const [activeId, setActiveId] = useState(null);

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

  // MCQ state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // Chat state
  const [messages, setMessages] = useState([]); // {role, content, model, provider}
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const chatScrollRef = useRef(null);

  const currentModel = MODELS.find((m) => m.id === model) || MODELS[0];

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* --- MCQ handlers --- */
  const startQuiz = (input) => {
    setQuestions(DUMMY_QUIZ);
    setAnswers({});

    // Auto-create a sidebar entry for this new MCQ session
    if (!activeId) {
      const newId = `m_${Date.now()}`;
      let title = "New MCQ session";
      if (typeof input === "string" && input.trim()) {
        title = truncateTitle(input);
      } else if (input && typeof input === "object" && input.name) {
        title = `Quiz from ${input.name}`;
      }
      setRecentMCQ((prev) => [
        { id: newId, title, date: "Just now" },
        ...prev,
      ]);
      setActiveId(newId);
    }

    requestAnimationFrame(() => {
      document
        .getElementById("quiz-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const handleAnswer = (i, opt) => {
    if (answers[i] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [i]: opt }));
  };
  const handleResetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setActiveId(null);
  };

  /* --- Chat handlers --- */
  const handleSend = (text) => {
    // Auto-create a sidebar entry for this new chat on first send
    if (!activeId) {
      const newId = `c_${Date.now()}`;
      const title = truncateTitle(text);
      setRecentChats((prev) => [
        { id: newId, title, date: "Just now" },
        ...prev,
      ]);
      setActiveId(newId);
    }

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    const modelName = currentModel.name;
    const modelProvider = currentModel.provider;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: DUMMY_ASSISTANT_REPLY(text, modelName),
          model: modelName,
          provider: modelProvider,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };
  const handleResetChat = () => {
    setMessages([]);
    setIsTyping(false);
    setActiveId(null);
  };

  /* --- Sidebar events --- */
  const handleSectionChange = (s) => {
    setSection(s);
    setActiveId(null);
  };
  const handleNew = () => {
    if (section === "chat") handleResetChat();
    else handleResetQuiz();
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
        />

        <main className="relative flex h-screen min-w-0 flex-1 flex-col">
          {/* Floating Chat / MCQ switcher — no full-width header so it won't clash with browser chrome */}
          <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center">
            <div className="pointer-events-auto">
              <SectionTabs section={section} onChange={handleSectionChange} />
            </div>
          </div>

          {/* Scroll area */}
          <div
            ref={chatScrollRef}
            className="relative flex-1 overflow-y-auto"
          >
            {section === "chat" ? (
              <>
                {!hasChat && <ChatHero onPick={handleSend} />}
                {hasChat && (
                  <div className="mx-auto w-full max-w-3xl space-y-5 px-6 pb-24 pt-20">
                    {messages.map((m, i) => (
                      <ChatMessage
                        key={i}
                        role={m.role}
                        content={m.content}
                        modelName={m.model}
                        modelProvider={m.provider}
                      />
                    ))}
                    {isTyping && (
                      <TypingIndicator modelProvider={currentModel.provider} />
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {!hasQuiz && <MCQHero />}
                <div id="quiz-anchor" />
                {hasQuiz && (
                  <div className="pt-20">
                    <QuizView
                      questions={questions}
                      answers={answers}
                      onAnswer={handleAnswer}
                      onReset={handleResetQuiz}
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
              />
            ) : (
              <MCQComposer
                onSubmitText={startQuiz}
                onUpload={startQuiz}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
