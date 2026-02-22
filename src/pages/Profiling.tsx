import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/Sidebar";
import ProfileResults from "@/components/ProfileResults";

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

const Profiling = () => {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!experience && !skills) {
      setError("Please provide at least your experience or skills.");
      return;
    }
    setError("");
    setLoading(true);
    setProfile(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-profile", {
        body: { name, experience, skills, goals },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setProfile(data.profile);

      // Save to database
      const sessionId = crypto.randomUUID();
      await supabase.from("user_profiles").insert({
        session_id: sessionId,
        full_name: name,
        experience_text: experience,
        skills_text: skills,
        goals_text: goals,
        ai_extracted_skills: data.profile.extracted_skills,
        skill_levels: data.profile.skill_levels,
        career_cluster: data.profile.career_cluster,
        career_trajectory: data.profile.career_trajectory,
        skill_vector: data.profile.skill_vector,
        ai_confidence: data.profile.ai_confidence,
        raw_ai_response: data.profile,
      });
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AI User Profiling</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-12">
              NLP-powered skill extraction • Embedding similarity • Career clustering
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Career Questionnaire</h2>
                <span className="text-[10px] font-mono text-muted-foreground ml-auto">AI-ANALYZED</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Experience & Background
                    <span className="text-primary ml-1">*</span>
                  </label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={4}
                    placeholder="Describe your work experience, projects, roles... The AI will extract hidden skills and patterns from your free text."
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Skills & Technologies
                    <span className="text-primary ml-1">*</span>
                  </label>
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows={3}
                    placeholder="List your skills, technologies, frameworks, tools, certifications..."
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Career Goals</label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={2}
                    placeholder="Where do you see yourself in 2-5 years? What roles interest you?"
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-glow-danger">{error}</p>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all disabled:opacity-50"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Run AI Profile Analysis
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-lg p-6 flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    <Brain className="w-12 h-12 text-primary animate-pulse-glow" />
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                  <p className="text-sm font-medium text-foreground mt-4">Neural Analysis in Progress</p>
                  <div className="mt-3 space-y-1.5 text-[10px] font-mono text-muted-foreground">
                    {[
                      "Extracting skills via NLP...",
                      "Building embedding vectors...",
                      "Classifying career cluster...",
                      "Detecting hidden skills...",
                      "Computing skill levels...",
                    ].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <ChevronRight className="w-3 h-3 text-primary" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              {!loading && profile && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ProfileResults profile={profile} />
                </motion.div>
              )}
              {!loading && !profile && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-lg p-6 flex flex-col items-center justify-center text-center"
                >
                  <Brain className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Fill in the questionnaire and run AI analysis</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Real NLP-powered profiling, not rule-based</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profiling;
