import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, ChevronRight, Zap, Brain } from "lucide-react";

interface Evaluation {
  score: number;
  is_correct: boolean;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  complexity_analysis?: { time: string; space: string } | null;
  bloom_achievement: string;
  confidence: number;
  next_difficulty_recommendation: string;
}

interface EvaluationResultProps {
  evaluation: Evaluation;
  onNext: () => void;
  isLastQuestion: boolean;
}

const EvaluationResult = ({ evaluation, onNext, isLastQuestion }: EvaluationResultProps) => {
  const scoreColor = evaluation.score >= 80 ? "text-glow-success" : evaluation.score >= 60 ? "text-glow-warning" : "text-glow-danger";
  const scoreBg = evaluation.score >= 80 ? "bg-glow-success/10" : evaluation.score >= 60 ? "bg-glow-warning/10" : "bg-glow-danger/10";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Score Header */}
      <div className={`flex items-center gap-4 p-4 rounded-lg ${scoreBg}`}>
        <div className="text-center">
          <div className={`text-3xl font-bold ${scoreColor}`}>{evaluation.score}</div>
          <div className="text-[10px] font-mono text-muted-foreground">/ 100</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {evaluation.is_correct ? (
              <CheckCircle className="w-5 h-5 text-glow-success" />
            ) : (
              <XCircle className="w-5 h-5 text-glow-danger" />
            )}
            <span className="text-sm font-semibold text-foreground">
              {evaluation.is_correct ? "Correct" : "Needs Improvement"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{evaluation.feedback}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-muted-foreground">BLOOM LEVEL</div>
          <div className="text-xs font-semibold text-accent">{evaluation.bloom_achievement}</div>
        </div>
      </div>

      {/* Complexity Analysis */}
      {evaluation.complexity_analysis && (
        <div className="glass-card rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">Complexity Analysis</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-lg p-2">
              <div className="text-[10px] font-mono text-muted-foreground">TIME</div>
              <div className="text-xs font-mono text-foreground">{evaluation.complexity_analysis.time}</div>
            </div>
            <div className="bg-secondary rounded-lg p-2">
              <div className="text-[10px] font-mono text-muted-foreground">SPACE</div>
              <div className="text-xs font-mono text-foreground">{evaluation.complexity_analysis.space}</div>
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-3">
        {evaluation.strengths.length > 0 && (
          <div className="glass-card rounded-lg p-3">
            <div className="text-[10px] font-mono text-glow-success mb-2">STRENGTHS</div>
            {evaluation.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-1.5 mb-1">
                <CheckCircle className="w-3 h-3 text-glow-success mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        )}
        {evaluation.weaknesses.length > 0 && (
          <div className="glass-card rounded-lg p-3">
            <div className="text-[10px] font-mono text-glow-warning mb-2">AREAS TO IMPROVE</div>
            {evaluation.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-1.5 mb-1">
                <AlertTriangle className="w-3 h-3 text-glow-warning mt-0.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{w}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {evaluation.suggestions.length > 0 && (
        <div className="glass-card rounded-lg p-3">
          <div className="text-[10px] font-mono text-accent mb-2">AI SUGGESTIONS</div>
          {evaluation.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-1">
              <Brain className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Difficulty Adaptation */}
      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono text-muted-foreground">
            NEXT DIFFICULTY: {evaluation.next_difficulty_recommendation.toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          AI CONFIDENCE: {evaluation.confidence}%
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all"
        style={{ background: "var(--gradient-primary)" }}
      >
        {isLastQuestion ? (
          <>View Results</>
        ) : (
          <>
            Next Question <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </motion.div>
  );
};

export default EvaluationResult;
