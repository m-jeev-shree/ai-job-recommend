import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Loader2, Sparkles, ChevronRight, Clock, Zap, Play } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import EvaluationResult from "@/components/EvaluationResult";
import AssessmentSummary from "@/components/AssessmentSummary";
import { useAssessment } from "@/hooks/useAssessment";

const TOPICS = [
  "JavaScript & TypeScript",
  "React & Frontend",
  "Data Structures & Algorithms",
  "System Design",
  "Python & Backend",
  "SQL & Databases",
  "DevOps & Cloud",
];

const Assessment = () => {
  const { state, startAssessment, submitAnswer, nextQuestion, reset } = useAssessment();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [answer, setAnswer] = useState("");
  const startTimeRef = useRef<number>(Date.now());

  const handleStart = () => {
    startAssessment(topic, numQuestions, difficulty);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    submitAnswer(answer, timeSpent);
    setAnswer("");
  };

  const handleNext = () => {
    startTimeRef.current = Date.now();
    if (state.status === "completed") return;
    nextQuestion();
  };

  const difficultyColors: Record<string, string> = {
    easy: "text-glow-success bg-glow-success/10",
    medium: "text-glow-warning bg-glow-warning/10",
    hard: "text-glow-danger bg-glow-danger/10",
    expert: "text-accent bg-accent/10",
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AI Assessment Engine</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-12">
              Adaptive testing • Bloom's Taxonomy • AI evaluation with partial credit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {/* Setup */}
                {(state.status === "idle" || state.status === "setup") && (
                  <motion.div key="setup" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-semibold text-foreground">Configure Assessment</h2>
                      <span className="text-[10px] font-mono text-muted-foreground ml-auto">CAT ENGINE</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Topic</label>
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Starting Difficulty</label>
                        <div className="grid grid-cols-4 gap-2">
                          {["easy", "medium", "hard", "expert"].map(d => (
                            <button
                              key={d}
                              onClick={() => setDifficulty(d)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                                difficulty === d ? `${difficultyColors[d]} ring-1 ring-current` : "bg-secondary text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Number of Questions: {numQuestions}
                        </label>
                        <input
                          type="range"
                          min={3}
                          max={10}
                          value={numQuestions}
                          onChange={(e) => setNumQuestions(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                          <span>3</span><span>10</span>
                        </div>
                      </div>

                      {state.error && <p className="text-xs text-glow-danger">{state.error}</p>}

                      <button
                        onClick={handleStart}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        <Play className="w-4 h-4" />
                        Start Assessment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Question Display */}
                {(state.status === "answering" || state.status === "evaluating") && state.currentQuestion && (
                  <motion.div key="question" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-lg p-6">
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-muted-foreground">
                        Question {state.currentQuestionNumber} / {state.totalQuestions}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${difficultyColors[state.currentQuestion.difficulty] || difficultyColors.medium}`}>
                          {state.currentQuestion.difficulty}
                        </span>
                        <span className="text-[10px] font-mono text-accent">{state.currentQuestion.bloom_level}</span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-secondary rounded-full mb-4 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(state.currentQuestionNumber / state.totalQuestions) * 100}%`, background: "var(--gradient-primary)" }}
                      />
                    </div>

                    {/* Question */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-secondary text-muted-foreground">
                          {state.currentQuestion.question_type}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {state.currentQuestion.time_estimate_minutes} min
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{state.currentQuestion.question_text}</p>
                    </div>

                    {/* Answer Input */}
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={8}
                      placeholder="Type your answer here... For coding questions, include your code with explanation."
                      className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-mono"
                      disabled={state.status === "evaluating"}
                    />

                    {state.error && <p className="text-xs text-glow-danger mt-2">{state.error}</p>}

                    <button
                      onClick={handleSubmit}
                      disabled={state.status === "evaluating" || !answer.trim()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all mt-3 disabled:opacity-50"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      {state.status === "evaluating" ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Evaluating with AI...</>
                      ) : (
                        <><Send className="w-4 h-4" />Submit Answer</>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Generating */}
                {state.status === "generating" && (
                  <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
                    <Brain className="w-12 h-12 text-primary animate-pulse-glow" />
                    <p className="text-sm font-medium text-foreground mt-4">Generating Adaptive Question</p>
                    <div className="mt-3 space-y-1.5 text-[10px] font-mono text-muted-foreground">
                      {["Calibrating difficulty...", "Selecting Bloom's level...", "Generating unique question...", "Building evaluation rubric..."].map((step, i) => (
                        <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }} className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-primary" />{step}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Completed */}
                {state.status === "completed" && (
                  <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AssessmentSummary
                      evaluations={state.evaluations}
                      topic={state.topic}
                      correctAnswers={state.correctAnswers}
                      totalQuestions={state.totalQuestions}
                      onReset={reset}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Panel - Results */}
            <div>
              <AnimatePresence mode="wait">
                {state.status === "reviewed" && state.evaluations.length > 0 && (
                  <motion.div key="evaluation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-semibold text-foreground">AI Evaluation</h2>
                      <span className="text-[10px] font-mono text-muted-foreground ml-auto">Q{state.currentQuestionNumber}</span>
                    </div>
                    <EvaluationResult
                      evaluation={state.evaluations[state.evaluations.length - 1]}
                      onNext={handleNext}
                      isLastQuestion={state.questionsAnswered >= state.totalQuestions}
                    />
                  </motion.div>
                )}

                {(state.status === "idle" || state.status === "setup" || state.status === "generating") && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <Brain className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">AI evaluation will appear here</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Adaptive difficulty • Partial credit • Bloom's classification</p>
                  </motion.div>
                )}

                {state.status === "answering" && state.evaluations.length > 0 && (
                  <motion.div key="prev-eval" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-lg p-6">
                    <div className="text-[10px] font-mono text-muted-foreground mb-3">PREVIOUS EVALUATIONS</div>
                    <div className="space-y-2">
                      {state.evaluations.map((e, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-secondary rounded-lg">
                          <span className="text-xs font-mono text-muted-foreground">Q{i + 1}</span>
                          <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: `${e.score}%`,
                              background: e.score >= 80 ? "hsl(var(--glow-success))" : e.score >= 60 ? "hsl(var(--glow-warning))" : "hsl(var(--glow-danger))",
                            }} />
                          </div>
                          <span className="text-xs font-mono text-foreground">{e.score}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Difficulty Calibration Indicator */}
                {(state.status === "answering" || state.status === "evaluating") && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-foreground">Difficulty Calibration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {["easy", "medium", "hard", "expert"].map((level) => (
                        <div key={level} className="flex-1">
                          <div className={`h-2 rounded-full ${
                            ["easy", "medium", "hard", "expert"].indexOf(level) <= ["easy", "medium", "hard", "expert"].indexOf(state.currentDifficulty)
                              ? "bg-primary/80" : "bg-secondary"
                          }`} />
                          <span className="text-[10px] font-mono text-muted-foreground mt-1 block capitalize">{level}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                      AI calibrated to {state.currentDifficulty} • {state.correctAnswers}/{state.questionsAnswered} correct • Adapting in real-time
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assessment;
