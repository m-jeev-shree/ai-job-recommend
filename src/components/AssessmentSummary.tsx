import { motion } from "framer-motion";
import { Trophy, Target, Brain, BarChart3, RotateCcw } from "lucide-react";

interface Evaluation {
  score: number;
  is_correct: boolean;
  bloom_achievement: string;
}

interface AssessmentSummaryProps {
  evaluations: Evaluation[];
  topic: string;
  correctAnswers: number;
  totalQuestions: number;
  onReset: () => void;
}

const AssessmentSummary = ({ evaluations, topic, correctAnswers, totalQuestions, onReset }: AssessmentSummaryProps) => {
  const avgScore = Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length);
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  const bloomCounts: Record<string, number> = {};
  evaluations.forEach(e => {
    bloomCounts[e.bloom_achievement] = (bloomCounts[e.bloom_achievement] || 0) + 1;
  });

  const grade = avgScore >= 90 ? "A+" : avgScore >= 80 ? "A" : avgScore >= 70 ? "B" : avgScore >= 60 ? "C" : avgScore >= 50 ? "D" : "F";
  const gradeColor = avgScore >= 80 ? "text-glow-success" : avgScore >= 60 ? "text-glow-warning" : "text-glow-danger";

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      {/* Header */}
      <div className="text-center p-6 glass-card rounded-lg">
        <Trophy className="w-10 h-10 text-glow-warning mx-auto mb-3" />
        <h2 className="text-lg font-bold text-foreground">Assessment Complete</h2>
        <p className="text-xs text-muted-foreground mt-1">{topic}</p>
        <div className={`text-5xl font-bold mt-4 ${gradeColor}`}>{grade}</div>
        <div className="text-sm text-muted-foreground mt-1">Average Score: {avgScore}/100</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-lg p-3 text-center">
          <Target className="w-4 h-4 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">{accuracy}%</div>
          <div className="text-[10px] font-mono text-muted-foreground">ACCURACY</div>
        </div>
        <div className="glass-card rounded-lg p-3 text-center">
          <Brain className="w-4 h-4 text-accent mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">{correctAnswers}/{totalQuestions}</div>
          <div className="text-[10px] font-mono text-muted-foreground">CORRECT</div>
        </div>
        <div className="glass-card rounded-lg p-3 text-center">
          <BarChart3 className="w-4 h-4 text-glow-success mx-auto mb-1" />
          <div className="text-lg font-bold text-foreground">{avgScore}</div>
          <div className="text-[10px] font-mono text-muted-foreground">AVG SCORE</div>
        </div>
      </div>

      {/* Per-question scores */}
      <div className="glass-card rounded-lg p-4">
        <div className="text-[10px] font-mono text-muted-foreground mb-3">QUESTION BREAKDOWN</div>
        <div className="space-y-2">
          {evaluations.map((e, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-8">Q{i + 1}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${e.score}%`,
                    background: e.score >= 80 ? "hsl(var(--glow-success))" : e.score >= 60 ? "hsl(var(--glow-warning))" : "hsl(var(--glow-danger))",
                  }}
                />
              </div>
              <span className="text-xs font-mono text-foreground w-8 text-right">{e.score}</span>
              <span className="text-[10px] font-mono text-accent w-16 text-right">{e.bloom_achievement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bloom Distribution */}
      {Object.keys(bloomCounts).length > 0 && (
        <div className="glass-card rounded-lg p-4">
          <div className="text-[10px] font-mono text-muted-foreground mb-3">BLOOM'S TAXONOMY DISTRIBUTION</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(bloomCounts).map(([level, count]) => (
              <span key={level} className="px-2 py-1 text-[10px] font-mono rounded-full bg-accent/10 text-accent">
                {level}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Retry */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all"
        style={{ background: "var(--gradient-primary)" }}
      >
        <RotateCcw className="w-4 h-4" />
        Start New Assessment
      </button>
    </motion.div>
  );
};

export default AssessmentSummary;
