import { motion } from "framer-motion";
import { Briefcase, MapPin, TrendingUp, Sparkles } from "lucide-react";

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    company: "Anthropic",
    location: "San Francisco, CA",
    match: 94,
    salary: "$180K - $250K",
    reasons: ["Skill vector 96% overlap", "Career trajectory match", "Assessment score qualifies"],
    tags: ["React", "TypeScript", "Python", "ML"],
  },
  {
    title: "Staff Software Engineer",
    company: "Stripe",
    location: "Remote",
    match: 89,
    salary: "$200K - $280K",
    reasons: ["System design expertise", "Strong collaborative filter match", "Experience level fit"],
    tags: ["TypeScript", "Node.js", "Distributed Systems"],
  },
  {
    title: "ML Platform Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    match: 78,
    salary: "$220K - $320K",
    reasons: ["Growing ML skills detected", "High career growth probability", "Skill gap closable"],
    tags: ["Python", "ML", "Infrastructure"],
    skillGap: true,
  },
];

const RecommendationList = () => {
  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Job Recommendations</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hybrid engine • Content + Collaborative + Embedding Similarity
          </p>
        </div>
        <span className="px-2 py-1 text-[10px] font-mono rounded-full bg-secondary text-primary">
          LEARNING-TO-RANK
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {jobs.map((job, i) => (
          <motion.div
            key={job.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.5 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-lg p-4 cursor-pointer transition-all hover:border-primary/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-lg font-bold gradient-text">{job.match}%</span>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-foreground mb-1">{job.title}</h4>
            <p className="text-xs text-muted-foreground mb-1">{job.company}</p>
            <div className="flex items-center gap-1 mb-3">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{job.location}</span>
              <span className="text-[10px] text-glow-success ml-2 font-mono">{job.salary}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-secondary text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Explainability */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-mono text-primary">WHY RECOMMENDED</span>
              </div>
              {job.reasons.map((reason) => (
                <p key={reason} className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  {reason}
                </p>
              ))}
              {job.skillGap && (
                <div className="mt-2 px-2 py-1 rounded bg-glow-warning/10 border border-glow-warning/20">
                  <span className="text-[10px] font-mono text-glow-warning">⚠ Skill gap detected — Course suggested</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
