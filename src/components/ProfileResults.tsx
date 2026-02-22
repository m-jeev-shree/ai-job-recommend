import { motion } from "framer-motion";
import { Sparkles, Eye, TrendingUp, Zap, AlertTriangle } from "lucide-react";

interface ProfileData {
  extracted_skills: { name: string; category: string; confidence: number }[];
  skill_levels: Record<string, number>;
  career_trajectory: string;
  career_cluster: string;
  skill_vector: { category: string; weight: number }[];
  hidden_skills: { name: string; reason: string }[];
  ai_confidence: number;
  summary: string;
}

const ProfileResults = ({ profile }: { profile: ProfileData }) => {
  return (
    <div className="space-y-4">
      {/* Summary & Cluster */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">AI Profile Summary</span>
          </div>
          <span className="text-xs font-mono text-primary">Confidence: {profile.ai_confidence}%</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{profile.summary}</p>
        <div className="flex gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-secondary">
            <span className="text-[10px] text-muted-foreground block">Cluster</span>
            <span className="text-xs font-semibold gradient-text">{profile.career_cluster}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-secondary flex-1">
            <span className="text-[10px] text-muted-foreground block">Trajectory</span>
            <span className="text-xs font-medium text-foreground">{profile.career_trajectory}</span>
          </div>
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Extracted Skills</span>
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">{profile.extracted_skills.length} found</span>
        </div>
        <div className="space-y-2">
          {profile.extracted_skills.slice(0, 12).map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{skill.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{skill.category}</span>
                </div>
                <span className="text-[10px] font-mono text-primary">
                  {Math.min(100, profile.skill_levels[skill.name] ?? Math.round(skill.confidence * 100))}%
                </span>
              </div>
              <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, profile.skill_levels[skill.name] ?? skill.confidence * 100)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.03 }}
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hidden Skills */}
      {profile.hidden_skills?.length > 0 && (
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Hidden Skills Detected</span>
          </div>
          <div className="space-y-2">
            {profile.hidden_skills.map((skill) => (
              <div key={skill.name} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50">
                <AlertTriangle className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-medium text-foreground">{skill.name}</span>
                  <p className="text-[10px] text-muted-foreground">{skill.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Vector */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-glow-success" />
          <span className="text-sm font-semibold text-foreground">Skill Vector</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skill_vector.map((v) => (
            <div
              key={v.category}
              className="px-3 py-1.5 rounded-full bg-secondary text-xs font-mono"
              style={{ opacity: 0.4 + v.weight * 0.6 }}
            >
              <span className="text-foreground">{v.category}</span>
              <span className="text-primary ml-1">{(v.weight * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileResults;
