import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  glowColor?: "primary" | "accent" | "success";
  explanation?: string;
}

const ScoreCard = ({
  title,
  score,
  maxScore = 100,
  icon,
  trend = "stable",
  trendValue = "+0%",
  glowColor = "primary",
  explanation,
}: ScoreCardProps) => {
  const percentage = (score / maxScore) * 100;
  const glowClass = glowColor === "primary" ? "glow-primary" : glowColor === "accent" ? "glow-accent" : "glow-success";
  const gradientClass = glowColor === "success" ? "gradient-text-success" : "gradient-text";

  const trendColors = {
    up: "text-glow-success",
    down: "text-glow-danger",
    stable: "text-muted-foreground",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-lg p-5 ${glowClass} cursor-default`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-secondary">{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-bold ${gradientClass}`}>{score}</span>
              <span className="text-xs text-muted-foreground">/ {maxScore}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs font-mono font-medium ${trendColors[trend]}`}>
          {trendIcons[trend]} {trendValue}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: "var(--gradient-primary)" }}
        />
      </div>

      {explanation && (
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{explanation}</p>
      )}
    </motion.div>
  );
};

export default ScoreCard;
