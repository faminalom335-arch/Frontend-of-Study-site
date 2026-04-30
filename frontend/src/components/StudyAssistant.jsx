import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Sparkles,
  Upload,
  ArrowUp,
  FileText,
  BookOpen,
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
  GraduationCap,
  Sun,
  Moon,
} from "lucide-react";

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

const DUMMY_RECENT = [
  { id: "1", title: "Data Structures — Stacks & Queues", date: "Today" },
  { id: "2", title: "React Hooks Deep Dive", date: "Today" },
  { id: "3", title: "Binary Search Algorithms", date: "Yesterday" },
  { id: "4", title: "Organic Chemistry — Alkanes", date: "Yesterday" },
  { id: "5", title: "World War II Key Events", date: "2 days ago" },
  { id: "6", title: "Python List Comprehensions", date: "3 days ago" },
  { id: "7", title: "Linear Algebra — Eigenvectors", date: "5 days ago" },
  { id: "8", title: "Photosynthesis Fundamentals", date: "1 week ago" },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ---------------- Theme Toggle ---------------- */
const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === "dark";
  return (
    <button
      data-testid="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative flex h-8 w-[60px] items-center rounded-full border border-zinc-300/70 bg-white/60 px-1 shadow-inner backdrop-blur-md transition-colors dark:border-white/10 dark:bg-white/[0.04]"
    >
      <span
        className={cn(
          "absolute top-1 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-all duration-300 ease-out",
          isDark
            ? "left-[30px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            : "left-1 bg-gradient-to-br from-amber-300 to-orange-400 text-white"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="ml-auto mr-1 flex h-6 w-6 items-center justify-center text-zinc-400 dark:text-zinc-500">
        {isDark ? (
          <Sun className="h-3.5 w-3.5 opacity-40" />
        ) : (
          <Moon className="h-3.5 w-3.5 opacity-40" />
        )}
      </span>
    </button>
  );
};

/* ---------------- Sidebar ---------------- */
const Sidebar = ({ open, onToggle, activeId, onSelect, onNewQuiz }) => {
  const [query, setQuery] = useState("");
  const filtered = DUMMY_RECENT.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside
      data-testid="sidebar"
      className={cn(
        "relative h-screen shrink-0 transition-[width] duration-300 ease-out",
        open ? "w-[280px]" : "w-[68px]"
      )}
    >
      {/* Glass surface */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-white/55 dark:bg-[#0b0b0d]/55",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border-r border-zinc-200/60 dark:border-white/[0.06]",
          "shadow-[inset_-1px_0_0_rgba(255,255,255,0.5)] dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.02)]"
        )}
      />
      {/* Subtle top highlight for depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/10" />

      <div className="relative flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-purple-500/20">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            {open && (
              <span className="truncate text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white">
                Study AI
              </span>
            )}
          </div>
          <button
            data-testid="sidebar-toggle"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label="Toggle sidebar"
          >
            {open ? (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {/* New Quiz Button */}
        <div className="px-3">
          <button
            data-testid="new-quiz-button"
            onClick={onNewQuiz}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
              "border-zinc-900/10 bg-white/70 text-zinc-900 hover:border-zinc-900/20 hover:bg-white/90 shadow-sm",
              "dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/20 dark:hover:bg-white/[0.07]",
              !open && "justify-center px-0"
            )}
          >
            <Plus className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            {open && <span className="truncate">New Quiz</span>}
          </button>
        </div>

        {/* Search */}
        {open && (
          <div className="mt-4 px-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                data-testid="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search quizzes..."
                className={cn(
                  "w-full rounded-lg py-2 pl-9 pr-3 text-sm outline-none ring-1 transition",
                  "bg-white/70 text-zinc-800 placeholder:text-zinc-400 ring-zinc-900/10 focus:bg-white/90 focus:ring-zinc-900/20",
                  "dark:bg-white/[0.03] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:ring-transparent dark:focus:bg-white/[0.05] dark:focus:ring-white/10"
                )}
              />
            </div>
          </div>
        )}

        {/* Recents */}
        <div className="mt-5 flex-1 overflow-hidden">
          {open && (
            <div className="px-5 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Recent Quizzes
            </div>
          )}
          <div className="h-full overflow-y-auto px-2 pb-4 [scrollbar-width:thin]">
            <ul className="space-y-0.5">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    data-testid={`recent-quiz-${item.id}`}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                      activeId === item.id
                        ? "bg-zinc-900/[0.06] text-zinc-900 dark:bg-white/[0.07] dark:text-white"
                        : "text-zinc-600 hover:bg-zinc-900/[0.04] hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-100",
                      !open && "justify-center px-0"
                    )}
                    title={item.title}
                  >
                    <MessageSquare className="h-[15px] w-[15px] shrink-0" />
                    {open && (
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[13px] font-medium">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-500">
                          {item.date}
                        </span>
                      </div>
                    )}
                    {open && (
                      <Trash2 className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </button>
                </li>
              ))}
              {open && filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-xs text-zinc-500">
                  No quizzes found
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200/60 p-3 dark:border-white/[0.06]">
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              "text-zinc-600 hover:bg-zinc-900/[0.04] hover:text-zinc-900",
              "dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white",
              !open && "justify-center px-0"
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-semibold text-black">
              A
            </div>
            {open && (
              <div className="flex min-w-0 flex-1 flex-col text-left">
                <span className="truncate text-[13px] font-medium text-zinc-900 dark:text-white">
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
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "border border-zinc-900/[0.06] bg-white/60 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] hover:border-zinc-900/[0.12]",
        "dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] dark:hover:border-white/[0.12]"
      )}
    >
      {/* Question header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-7 min-w-[28px] items-center justify-center rounded-md bg-zinc-900/[0.05] px-2 text-[11px] font-semibold text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="text-[15px] font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 md:text-base">
          {q.question}
        </h3>
      </div>

      {/* Options */}
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
                  "border-zinc-900/[0.08] bg-white/70 text-zinc-800 hover:-translate-y-0.5 hover:border-zinc-900/20 hover:bg-white/90 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/[0.06]",
                showCorrect &&
                  "border-emerald-500/50 bg-emerald-500/[0.1] text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] dark:bg-emerald-500/[0.08] dark:text-emerald-100",
                showIncorrect &&
                  "border-red-500/50 bg-red-500/[0.1] text-red-800 shadow-[0_0_0_1px_rgba(239,68,68,0.15)] dark:bg-red-500/[0.08] dark:text-red-100",
                answered && !isSelected && !isCorrect && "opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors",
                  !answered &&
                    "border-zinc-900/15 bg-white/80 text-zinc-500 group-hover/opt:border-zinc-900/30 group-hover/opt:text-zinc-900 dark:border-white/15 dark:bg-white/[0.03] dark:text-zinc-400 dark:group-hover/opt:border-white/30 dark:group-hover/opt:text-white",
                  showCorrect &&
                    "border-emerald-400/60 bg-emerald-500/20 text-emerald-700 dark:text-emerald-200",
                  showIncorrect &&
                    "border-red-400/60 bg-red-500/20 text-red-700 dark:text-red-200",
                  answered &&
                    !isSelected &&
                    !isCorrect &&
                    "border-zinc-900/10 dark:border-white/10"
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

      {/* Explanation */}
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
            className={cn(
              "flex gap-3 rounded-xl border p-4",
              "border-zinc-900/[0.06] bg-amber-50/60 backdrop-blur-sm",
              "dark:border-white/[0.06] dark:bg-white/[0.02]"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300/90">
                Explanation
              </div>
              <p className="text-[13.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
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
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/60 px-3 py-1 text-[11px] font-medium text-zinc-700 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
            <Zap className="h-3 w-3 text-amber-500 dark:text-amber-300" />
            Generated quiz
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Data Structures — Stacks & Queues
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {total} questions · Pick an option to reveal the explanation
          </p>
        </div>
        <button
          data-testid="reset-quiz"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-900/10 bg-white/60 px-3.5 py-2 text-sm text-zinc-700 backdrop-blur-md transition hover:border-zinc-900/20 hover:bg-white/80 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.06] dark:hover:text-white"
        >
          <Plus className="h-4 w-4 rotate-45" />
          Clear
        </button>
      </div>

      {/* Progress */}
      <div className="mb-8 rounded-xl border border-zinc-900/[0.06] bg-white/60 p-4 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Progress:{" "}
            <span className="font-semibold text-zinc-900 dark:text-white">
              {answered}/{total}
            </span>
          </span>
          <span>
            Correct:{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-300">
              {correct}
            </span>
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900/[0.06] dark:bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-500 ease-out"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
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

/* ---------------- Composer ---------------- */
const ComposerInput = ({ onSubmitText, onUpload }) => {
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
      <div
        className={cn(
          "group relative rounded-2xl p-2 transition-all duration-300",
          // Glass surface
          "border border-zinc-900/[0.08] bg-white/55 backdrop-blur-2xl backdrop-saturate-150",
          "shadow-[0_12px_40px_rgba(17,24,39,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]",
          "focus-within:border-zinc-900/[0.18] focus-within:shadow-[0_16px_50px_rgba(99,102,241,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]",
          // Dark
          "dark:border-white/10 dark:bg-white/[0.04]",
          "dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "dark:focus-within:border-white/20 dark:focus-within:shadow-[0_16px_50px_rgba(99,102,241,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]"
        )}
      >
        {/* Soft inner glow stroke */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-60 dark:from-white/[0.04]" />

        <div className="relative">
          <textarea
            data-testid="composer-textarea"
            ref={taRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Paste your study notes, a topic, or ask for a quiz..."
            className="block max-h-[220px] w-full resize-none bg-transparent px-4 pt-3 pb-2 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
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
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-900/10 bg-white/60 px-3 py-1.5 text-[13px] font-medium text-zinc-700 backdrop-blur-md transition hover:border-zinc-900/20 hover:bg-white/90 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:text-white"
              >
                <Upload className="h-[15px] w-[15px]" />
                <span>Upload PDF / Image</span>
              </button>
              <button className="hidden items-center gap-2 rounded-lg border border-zinc-900/10 bg-white/60 px-3 py-1.5 text-[13px] font-medium text-zinc-700 backdrop-blur-md transition hover:border-zinc-900/20 hover:bg-white/90 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:text-white sm:inline-flex">
                <FileText className="h-[15px] w-[15px]" />
                <span>Use template</span>
              </button>
            </div>

            <button
              data-testid="submit-text-button"
              onClick={handleSubmit}
              disabled={text.trim().length === 0}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                text.trim().length === 0
                  ? "cursor-not-allowed bg-zinc-900/[0.05] text-zinc-400 dark:bg-white/[0.05] dark:text-zinc-500"
                  : "bg-zinc-900 text-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] dark:hover:bg-zinc-200"
              )}
            >
              <span>Generate</span>
              <ArrowUp className="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-500">
        Study AI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

/* ---------------- Hero ---------------- */
const Hero = () => {
  const suggestions = [
    "Quiz me on photosynthesis",
    "Python OOP fundamentals",
    "World War II timeline",
    "Linear algebra basics",
  ];
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-8 pt-16 text-center md:pt-24">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/60 px-3 py-1 text-[11px] font-medium text-zinc-700 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
        <Sparkles className="h-3 w-3 text-amber-500 dark:text-amber-300" />
        Your AI study partner
      </div>
      <h1 className="mx-auto max-w-2xl bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text text-4xl font-semibold leading-[1.1] tracking-tight text-transparent dark:from-white dark:to-zinc-400 md:text-5xl">
        What would you like to study today?
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Upload notes, paste text, or describe a topic. I'll craft a personalized
        quiz with detailed explanations to deepen your understanding.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            className="rounded-full border border-zinc-900/10 bg-white/60 px-3.5 py-1.5 text-[12.5px] text-zinc-700 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-zinc-900/20 hover:bg-white/90 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Root ---------------- */
export default function StudyAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [theme, setTheme] = useState("dark");

  // Initialize theme from localStorage / system preference
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("study-ai-theme");
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
        return;
      }
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, []);

  // Persist theme
  useEffect(() => {
    try {
      window.localStorage.setItem("study-ai-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const startQuiz = () => {
    setQuestions(DUMMY_QUIZ);
    setAnswers({});
    setActiveId("1");
    requestAnimationFrame(() => {
      document
        .getElementById("quiz-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSelect = (id) => {
    setActiveId(id);
    setQuestions(DUMMY_QUIZ);
    setAnswers({});
  };

  const handleAnswer = (i, opt) => {
    if (answers[i] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [i]: opt }));
  };

  const handleReset = () => {
    setQuestions([]);
    setAnswers({});
    setActiveId(null);
  };

  const handleUpload = () => {
    startQuiz();
  };

  const handleSubmitText = () => {
    startQuiz();
  };

  const hasQuiz = questions.length > 0;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div
        className={cn(
          "relative min-h-screen w-full overflow-hidden antialiased transition-colors duration-500",
          // Light mode background
          "bg-gradient-to-br from-[#f7f6fb] via-[#f0efff] to-[#fdf4f5] text-zinc-800",
          // Dark mode background
          "dark:bg-[#0a0a0b] dark:text-zinc-200"
        )}
      >
        {/* Ambient background (light) */}
        <div className="pointer-events-none fixed inset-0 dark:hidden">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(129,140,248,0.35),transparent_70%)] blur-2xl" />
          <div className="absolute top-1/3 -right-40 h-[380px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(244,114,182,0.25),transparent_70%)] blur-2xl" />
          <div className="absolute bottom-0 -left-40 h-[420px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.22),transparent_70%)] blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(17,24,39,0.9) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        {/* Ambient background (dark) */}
        <div className="pointer-events-none fixed inset-0 hidden dark:block">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.22),transparent_70%)] blur-2xl" />
          <div className="absolute top-1/3 -right-40 h-[380px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(217,70,239,0.16),transparent_70%)] blur-2xl" />
          <div className="absolute bottom-0 -left-40 h-[420px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.14),transparent_70%)] blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <div className="relative z-10 flex h-screen w-full">
          <Sidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
            activeId={activeId}
            onSelect={handleSelect}
            onNewQuiz={handleReset}
          />

          <main className="relative flex h-screen min-w-0 flex-1 flex-col">
            {/* Top bar */}
            <header className="flex items-center justify-between border-b border-zinc-900/[0.06] bg-white/30 px-5 py-3 backdrop-blur-xl dark:border-white/[0.04] dark:bg-[#0a0a0b]/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white md:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-[18px] w-[18px]" />
                </button>
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <BookOpen className="h-4 w-4" />
                  <span>{hasQuiz ? "Quiz session" : "New session"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <button className="rounded-lg border border-zinc-900/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur-md transition hover:border-zinc-900/20 hover:bg-white/90 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.06] dark:hover:text-white">
                  Share
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-semibold text-black">
                  A
                </div>
              </div>
            </header>

            {/* Scroll area */}
            <div className="relative flex-1 overflow-y-auto">
              {!hasQuiz && <Hero />}

              <div id="quiz-anchor" />

              {hasQuiz && (
                <div className="pt-6">
                  <QuizView
                    questions={questions}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onReset={handleReset}
                  />
                </div>
              )}
            </div>

            {/* Composer */}
            {!hasQuiz ? (
              <div className="pb-8">
                <ComposerInput
                  onSubmitText={handleSubmitText}
                  onUpload={handleUpload}
                />
              </div>
            ) : (
              <div className="border-t border-zinc-900/[0.06] bg-white/40 py-4 backdrop-blur-xl dark:border-white/[0.04] dark:bg-[#0a0a0b]/50">
                <ComposerInput
                  onSubmitText={handleSubmitText}
                  onUpload={handleUpload}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
