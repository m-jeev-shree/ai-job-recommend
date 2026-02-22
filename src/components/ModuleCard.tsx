import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  status: "active" | "pending" | "locked";
  techniques: string[];
  onClick?: () => void;
}

const ModuleCard = ({ title, description, icon, status, techniques, onClick }: ModuleCardProps) => {
  const statusStyles = {
    active: "border-glow-success/30 glow-success",
    pending: "border-glow-warning/30",
    locked: "border-border opacity-60",
  };

  const statusLabels = {
    active: "Active",
    pending: "Processing",
    locked: "Locked",
  };

  const statusDot = {
    active: "bg-glow-success",
    pending: "bg-glow-warning",
    locked: "bg-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`glass-card rounded-lg p-5 cursor-pointer transition-all ${statusStyles[status]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-secondary">{icon}</div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${statusDot[status]} animate-pulse`} />
          <span className="text-xs font-mono text-muted-foreground">{statusLabels[status]}</span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{description}</p>

      <div className="flex flex-wrap gap-1.5">
        {techniques.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-secondary text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ModuleCard;
