import { motion } from "framer-motion";
import { Brain, ChevronRight, Clock, Zap } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "Implement a function that finds the longest palindromic substring",
    difficulty: "Hard",
    type: "Coding",
    bloomLevel: "Analyze",
    timeEstimate: "25 min",
    status: "current",
  },
  {
    id: 2,
    text: "Explain the CAP theorem with real-world examples",
    difficulty: "Medium",
    type: "Theory",
    bloomLevel: "Evaluate",
    timeEstimate: "10 min",
    status: "upcoming",
  },
  {
    id: 3,
    text: "Design a distributed cache system for high-traffic API",
    difficulty: "Hard",
    type: "System Design",
    bloomLevel: "Create",
    timeEstimate: "30 min",
    status: "upcoming",
  },
];

const difficultyColors = {
  Easy: "text-glow-success bg-glow-success/10",
  Medium: "text-glow-warning bg-glow-warning/10",
  Hard: "text-glow-danger bg-glow-danger/10",
};

const AssessmentPanel = () => {
  return (
    <div className="glass-card rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Adaptive Assessment Engine</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Computerized Adaptive Testing • Bloom's Taxonomy Classification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-[10px] font-mono rounded-full bg-secondary text-glow-success flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-glow-success animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      {/* Difficulty Calibration */}
      <div className="glass-card rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">Difficulty Calibration</span>
        </div>
        <div className="flex items-center gap-2">
          {["Easy", "Medium", "Hard", "Expert"].map((level, i) => (
            <div key={level} className="flex-1">
              <div
                className={`h-2 rounded-full ${
                  i <= 2 ? "bg-primary/80" : "bg-secondary"
                }`}
              />
              <span className="text-[10px] font-mono text-muted-foreground mt-1 block">{level}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 font-mono">
          AI calibrated to Hard • Based on 3/4 correct answers • Adapting in real-time
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.4 }}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              q.status === "current"
                ? "bg-secondary border border-primary/20 glow-primary"
                : "bg-secondary/30 opacity-60"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {q.status === "current" ? (
                <Brain className="w-4 h-4 text-primary" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground leading-relaxed">{q.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${
                    difficultyColors[q.difficulty as keyof typeof difficultyColors]
                  }`}
                >
                  {q.difficulty}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{q.type}</span>
                <span className="text-[10px] font-mono text-accent">{q.bloomLevel}</span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground ml-auto">
                  <Clock className="w-3 h-3" />
                  {q.timeEstimate}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Integrity Monitor */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-glow-success animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground">INTEGRITY MONITOR</span>
          </div>
          <span className="text-[10px] font-mono text-glow-success">NO ANOMALIES DETECTED</span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPanel;
