import React, { useState, useRef } from "react";
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
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black shadow-lg shadow-black/20">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            {open && (
              <span className="truncate text-[15px] font-semibold tracking-tight text-black">
                Study AI
              </span>
            )}
          </div>
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

        {/* New Quiz Button */}
        <div className="px-3">
          <button
            data-testid="new-quiz-button"
            onClick={onNewQuiz}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
              "bg-black text-white hover:bg-zinc-800 shadow-sm",
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
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                data-testid="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search quizzes..."
                className="w-full rounded-lg bg-white/80 py-2 pl-9 pr-3 text-sm text-black placeholder:text-zinc-400 outline-none ring-1 ring-zinc-200 transition focus:bg-white focus:ring-black/20"
              />
            </div>
          </div>
        )}

        {/* Recents */}
        <div className="mt-5 flex-1 overflow-hidden">
          {open && (
            <div className="px-5 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
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
                        ? "bg-black/[0.06] text-black"
                        : "text-zinc-600 hover:bg-black/[0.04] hover:text-black",
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
                        <span className="text-[11px] text-zinc-500">
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
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "border border-zinc-200 bg-white shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_4px_20px_rgba(17,24,39,0.04)] hover:border-zinc-300"
      )}
    >
      {/* Question header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-7 min-w-[28px] items-center justify-center rounded-md bg-black/[0.05] px-2 text-[11px] font-semibold text-black">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="text-[15px] font-medium leading-relaxed text-black md:text-base">
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
      {/* Header */}
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

      {/* Progress */}
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
          "border border-zinc-200 bg-white/80 backdrop-blur-2xl backdrop-saturate-150",
          "shadow-[0_12px_40px_rgba(17,24,39,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]",
          "focus-within:border-zinc-400 focus-within:shadow-[0_16px_50px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,1)]"
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 to-transparent opacity-70" />

        <div className="relative">
          <textarea
            data-testid="composer-textarea"
            ref={taRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder="Paste your study notes, a topic, or ask for a quiz..."
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
              data-testid="submit-text-button"
              onClick={handleSubmit}
              disabled={text.trim().length === 0}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
                text.trim().length === 0
                  ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                  : "bg-black text-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] hover:bg-zinc-800 active:scale-[0.97]"
              )}
            >
              <span>Generate</span>
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
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-700">
        <Sparkles className="h-3 w-3 text-amber-500" />
        Your AI study partner
      </div>
      <h1 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-black md:text-5xl">
        What would you like to study today?
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-500">
        Upload notes, paste text, or describe a topic. I'll craft a personalized
        quiz with detailed explanations to deepen your understanding.
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

/* ---------------- Root ---------------- */
export default function StudyAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

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
          activeId={activeId}
          onSelect={handleSelect}
          onNewQuiz={handleReset}
        />

        <main className="relative flex h-screen min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b border-zinc-200/80 bg-white/70 px-5 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-black/5 hover:text-black md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <BookOpen className="h-4 w-4" />
                <span>{hasQuiz ? "Quiz session" : "New session"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-black">
                Share
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
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
            <div className="border-t border-zinc-200/80 bg-white/70 py-4 backdrop-blur-xl">
              <ComposerInput
                onSubmitText={handleSubmitText}
                onUpload={handleUpload}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
