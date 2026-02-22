import { motion } from "framer-motion";

const skills = [
  { name: "React", level: 92, category: "Frontend" },
  { name: "TypeScript", level: 88, category: "Language" },
  { name: "Python", level: 75, category: "Language" },
  { name: "Machine Learning", level: 65, category: "AI/ML" },
  { name: "System Design", level: 78, category: "Architecture" },
  { name: "Node.js", level: 82, category: "Backend" },
  { name: "SQL", level: 70, category: "Data" },
  { name: "Docker", level: 60, category: "DevOps" },
];

const SkillRadar = () => {
  return (
    <div className="glass-card rounded-lg p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Skill Vector Profile</h3>
          <p className="text-xs text-muted-foreground mt-0.5">AI-extracted from resume + assessment</p>
        </div>
        <span className="px-2 py-1 text-[10px] font-mono rounded-full bg-secondary text-primary">
          EMBEDDING v3
        </span>
      </div>

      <div className="space-y-3">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.3 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">{skill.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{skill.category}</span>
              </div>
              <span className="text-xs font-mono text-primary">{skill.level}%</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: i * 0.05 + 0.5, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background:
                    skill.level >= 80
                      ? "var(--gradient-success)"
                      : skill.level >= 60
                      ? "var(--gradient-primary)"
                      : "var(--gradient-warm)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Skill Volatility</span>
          <span className="text-xs font-mono text-glow-warning">Medium</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">Cluster</span>
          <span className="text-xs font-mono text-primary">Full-Stack Engineer</span>
        </div>
      </div>
    </div>
  );
};

export default SkillRadar;
